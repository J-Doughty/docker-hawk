use tauri_plugin_shell::ShellExt;

mod errors;
use crate::errors::{shell::ExecuteCommandError, strings::SerializableFromUtf8Error};

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
async fn say_hello(app_handle: tauri::AppHandle, name: &str) -> Result<String, ExecuteCommandError> {
    let shell = app_handle.shell();

    let output = shell
        .command("echo")
        .args([format!("Hello, {name}!")])
        .output()
        .await?;

    let command_output = String::from_utf8(output.stdout)
        .map_err(SerializableFromUtf8Error::from)?;

    return Ok(command_output);
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![greet, say_hello])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
