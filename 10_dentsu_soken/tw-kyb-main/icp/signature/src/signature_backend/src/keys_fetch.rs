use std::time::{Duration, SystemTime};

use crate::error::SignatureError;
use crate::fetch;
use crate::jwk_keys::{JwkKey, JwkKeys};
use crate::serde_json_utils;
use async_trait::async_trait;
use ic_cdk::api::management_canister::http_request::{
    CanisterHttpRequestArgument, HttpMethod, HttpResponse,
};
#[cfg(test)]
use mockall::automock;
use serde::{Deserialize, Serialize};

const KEYS_URL: &str =
    "https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com";

const MAX_AGE: Duration = Duration::from_secs(3600);

#[derive(Debug, Serialize, Deserialize)]
pub struct KeyResponse {
    pub keys: Vec<JwkKey>,
}

#[cfg_attr(test, automock)]
#[async_trait(?Send)]
pub trait KeysFetchInternal {
    async fn fetch_keys_internal(&self) -> Result<HttpResponse, SignatureError>;
}

pub struct KeysFetchInternalImpl;

#[async_trait(?Send)]
impl KeysFetchInternal for KeysFetchInternalImpl {
    async fn fetch_keys_internal(&self) -> Result<HttpResponse, SignatureError> {
        let arg = CanisterHttpRequestArgument {
            url: KEYS_URL.to_string(),
            max_response_bytes: Some(3000),
            method: HttpMethod::GET,
            headers: vec![],
            body: None,
            transform: None,
        };

        fetch::fetch(arg, transform).await
    }
}

fn transform(res: HttpResponse) -> HttpResponse {
    HttpResponse {
        status: res.status,
        headers: vec![],
        body: normalize_body(&res.body).unwrap_or(res.body),
    }
}

pub struct KeysFetcher<I>
where
    I: KeysFetchInternal,
{
    internal: I,
}

impl<I> KeysFetcher<I>
where
    I: KeysFetchInternal,
{
    pub fn new(internal: I) -> Self {
        Self { internal }
    }

    pub async fn fetch_keys(&self, fetch_time: SystemTime) -> Result<JwkKeys, SignatureError> {
        let response = self.internal.fetch_keys_internal().await?;
        let keys = body_to_keys(&response.body)?;

        Ok(JwkKeys::new(keys, fetch_time, MAX_AGE))
    }
}

// pub struct KeysFetcher<F>
// where
//     F: Fetch,
// {
//     fetch: F,
// }

// impl<F> KeysFetcher<F>
// where
//     F: Fetch,
// {
//     pub fn new(fetch: F) -> Self {
//         Self { fetch }
//     }

//     pub async fn fetch_keys(&self, fetch_time: SystemTime) -> Result<JwkKeys, SignatureError> {
//         let response = self.fetch_keys_internal().await?;
//         let keys = body_to_keys(&response.body)?;
//         // let cache_control_value = self.find_cache_control_value(&response.headers);
//         // let max_age = max_age::get_max_age(cache_control_value).unwrap_or(FALLBACK_MAX_AGE);

//         Ok(JwkKeys::new(keys, fetch_time, MAX_AGE))
//     }

//     async fn fetch_keys_internal(&self) -> Result<HttpResponse, SignatureError> {
//         let arg = CanisterHttpRequestArgument {
//             url: KEYS_URL.to_string(),
//             max_response_bytes: Some(3000),
//             method: HttpMethod::GET,
//             headers: vec![],
//             body: None,
//             transform: Some(TransformContext::from_name("transform".to_string(), vec![])),
//         };

//         let response = self.fetch.fetch(arg).await?;

//         Ok(response)
//     }

//     // fn find_cache_control_value(&self, headers: &[HttpHeader]) -> Option<String> {
//     //     let cache_control_header = headers
//     //         .iter()
//     //         .find(|&h| String::from("cache-control").eq(&h.name.to_lowercase()));

//     //     cache_control_header.map(|header| header.value.to_owned())
//     // }
// }

// #[query(name = "transform_keys")]
// pub fn transform_keys(args: TransformArgs) -> HttpResponse {
//     HttpResponse {
//         status: args.response.status.clone(),
//         body: normalize_body(&args.response.body).unwrap_or(args.response.body),
//         headers: Vec::new(),
//     }
// }

fn body_to_keys(body: &[u8]) -> Result<Vec<JwkKey>, SignatureError> {
    let key_res: KeyResponse = serde_json_utils::from_slice(body)?;
    // let key_res: KeyResponse =
    //     serde_json::from_slice(body).map_err(|e| SignatureError::SerdeError(e.to_string()))?;
    Ok(key_res.keys)
}

fn sort_keys(keys: &mut [JwkKey]) {
    keys.sort_by(|a, b| a.kid.cmp(&b.kid));
}

fn keys_to_body(keys: &[JwkKey]) -> Result<Vec<u8>, SignatureError> {
    let key_res = KeyResponse {
        keys: keys.to_vec(),
    };
    let body = serde_json_utils::to_bytes(&key_res)?;
    // let body = serde_json::to_string(&key_res)
    //     .map_err(|e| SignatureError::SerdeError(e.to_string()))?
    //     .into_bytes();
    Ok(body)
}

