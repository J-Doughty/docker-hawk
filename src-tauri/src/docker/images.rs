use bollard::{query_parameters::ListImagesOptionsBuilder, secret::ImageSummary};

use crate::docker::DockerConnection;

pub async fn get_all_images(docker: &DockerConnection) -> Result<Vec<ImageSummary>, String> {
    let options = ListImagesOptionsBuilder::new().all(true).build();

    docker
        .client
        .list_images(Some(options))
        .await
        .map_err(|err| format!("{err}"))
}
