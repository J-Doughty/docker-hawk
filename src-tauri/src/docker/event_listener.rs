use std::thread::sleep;
use std::time::Duration;

use bollard::query_parameters::{
    EventsOptions, ListContainersOptionsBuilder, ListImagesOptionsBuilder,
};
use bollard::secret::EventMessage;
use bollard::{errors::Error, secret::EventMessageTypeEnum};
use futures::{Stream, StreamExt};
use tauri::{AppHandle, Emitter};

use crate::docker::DockerConnection;
use crate::docker::{containers, images};
use crate::errors::docker::DockerEventError;

const RETRY_DELAY: Duration = Duration::from_secs(5);

pub fn start_docker_event_listener(app_handle: AppHandle) {
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

                handle_docker_events(&app_handle, &docker_connection, stream).await;
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
    docker_connection: &DockerConnection,
    mut stream: T,
) where
    T: Stream<Item = Result<EventMessage, Error>> + Unpin,
{
    // TODO use log crate
    while let Some(event) = stream.next().await {
        let event_message = match event {
            Ok(msg) => msg,
            Err(err) => {
                // A critical error has occured e.g the Docker Daemon has stopped
                println!(
                    "Unexpected error occured when running the docker event listener: {:?}",
                    err
                );
                break;
            }
        };

        if let Err(err) = handle_docker_event(app_handle, docker_connection, &event_message).await {
            println!(
                "Failed to handle docker event: {:?}. {:?}",
                event_message, err
            );
        }
    }
}

async fn handle_docker_event(
    app_handle: &AppHandle,
    docker_connection: &DockerConnection,
    event: &EventMessage,
) -> Result<(), DockerEventError> {
    let Some(event_type) = &event.typ else {
        return Ok(());
    };

    match event_type {
        EventMessageTypeEnum::CONTAINER => {
            println!("Container {:?}", event);

            let containers = containers::get_all_containers(
                docker_connection,
                ListContainersOptionsBuilder::new().all(true).build(),
            )
            .await
            .map_err(DockerEventError::Containers)?;

            app_handle.emit("containers-updated", &containers)?;
        }
        EventMessageTypeEnum::IMAGE => {
            println!("Image {:?}", event);

            let images = images::get_all_images(
                docker_connection,
                ListImagesOptionsBuilder::new().all(true).build(),
            )
            .await
            .map_err(DockerEventError::Images)?;

            app_handle.emit("images-updated", &images)?;
        }
        _ => {}
    }

    Ok(())
}