pub fn normalize_body(body: &[u8]) -> Result<Vec<u8>, SignatureError> {
    let mut keys = body_to_keys(body)?;
    sort_keys(&mut keys);
    keys_to_body(&keys)
}

#[cfg(test)]
mod tests {
    use super::*;
    use candid::Nat;

    #[tokio::test]
    async fn test_fetch_keys_internal() {
        let key = JwkKey {
            e: "e".to_owned(),
            alg: "alg".to_string(),
            kty: "kty".to_string(),
            kid: "kid".to_string(),
            n: "n".to_string(),
        };
        let keys = vec![key];
        let key_res = KeyResponse { keys };
        let body = serde_json::to_string(&key_res).unwrap().into_bytes();
        let res = HttpResponse {
            status: Nat::from(200_u8),
            body,
            headers: vec![],
        };
        let mut internal = MockKeysFetchInternal::new();
        internal
            .expect_fetch_keys_internal()
            .return_once(|| Ok(res));

        let ret = internal.fetch_keys_internal().await;
        assert!(ret.is_ok());
    }

    #[tokio::test]
    async fn test_fetch_keys() {
        let key = JwkKey {
            e: "e".to_string(),
            alg: "alg".to_string(),
            kty: "kty".to_string(),
            kid: "kid".to_string(),
            n: "n".to_string(),
        };
        let keys = vec![key.clone()];
        let key_res = KeyResponse { keys };
        let body = serde_json::to_string(&key_res).unwrap().into_bytes();
        let res = HttpResponse {
            status: Nat::from(200_u8),
            body,
            headers: vec![],
        };
        let now = SystemTime::now();

        let mut internal = MockKeysFetchInternal::new();
        internal
            .expect_fetch_keys_internal()
            .return_once(|| Ok(res));

        let keys_fetcher = KeysFetcher::new(internal);

        let keys = keys_fetcher.fetch_keys(now).await.unwrap();
        assert!(keys.is_valid(&now));
        assert!(!keys.is_fetchable(&now));
        assert_eq!(&key, keys.get_key("kid").unwrap());
    }

    #[test]
    fn test_body_to_keys() {
        let key = JwkKey {
            e: "e".to_owned(),
            alg: "alg".to_string(),
            kty: "kty".to_string(),
            kid: "kid".to_string(),
            n: "n".to_string(),
        };
        let keys = vec![key.clone()];
        let key_res = KeyResponse { keys: keys.clone() };
        let body = serde_json::to_string(&key_res).unwrap().into_bytes();
        assert_eq!(keys, body_to_keys(&body).unwrap());
    }

    #[test]
    fn test_sort_keys() {
        let key = JwkKey {
            e: "e".to_owned(),
            alg: "alg".to_string(),
            kty: "kty".to_string(),
            kid: "kid1".to_string(),
            n: "n".to_string(),
        };
        let key2 = JwkKey {
            e: "e".to_owned(),
            alg: "alg".to_string(),
            kty: "kty".to_string(),
            kid: "kid2".to_string(),
            n: "n".to_string(),
        };
        let mut keys = vec![key2.clone(), key.clone()];
        sort_keys(&mut keys);
        assert_eq!(keys[0], key);
        assert_eq!(keys[1], key2);
    }

    #[test]
    fn test_keys_to_body() {
        let key = JwkKey {
            e: "e".to_owned(),
            alg: "alg".to_string(),
            kty: "kty".to_string(),
            kid: "kid".to_string(),
            n: "n".to_string(),
        };
        let keys = vec![key.clone()];
        let key_res = KeyResponse { keys: keys.clone() };
        let body = serde_json::to_string(&key_res).unwrap().into_bytes();
        let keys2 = body_to_keys(&body).unwrap();
        assert_eq!(body, keys_to_body(&keys2).unwrap());
    }

    #[test]
    fn test_normalize_body() {
        let key = JwkKey {
            e: "e".to_owned(),
            alg: "alg".to_string(),
            kty: "kty".to_string(),
            kid: "kid1".to_string(),
            n: "n".to_string(),
        };
        let key2 = JwkKey {
            e: "e".to_owned(),
            alg: "alg".to_string(),
            kty: "kty".to_string(),
            kid: "kid2".to_string(),
            n: "n".to_string(),
        };
        let keys = vec![key2.clone(), key.clone()];
        let key_res = KeyResponse { keys };
        let body = serde_json::to_string(&key_res).unwrap().into_bytes();
        let body2 = normalize_body(&body).unwrap();
        let keys2 = body_to_keys(&body2).unwrap();

        assert_eq!(keys2[0], key);
        assert_eq!(keys2[1], key2);
    }

    #[test]
    fn test_serde_json() {
        let key = JwkKey {
            e: "e".to_string(),
            alg: "alg".to_string(),
            kty: "kty".to_string(),
            kid: "kid".to_string(),
            n: "n".to_string(),
        };
        let keys = vec![key.clone()];
        let key_res = KeyResponse { keys: keys.clone() };
        let body = serde_json::to_string(&key_res).unwrap().into_bytes();
        let key_res2: KeyResponse = serde_json::from_slice(&body).unwrap();
        assert_eq!(keys, key_res2.keys);
    }
}
