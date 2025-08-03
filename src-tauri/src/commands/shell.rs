use crate::errors::{shell::ExecuteCommandError, strings::SerializableFromUtf8Error};
use tauri_plugin_shell::ShellExt;

// This is just an example of how we can run commands in the shell
//  and perfom more advanced error handling
//  it is no longer used, may be removed in future
#[tauri::command]
pub async fn say_hello(
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
