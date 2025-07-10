use bollard::{query_parameters::ListImagesOptions, secret::ImageSummary};
use tauri::State;

use crate::DockerConnection;

#[tauri::command]
pub async fn list_images(docker: State<'_, DockerConnection>) -> Result<Vec<ImageSummary>, String> {
    docker.client.list_images(
        Some(ListImagesOptions {
            all: true,
            ..Default::default()
        })
    ).await.map_err(|err| format!("{err}"))
}
