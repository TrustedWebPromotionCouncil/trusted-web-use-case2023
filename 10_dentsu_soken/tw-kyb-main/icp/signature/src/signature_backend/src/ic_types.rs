use candid::CandidType;
use serde::{Deserialize, Serialize};

#[derive(Debug, CandidType, Deserialize, Clone)]
pub struct RawHttpRequest {
    pub(crate) method: String,
    pub(crate) url: String,
    pub(crate) headers: Vec<(String, String)>,
    pub(crate) body: Vec<u8>,
}

#[derive(CandidType, Serialize)]
pub struct RawHttpResponse {
    pub(crate) status_code: u16,
    pub(crate) headers: Vec<(String, String)>,
    pub(crate) body: Vec<u8>,
    pub(crate) upgrade: Option<bool>,
}
