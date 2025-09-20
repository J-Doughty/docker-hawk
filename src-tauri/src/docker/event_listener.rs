use std::sync::Arc;
use std::thread::sleep;
use std::time::Duration;
use tokio::sync::Mutex;

use bollard::query_parameters::EventsOptions;
use bollard::secret::EventMessage;
use bollard::{errors::Error, secret::EventMessageTypeEnum};
use futures::{Stream, StreamExt};
use tauri::{App, AppHandle, Emitter, Manager, State};

use crate::app_state::AppState;
use crate::docker::containers;
use crate::docker::DockerConnection;

const RETRY_DELAY: Duration = Duration::from_secs(5);

pub fn start_docker_event_listener(app: &mut App) {
    let app_handle = app.app_handle().clone();
    let app_state = app.state::<Arc<Mutex<AppState>>>().inner().clone();

    tauri::async_runtime::spawn(async move {
        loop {
            let new_docker_connection = DockerConnection::new();

            if let Ok(docker_connection) = new_docker_connection {
                println!("Listening for docker events");

                let stream = docker_connection.client.events(Some(EventsOptions {
                    filters: Default::default(),
                    since: None,
                    until: None,
                }));

                handle_docker_events(&app_handle, &app_state, &docker_connection, stream).await;
            };

            println!(
                "The docker event listener stopped, waiting for {} seconds",
                RETRY_DELAY.as_secs()
            );
            sleep(RETRY_DELAY);
            println!("Attempting to restart docker event listener");
        }
    });
}

async fn handle_docker_events<T>(
    app_handle: &AppHandle,
    app_state: &Arc<Mutex<AppState>>,
    docker_connection: &DockerConnection,
    mut stream: T,
) where
    T: Stream<Item = Result<EventMessage, Error>> + Unpin,
{
    while let Some(event) = stream.next().await {
        match event {
            Ok(event_message) => {
                handle_docker_event(&app_handle, &app_state, docker_connection, event_message).await
            }
            Err(err) => {
                // If an error here it likely means the docker daemon stopped
                println!(
                    "Unexpected error occured when running the docker event listener: {:?}",
                    err
                );
                break;
            }
        };
    }
}

async fn handle_docker_event(
    app_handle: &AppHandle,
    app_state: &Arc<Mutex<AppState>>,
    docker_connection: &DockerConnection,
    event: EventMessage,
) {
    if let Some(ref event_type) = event.typ {
        if event_type == &EventMessageTypeEnum::CONTAINER {
            // TODO Why do i even store the containers in state i can just send an event when they change and refetch it on the frotnend when they go to that page
            // TODO could also get the container id from the message and just send that container
            println!("Container {:?}", event);
            let updated_containers =
                containers::get_all_containers(docker_connection, Some(true)).await;

            let mut app_state = app_state.lock().await;
            app_state.containers = updated_containers.clone().ok();

            if let Ok(container_event) = updated_containers {
                app_handle.emit("containers-updated", &container_event);
            }
        } else if event_type == &EventMessageTypeEnum::IMAGE {
            println!("Image {:?}", event);
        }
    }
}
