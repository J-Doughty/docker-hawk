use serde::Serialize;

use crate::errors::strings;

#[derive(thiserror::Error, Debug, Serialize)]
pub enum ExecuteCommandError {
    #[error("Shell execution failed: {0}")]
    ShellError(#[from] tauri_plugin_shell::Error),

    #[error("Invalid UTF-8 output: {0}")]
    Utf8Error(#[from] strings::SerializableFromUtf8Error),
}
