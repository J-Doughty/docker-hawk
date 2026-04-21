use bollard::{
    query_parameters::{
        ListContainersOptionsBuilder, ListImagesOptionsBuilder, RemoveContainerOptions,
        StartContainerOptions, StopContainerOptions,
    },
    secret::{ContainerSummary, ImageSummary},
};
use tauri::State;

use crate::app_state::AppState;
use crate::docker::containers;
use crate::docker::images;

#[tauri::command]
pub async fn list_images(state: State<'_, AppState>) -> Result<Vec<ImageSummary>, String> {
    let options = ListImagesOptionsBuilder::new().all(true).build();
    images::get_all_images(&state.docker_connection, options).await
}

#[tauri::command]
pub async fn list_containers(
    state: State<'_, AppState>,
    include_stopped: Option<bool>,
) -> Result<Vec<ContainerSummary>, String> {
    let options = ListContainersOptionsBuilder::new()
        .all(include_stopped.unwrap_or(true))
        .build();

    containers::get_all_containers(&state.docker_connection, options).await
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
