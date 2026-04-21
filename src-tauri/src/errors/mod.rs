pub mod shell {
    pub mod execute_command_error;

    pub use execute_command_error::ExecuteCommandError;
}

pub mod strings {
    pub mod serializable_from_utf8_error;

    pub use serializable_from_utf8_error::SerializableFromUtf8Error;
}

pub mod docker {
    pub mod event_listener;

    pub use event_listener::DockerEventError;
}
