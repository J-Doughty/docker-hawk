use bollard::secret::ContainerSummary;
use bollard::secret::ImageSummary;

use crate::docker::DockerConnection;

pub struct AppState {
    pub inital_setup_complete: bool,
    pub docker_event_listener_running: bool,
    pub containers: Option<Vec<ContainerSummary>>,
    pub images: Option<Vec<ImageSummary>>,
    // TODO This can go down while the app is running so we should come up with some other solution
    pub docker_connection: DockerConnection,
}

impl AppState {
    pub fn new() -> AppState {
        AppState {
            inital_setup_complete: false,
            docker_event_listener_running: false,
            containers: None,
            images: None,
            // TODO we are unsafely unwrapping this
            docker_connection: DockerConnection::new().unwrap(),
        }
    }
}
