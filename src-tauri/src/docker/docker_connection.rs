use bollard::Docker;

pub struct DockerConnection {
    pub client: Docker,
}

impl DockerConnection {
    pub fn new() -> DockerConnection {
        let docker = Docker::connect_with_socket_defaults().unwrap();

        DockerConnection {
            client: docker.into(),
        }
    }
}
