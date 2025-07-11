use bollard::{
    query_parameters::{ListContainersOptionsBuilder, ListImagesOptionsBuilder},
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
