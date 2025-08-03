# Tauri + React + Typescript

This template should help get you started developing with Tauri, React and Typescript in Vite.

## Recommended IDE Setup

- [VS Code](https://code.visualstudio.com/) + [Tauri](https://marketplace.visualstudio.com/items?itemName=tauri-apps.tauri-vscode) + [rust-analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer)

# TODO

- Add container ports to container table
- Update the data shown in the expanded panel when a row is clicked
- Consider storing containers and images in state so we don't have to refetch them
- Update containers and images periodically or via bollards event system https://docs.rs/bollard/latest/bollard/struct.Docker.html#method.events
- Add in error handling, for instance the app crashes if the docker daemon is not running
- Consider what to do when the docker daemon stops while the app is running
- Consider moving to TanstackTable as this has more free features over MUI DataGrid
- Add loading state for DataGrids (will be useful for slow computers)
