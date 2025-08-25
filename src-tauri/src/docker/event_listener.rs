use bollard::query_parameters::EventsOptions;
use bollard::secret::EventMessage;
use bollard::{errors::Error, secret::EventMessageTypeEnum};
use futures::{Stream, StreamExt};

use crate::docker::DockerConnection;

pub fn start_docker_event_listener(docker_connection: DockerConnection) {
    tauri::async_runtime::spawn(async move {
        let stream = docker_connection.client.events(Some(EventsOptions {
            filters: Default::default(),
            since: None,
            until: None,
        }));

        handle_docker_events(stream).await;
    });
}

async fn handle_docker_events<T>(mut stream: T)
where
    T: Stream<Item = Result<EventMessage, Error>> + Unpin,
{
    while let Some(Ok(event)) = stream.next().await {
        if let Some(ref event_type) = event.typ {
            if event_type == &EventMessageTypeEnum::CONTAINER {
                println!("Container {:?}", event);
            } else if event_type == &EventMessageTypeEnum::IMAGE {
                println!("Image {:?}", event);
            }
        }
    }
}
