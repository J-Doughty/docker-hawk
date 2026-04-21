use crate::docker::DockerConnection;

pub struct AppState {
    pub docker_event_listener_running: bool,
    // TODO This can go down while the app is running so we should come up with some other solution
    pub docker_connection: DockerConnection,
}

impl AppState {
    pub fn new() -> AppState {
        AppState {
            docker_event_listener_running: false,
            // TODO we are unsafely unwrapping this
            docker_connection: DockerConnection::new().unwrap(),
        }
    }
}
