use bollard::{query_parameters::ListContainersOptionsBuilder, secret::ContainerSummary};

use crate::docker::DockerConnection;

pub async fn get_all_containers(
    docker: &DockerConnection,
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
