use api::{PublicKeyRequestBody, PublicKeyResponseBody, SignRequestBody, SignResponseBody};
use error::SignatureError;
use ic_cdk::{export_candid, query, update};
use ic_types::{RawHttpRequest, RawHttpResponse};

mod api;
mod b64;
mod constants;
mod error;
mod fetch;
mod http_utils;
mod ic_api;
mod ic_types;
mod id_token;
mod id_token_verifier;
mod jwk_keys;
mod keys_fetch;
mod now;
mod rsa;
mod serde_json_utils;

#[query]
async fn http_request(req: RawHttpRequest) -> RawHttpResponse {
    if req.method.to_lowercase() == *"post" {
        return http_utils::upgrade_response();
    }
    http_utils::ok_json_response(&[])
}

#[update]
async fn http_request_update(req: RawHttpRequest) -> RawHttpResponse {
    match req.url.as_str() {
        "/public_key" => api::public_key_for_http(req).await,
        "/sign" => api::sign_for_http(req).await,
        _ => RawHttpResponse {
            status_code: 404_u16,
            headers: vec![("Content-Type".to_string(), "text/plain".to_string())],
            body: "404 Page Not Found".to_string().into_bytes(),
            upgrade: None,
        },
    }
}

#[update]
async fn public_key(
    req_body: PublicKeyRequestBody,
) -> Result<PublicKeyResponseBody, SignatureError> {
    api::public_key(&req_body).await
}

// #[update]
// async fn public_key(token: String) -> Result<Vec<u8>, SignatureError> {
//     let derivation_path = verify_id_token(&token).await?;
//     let arg = EcdsaPublicKeyArgument {
//         canister_id: None,
//         derivation_path,
//         key_id: ecdsa_key_id(),
//     };
//     //let res = ecdsa_public_key(arg).await.unwrap().0;
//     let res = ecdsa_public_key(arg)
//         .await
//         .map_err(|e| SignatureError::ICError(format!("{:?} {}", e.0, e.1)))?
//         .0;
//     Ok(res.public_key)
// }

#[update]
async fn sign(req_body: SignRequestBody) -> Result<SignResponseBody, SignatureError> {
    api::sign(&req_body).await
}

// #[update]
// async fn sign(message_hash: Vec<u8>, token: String) -> Result<Vec<u8>, SignatureError> {
//     assert!(message_hash.len() == 32);
//     let derivation_path = verify_id_token(&token).await?;
//     let arg = SignWithEcdsaArgument {
//         message_hash,
//         derivation_path,
//         key_id: ecdsa_key_id(),
//     };
//     let res = sign_with_ecdsa(arg.clone())
//         .await
//         .map_err(|e| SignatureError::ICError(format!("{:?} {}", e.0, e.1)))?
//         .0;
//     Ok(res.signature)
// }

// async fn verify_id_token(token: &str) -> Result<Vec<Vec<u8>>, SignatureError> {
//     let now = ICNow.now();
//     let verifier = IdTokenVerifierImpl;
//     verifier.verify_id_token(token, &now).await
// }

// #[query]
// fn dfx_network() -> &'static str {
//     option_env!("DFX_NETWORK").unwrap_or("local")
// }

// #[query]
// fn ecdsa_key_name() -> &'static str {
//     match dfx_network() {
//         "ic" => "key_1",
//         "playground" => "test_key_1",
//         _ => "dfx_test_key",
//     }
// }

// fn ecdsa_key_id() -> EcdsaKeyId {
//     EcdsaKeyId {
//         curve: EcdsaCurve::Secp256k1,
//         name: ecdsa_key_name().to_string(),
//     }
// }

export_candid!();
