use bollard::{
    query_parameters::{ListContainersOptions, ListImagesOptions},
    secret::{ContainerSummary, ImageSummary},
};
use tauri::State;

use crate::DockerConnection;

#[tauri::command]
pub async fn list_images(docker: State<'_, DockerConnection>) -> Result<Vec<ImageSummary>, String> {
    docker
        .client
        .list_images(Some(ListImagesOptions {
            all: true,
            ..Default::default()
        }))
        .await
        .map_err(|err| format!("{err}"))
}

#[tauri::command]
pub async fn list_containers(
    docker: State<'_, DockerConnection>,
) -> Result<Vec<ContainerSummary>, String> {
    docker
        .client
        .list_containers(Some(ListContainersOptions {
            all: true,
            ..Default::default()
        }))
        .await
        .map_err(|err| format!("{err}"))
}
