use bollard::secret::ContainerSummary;
use bollard::secret::ImageSummary;
use serde::Serialize;
use tokio::sync::MutexGuard;

use crate::app_state::AppState;

#[derive(Serialize)]
pub struct InitialSetupResponse {
    pub inital_setup_complete: bool,
    pub containers: Option<Vec<ContainerSummary>>,
    pub images: Option<Vec<ImageSummary>>,
}

impl InitialSetupResponse {
    pub fn from(app_state: &MutexGuard<'_, AppState>) -> InitialSetupResponse {
        InitialSetupResponse {
            inital_setup_complete: app_state.inital_setup_complete,
            containers: app_state.containers.clone(),
            images: app_state.images.clone(),
        }
    }
}
