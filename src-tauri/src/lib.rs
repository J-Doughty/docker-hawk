use std::sync::Arc;

use bollard::Docker;
use tauri_plugin_shell::ShellExt;

mod commands;
mod errors;
use crate::errors::{shell::ExecuteCommandError, strings::SerializableFromUtf8Error};

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
async fn say_hello(
    app_handle: tauri::AppHandle,
    name: &str,
) -> Result<String, ExecuteCommandError> {
    let shell = app_handle.shell();

    let output = shell
        .command("echo")
        .args([format!("Hello, {name}!")])
        .output()
        .await?;

    let command_output =
        String::from_utf8(output.stdout).map_err(SerializableFromUtf8Error::from)?;

    return Ok(command_output);
}

struct DockerConnection {
    pub client: Arc<Docker>,
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let docker = Docker::connect_with_socket_defaults().unwrap();
    let docker_connection = DockerConnection {
        client: docker.into(),
    };

    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_opener::init())
        .manage(docker_connection)
        .invoke_handler(tauri::generate_handler![
            greet,
            say_hello,
            commands::docker::list_images,
            commands::docker::list_containers,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
