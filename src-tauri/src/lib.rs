mod commands;
mod docker;
mod errors;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_opener::init())
        .manage(docker::DockerConnection::new())
        .invoke_handler(tauri::generate_handler![
            commands::shell::say_hello,
            commands::docker::list_images,
            commands::docker::list_containers,
            commands::docker::start_container,
            commands::docker::stop_container,
            commands::docker::delete_container,
        ])
        .setup(|app| {
            // TODO restart this if docker connection drops or if the thread panics for some other reason
            docker::event_listener::start_docker_event_listener(docker::DockerConnection::new());
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
