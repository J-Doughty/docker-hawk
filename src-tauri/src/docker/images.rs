use bollard::{query_parameters::ListImagesOptions, secret::ImageSummary};

use crate::docker::DockerConnection;

pub async fn get_all_images(
    docker: &DockerConnection,
    options: ListImagesOptions,
) -> Result<Vec<ImageSummary>, String> {
    docker
        .client
        .list_images(Some(options))
        .await
        .map_err(|err| format!("{err}"))
}
