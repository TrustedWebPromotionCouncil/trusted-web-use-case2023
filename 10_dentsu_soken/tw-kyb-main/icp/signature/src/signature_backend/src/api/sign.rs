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
pub struct SignRequestBody {
    token: String,
    message_hash: String,
}

#[derive(CandidType, Debug, Deserialize, Serialize)]
pub struct SignResponseBody {
    signature: String,
}

pub async fn sign_for_http(req: RawHttpRequest) -> RawHttpResponse {
    sign_for_body(&req.body).await.map_or_else(
        |e| http_utils::bad_json_response(&e),
        |body| http_utils::ok_json_response(&body),
    )
}

async fn sign_for_body(req_body_bytes: &[u8]) -> Result<Vec<u8>, SignatureError> {
    let req_body = serde_json_utils::from_slice::<SignRequestBody>(req_body_bytes)?;
    let res_body = sign(&req_body).await?;
    let res_body_bytes = serde_json_utils::to_bytes(&res_body)?;
    Ok(res_body_bytes)
}

pub async fn sign(req_body: &SignRequestBody) -> Result<SignResponseBody, SignatureError> {
    let ic_api = ICApiImpl;
    let id_token_verifier = IdTokenVerifierImpl;
    sign_internal(req_body, &ic_api, &id_token_verifier).await
}

async fn sign_internal(
    req_body: &SignRequestBody,
    ic_api: &dyn ICApi,
    id_token_verifier: &dyn IdTokenVerifier,
) -> Result<SignResponseBody, SignatureError> {
    let now = ic_api.time();
    let derivation_path = id_token_verifier
        .verify_id_token(&req_body.token, &now)
        .await?;
    let message_hash = b64::b64_decode(&req_body.message_hash)?;
    let signature = ic_api
        .sign_with_ecdsa(derivation_path, message_hash)
        .await?;
    let signature_b64 = b64::b64_encode(signature);
    let res_body = SignResponseBody {
        signature: signature_b64,
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
    async fn test_sign_internal() {
        let token = "hoge".to_string();
        let now = SystemTime::now();
        let sig = vec![0_u8; 64];
        let sig2 = sig.clone();
        let message_hash = vec![0_u8; 32];
        let delivation_path = vec![vec![1_u8]];
        let delivation_path2 = delivation_path.clone();
        let mut ic_api = MockICApi::new();
        ic_api.expect_time().return_const(now);
        ic_api
            .expect_sign_with_ecdsa()
            .with(
                predicate::eq(delivation_path.clone()),
                predicate::eq(message_hash.clone()),
            )
            .return_once(|_, _| Ok(sig2));
        let mut id_token_verifier = MockIdTokenVerifier::new();
        id_token_verifier
            .expect_verify_id_token()
            .with(predicate::eq(token.clone()), predicate::eq(now))
            .return_once(|_, _| Ok(delivation_path2));

        let req_body = SignRequestBody {
            token: token.clone(),
            message_hash: b64::b64_encode(message_hash),
        };
        let res_body = sign_internal(&req_body, &ic_api, &id_token_verifier)
            .await
            .unwrap();

        assert_eq!(sig, b64::b64_decode(&res_body.signature).unwrap());
    }
}
