use thiserror::Error;

#[derive(Debug, Error)]
pub enum DockerEventError {
    #[error("Failed to fetch containers")]
    Containers(String),

    #[error("Failed to fetch images")]
    // TODO maybe change this to proper bollard error type
    // Images(#[source] bollard::errors::Error),
    Images(String),

    #[error("Failed to emit event")]
    Emit(#[from] tauri::Error),
}
