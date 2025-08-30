use tokio::sync::Mutex;

use bollard::{
    query_parameters::{RemoveContainerOptions, StartContainerOptions, StopContainerOptions},
    secret::{ContainerSummary, ImageSummary},
};
use tauri::State;

use crate::app_state::AppState;
// TODO rename continer and images modules
use crate::docker::containers;
use crate::docker::images;
use crate::responses::InitialSetupResponse;

// TODO move to setup
#[tauri::command]
pub async fn first_time_setup(
    state: State<'_, Mutex<AppState>>,
) -> Result<InitialSetupResponse, String> {
    let mut app_state = state.lock().await;

    if (app_state.inital_setup_complete) {
        return Ok(InitialSetupResponse::from(&app_state));
    }

    let docker_images = images::get_all_images(&app_state.docker_connection).await?;
    let docker_containers =
        containers::get_all_containers(&app_state.docker_connection, Some(true)).await?;

    app_state.images = Some(docker_images);
    app_state.containers = Some(docker_containers);

    app_state.inital_setup_complete = true;

    Ok(InitialSetupResponse::from(&app_state))
}

// TODO rename to get all images
#[tauri::command]
pub async fn list_images(
    state: State<'_, Mutex<AppState>>,
) -> Result<Option<Vec<ImageSummary>>, ()> {
    let app_state = state.lock().await;
    println!("images: {:?}", app_state.images);
    Ok(app_state.images.clone())
}

#[tauri::command]
pub async fn list_containers(
    state: State<'_, Mutex<AppState>>,
) -> Result<Option<Vec<ContainerSummary>>, String> {
    let app_state = state.lock().await;

    Ok(app_state.containers.clone())
}

#[tauri::command]
pub async fn start_container(
    state: State<'_, AppState>,
    container_name: &str,
) -> Result<(), String> {
    // TODO add in some logging around these and recording of errors
    state
        .docker_connection
        .client
        .start_container(container_name, None::<StartContainerOptions>)
        .await
        .map_err(|err| format!("{err}"))
}

#[tauri::command]
pub async fn stop_container(
    state: State<'_, AppState>,
    container_name: &str,
) -> Result<(), String> {
    state
        .docker_connection
        .client
        .stop_container(container_name, None::<StopContainerOptions>)
        .await
        .map_err(|err| format!("{err}"))
}

#[tauri::command]
pub async fn delete_container(
    state: State<'_, AppState>,
    container_name: &str,
) -> Result<(), String> {
    state
        .docker_connection
        .client
        .remove_container(container_name, None::<RemoveContainerOptions>)
        .await
        .map_err(|err| format!("{err}"))
}
