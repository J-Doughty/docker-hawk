use std::{string::FromUtf8Error};

use thiserror::Error;
use serde::{Serialize, Serializer};

#[derive(Debug, Error)]
#[error("{inner}")]
pub struct SerializableFromUtf8Error {
    inner: FromUtf8Error,
}

impl From<FromUtf8Error> for SerializableFromUtf8Error {
    fn from(err: FromUtf8Error) -> Self {
        SerializableFromUtf8Error { inner: err }
    }
}

impl Serialize for SerializableFromUtf8Error {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: Serializer,
    {
        serializer.serialize_str(&self.inner.to_string())
    }
}

// impl Display for SerializableFromUtf8Error {
//     fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
//         write!(f, "{}", self.inner)
//     }
// }