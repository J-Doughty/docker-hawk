use std::sync::Arc;
use bollard::Docker;

pub struct DockerConnection {
    pub client: Docker,
}
