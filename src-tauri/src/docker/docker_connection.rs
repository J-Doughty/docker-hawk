use bollard::{errors::Error, Docker};

pub struct DockerConnection {
    pub client: Docker,
}

impl DockerConnection {
    pub fn new() -> Result<DockerConnection, Error> {
        let docker = Docker::connect_with_socket_defaults().unwrap();

        Ok(DockerConnection {
            client: docker.into(),
        })
    }
}
