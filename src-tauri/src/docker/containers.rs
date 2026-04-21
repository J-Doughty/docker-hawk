use bollard::{query_parameters::ListContainersOptions, secret::ContainerSummary};

use crate::docker::DockerConnection;

pub async fn get_all_containers(
    docker: &DockerConnection,
    options: ListContainersOptions,
) -> Result<Vec<ContainerSummary>, String> {
    docker
        .client
        .list_containers(Some(options))
        .await
        .map_err(|err| format!("{err}"))
}
