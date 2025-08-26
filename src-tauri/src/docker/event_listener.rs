use std::thread::sleep;
use std::time::Duration;

use bollard::query_parameters::EventsOptions;
use bollard::secret::EventMessage;
use bollard::{errors::Error, secret::EventMessageTypeEnum};
use futures::{Stream, StreamExt};

use crate::docker::DockerConnection;

const RETRY_DELAY: Duration = Duration::from_secs(5);

pub fn start_docker_event_listener() {
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

                handle_docker_events(stream).await;
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

async fn handle_docker_events<T>(mut stream: T)
where
    T: Stream<Item = Result<EventMessage, Error>> + Unpin,
{
    while let Some(event) = stream.next().await {
        match event {
            Ok(event_message) => handle_docker_event(event_message),
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

fn handle_docker_event(event: EventMessage) {
    if let Some(ref event_type) = event.typ {
        if event_type == &EventMessageTypeEnum::CONTAINER {
            println!("Container {:?}", event);
        } else if event_type == &EventMessageTypeEnum::IMAGE {
            println!("Image {:?}", event);
        }
    }
}
