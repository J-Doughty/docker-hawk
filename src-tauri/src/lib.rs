use tokio::sync::Mutex;

mod app_state;
mod commands;
mod docker;
mod errors;
mod responses;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_opener::init())
        // TODO update this so initial call is handled differently, dont do an unwrap here
        // consider RwLock so we can read without acquiring the lock
        .manage(Mutex::new(app_state::AppState::new()))
        .invoke_handler(tauri::generate_handler![
            commands::shell::say_hello,
            commands::docker::list_images,
            commands::docker::list_containers,
            commands::docker::start_container,
            commands::docker::stop_container,
            commands::docker::delete_container,
            commands::docker::first_time_setup,
        ])
        .setup(|app| {
            // TODO pass down app state
            docker::event_listener::start_docker_event_listener();
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
