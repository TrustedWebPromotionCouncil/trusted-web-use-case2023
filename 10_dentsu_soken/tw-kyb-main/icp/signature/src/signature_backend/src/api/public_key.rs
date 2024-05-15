use crate::b64;
use crate::error::SignatureError;
use crate::http_utils;
use crate::ic_api::{ICApi, ICApiImpl};
use crate::ic_types::{RawHttpRequest, RawHttpResponse};
use crate::id_token_verifier::{IdTokenVerifier, IdTokenVerifierImpl};
use crate::serde_json_utils;
use candid::CandidType;
use serde::{Deserialize, Serialize};

#[derive(CandidType, Debug, Deserialize, Serialize)]
pub struct PublicKeyRequestBody {
    token: String,
}

#[derive(CandidType, Debug, Deserialize, Serialize)]
pub struct PublicKeyResponseBody {
    pub_key: String,
}

pub async fn public_key_for_http(req: RawHttpRequest) -> RawHttpResponse {
    public_key_for_body(&req.body).await.map_or_else(
        |e| http_utils::bad_json_response(&e),
        |res_body| http_utils::ok_json_response(&res_body),
    )
}

async fn public_key_for_body(req_body_bytes: &[u8]) -> Result<Vec<u8>, SignatureError> {
    let req_body = serde_json_utils::from_slice::<PublicKeyRequestBody>(req_body_bytes)?;
    let res_body = public_key(&req_body).await?;
    let res_body_bytes = serde_json_utils::to_bytes(&res_body)?;
    Ok(res_body_bytes)
}

pub async fn public_key(
    req_body: &PublicKeyRequestBody,
) -> Result<PublicKeyResponseBody, SignatureError> {
    let ic_api = ICApiImpl;
    let id_token_verifier = IdTokenVerifierImpl;
    public_key_internal(req_body, &ic_api, &id_token_verifier).await
}

async fn public_key_internal(
    req_body: &PublicKeyRequestBody,
    ic_api: &dyn ICApi,
    id_token_verifier: &dyn IdTokenVerifier,
) -> Result<PublicKeyResponseBody, SignatureError> {
    let now = ic_api.time();
    let derivation_path = id_token_verifier
        .verify_id_token(&req_body.token, &now)
        .await?;
    let pub_key = ic_api.ecdsa_public_key(derivation_path).await?;
    let res_body = PublicKeyResponseBody {
        pub_key: b64::b64_encode(pub_key),
    };
    Ok(res_body)
}

#[cfg(test)]
mod tests {
    use mockall::predicate;
    use std::time::SystemTime;

    use crate::{ic_api::MockICApi, id_token_verifier::MockIdTokenVerifier};

    use super::*;

    #[tokio::test]
    async fn test_public_key_internal() {
        let token = "hoge".to_string();
        let now = SystemTime::now();
        let pub_key = vec![0_u8];
        let pub_key2 = pub_key.clone();
        let delivation_path = vec![vec![0_u8]];
        let delivation_path2 = delivation_path.clone();
        let mut ic_api = MockICApi::new();
        ic_api.expect_time().return_const(now);
        ic_api
            .expect_ecdsa_public_key()
            .with(predicate::eq(delivation_path.clone()))
            .return_once(|_| Ok(pub_key2));
        let mut id_token_verifier = MockIdTokenVerifier::new();
        id_token_verifier
            .expect_verify_id_token()
            .with(predicate::eq(token.clone()), predicate::eq(now))
            .return_once(|_, _| Ok(delivation_path2));

        let req_body = PublicKeyRequestBody {
            token: token.clone(),
        };
        let res_body = public_key_internal(&req_body, &ic_api, &id_token_verifier)
            .await
            .unwrap();

        assert_eq!(pub_key, b64::b64_decode(&res_body.pub_key).unwrap());
    }
}
