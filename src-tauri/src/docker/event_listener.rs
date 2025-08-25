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
            let docker_connection = DockerConnection::new();
            let stream = docker_connection.client.events(Some(EventsOptions {
                filters: Default::default(),
                since: None,
                until: None,
            }));

            handle_docker_events(stream).await;
            sleep(RETRY_DELAY);
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
            // TODO need to exit this if an error is raised here as it may need to reconnect
            Err(err) => println!(
                "Unexpected error occured when running the docker event listener: {:?}",
                err
            ),
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
