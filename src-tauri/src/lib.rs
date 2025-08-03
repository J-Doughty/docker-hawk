use std::sync::Arc;

use bollard::Docker;

mod commands;
mod errors;

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
            commands::shell::say_hello,
            commands::docker::list_images,
            commands::docker::list_containers,
            commands::docker::start_container,
            commands::docker::stop_container,
            commands::docker::delete_container,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
