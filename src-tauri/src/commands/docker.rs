use bollard::{
    query_parameters::{
        ListContainersOptionsBuilder, ListImagesOptionsBuilder, RemoveContainerOptions,
        StartContainerOptions, StopContainerOptions,
    },
    secret::{ContainerSummary, ImageSummary},
};
use tauri::State;

use crate::DockerConnection;

#[tauri::command]
pub async fn list_images(docker: State<'_, DockerConnection>) -> Result<Vec<ImageSummary>, String> {
    let options = ListImagesOptionsBuilder::new().all(true).build();

    docker
        .client
        .list_images(Some(options))
        .await
        .map_err(|err| format!("{err}"))
}

#[tauri::command]
pub async fn list_containers(
    docker: State<'_, DockerConnection>,
    include_stopped: Option<bool>,
) -> Result<Vec<ContainerSummary>, String> {
    let options = ListContainersOptionsBuilder::new()
        .all(include_stopped.unwrap_or(true))
        .build();

    docker
        .client
        .list_containers(Some(options))
        .await
        .map_err(|err| format!("{err}"))
}

#[tauri::command]
pub async fn start_container(
    docker: State<'_, DockerConnection>,
    container_name: &str,
) -> Result<(), String> {
    // TODO add in some logging around these and recording of errors
    docker
        .client
        .start_container(container_name, None::<StartContainerOptions>)
        .await
        .map_err(|err| format!("{err}"))
}

#[tauri::command]
pub async fn stop_container(
    docker: State<'_, DockerConnection>,
    container_name: &str,
) -> Result<(), String> {
    docker
        .client
        .stop_container(container_name, None::<StopContainerOptions>)
        .await
        .map_err(|err| format!("{err}"))
}

#[tauri::command]
pub async fn delete_container(
    docker: State<'_, DockerConnection>,
    container_name: &str,
) -> Result<(), String> {
    docker
        .client
        .remove_container(container_name, None::<RemoveContainerOptions>)
        .await
        .map_err(|err| format!("{err}"))
}
