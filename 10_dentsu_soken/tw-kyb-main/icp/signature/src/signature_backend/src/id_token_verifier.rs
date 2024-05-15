use crate::constants::PROJECT_ID;
use crate::error::SignatureError;
use crate::id_token;
use crate::jwk_keys::JwkKeys;
use crate::keys_fetch::{KeysFetchInternal, KeysFetchInternalImpl, KeysFetcher};
use crate::rsa::{rsassa_pkcs1_v15_verify, RSAPublicKey};
use async_trait::async_trait;
#[cfg(test)]
use mockall::automock;
use std::cell::RefCell;
use std::rc::Rc;
use std::time::SystemTime;

thread_local! {
    static JWK_KEYS: Rc<RefCell<JwkKeys>> = Rc::new(RefCell::new(JwkKeys::default()));
}

fn jwk_keys() -> Rc<RefCell<JwkKeys>> {
    JWK_KEYS.with(|keys| Rc::clone(keys))
}

#[cfg_attr(test, automock)]
#[async_trait(?Send)]
pub trait IdTokenVerifier {
    async fn verify_id_token(
        &self,
        token: &str,
        now: &SystemTime,
    ) -> Result<Vec<Vec<u8>>, SignatureError>;
}

pub struct IdTokenVerifierImpl;

#[async_trait(?Send)]
impl IdTokenVerifier for IdTokenVerifierImpl {
    async fn verify_id_token(
        &self,
        token: &str,
        now: &SystemTime,
    ) -> Result<Vec<Vec<u8>>, SignatureError> {
        let keys_fetcher = KeysFetcher::new(KeysFetchInternalImpl);
        verify_id_token_internal(token, PROJECT_ID, now, &jwk_keys(), &keys_fetcher).await
    }
}

async fn verify_id_token_internal<I>(
    token: &str,
    project_id: &str,
    now: &SystemTime,
    jwk_keys: &Rc<RefCell<JwkKeys>>,
    keys_fetcher: &KeysFetcher<I>,
) -> Result<Vec<Vec<u8>>, SignatureError>
where
    I: KeysFetchInternal,
{
    let (header, payload, m_bytes, s_bytes) = id_token::decode_verify(token, project_id, now)?;
    let pub_key = get_pub_key_internal(&header.kid, now, jwk_keys, keys_fetcher).await?;
    rsassa_pkcs1_v15_verify(&pub_key, &m_bytes, &s_bytes).map_err(SignatureError::VerifyError)?;
    Ok(payload.delivation_path())
}

async fn get_pub_key_internal<I>(
    kid: &str,
    now: &SystemTime,
    jwk_keys: &Rc<RefCell<JwkKeys>>,
    keys_fetcher: &KeysFetcher<I>,
) -> Result<RSAPublicKey, SignatureError>
where
    I: KeysFetchInternal,
{
    refresh_keys_internal(now, jwk_keys, keys_fetcher).await?;

    {
        if let Some(key) = jwk_keys.borrow().get_key(kid) {
            return RSAPublicKey::try_from(key);
        }
        println!("first not found");
    }

    if jwk_keys.borrow().is_fetchable(now) {
        force_refresh_keys_internal(now, jwk_keys, keys_fetcher).await?;
        let keys = jwk_keys.borrow();
        let jwk_key = keys
            .get_key(kid)
            .ok_or(SignatureError::KidNotFound(kid.to_string()))?;
        RSAPublicKey::try_from(jwk_key)
    } else {
        Err(SignatureError::KidNotFound(kid.to_string()))
    }
}

async fn refresh_keys_internal<I>(
    now: &SystemTime,
    jwk_keys: &Rc<RefCell<JwkKeys>>,
    keys_fetcher: &KeysFetcher<I>,
) -> Result<(), SignatureError>
where
    I: KeysFetchInternal,
{
    if !jwk_keys.borrow().is_valid(now) {
        force_refresh_keys_internal(now, jwk_keys, keys_fetcher).await?;
    }
    Ok(())
}

async fn force_refresh_keys_internal<I>(
    now: &SystemTime,
    jwk_keys: &Rc<RefCell<JwkKeys>>,
    keys_fetcher: &KeysFetcher<I>,
) -> Result<(), SignatureError>
where
    I: KeysFetchInternal,
{
    let new_keys = keys_fetcher.fetch_keys(*now).await?;
    jwk_keys.replace(new_keys);
    Ok(())
}

#[cfg(test)]
mod tests {
    use std::time::Duration;

    use super::*;
    use crate::id_token;
    use crate::jwk_keys::JwkKey;
    use crate::keys_fetch::KeyResponse;
    use crate::{b64::b64_encode, keys_fetch::MockKeysFetchInternal};
    use candid::Nat;
    use ic_cdk::api::management_canister::http_request::HttpResponse;
    use num_bigint::BigUint;
    use rsa::{
        pkcs1v15::SigningKey, sha2::Sha256, signature::Signer, traits::PublicKeyParts,
        RsaPrivateKey,
    };
    use std::time::UNIX_EPOCH;

    const HEADER_B64: &str =
        "eyJhbGciOiJSUzI1NiIsImtpZCI6ImRhMGI1ZDQyNDRjY2ZiNzViMjcwODQxNjI5NWYwNWQ1MThjYTY5MDMifQ";

    const PAYLOAD_B64: &str = "eyJpc3MiOiAiaHR0cHM6Ly9zZWN1cmV0b2tlbi5nb29nbGUuY29tL1lPVVJfUFJPSkVDVF9JRCIsCiAgInByb3ZpZGVyX2lkIjogImFub255bW91cyIsCiAgImF1ZCI6ICJZT1VSX1BST0pFQ1RfSUQiLAogICJhdXRoX3RpbWUiOiAxNTAxMzgxNzc5LAogICJ1c2VyX2lkIjogIlVTRVJfSUQiLAogICJzdWIiOiAiVVNFUl9JRCIsCiAgImlhdCI6IDE1MDE2NTQ4MjksCiAgImV4cCI6IDE1MDE2NTg0MjksCiAgImZpcmViYXNlIjogewogICAgImlkZW50aXRpZXMiOiB7fSwKICAgICJzaWduX2luX3Byb3ZpZGVyIjogImFub255bW91cyIKICB9Cn0";

    #[test]
    fn test_jwk_keys() {
        let _ = jwk_keys();
    }

    #[tokio::test]
    async fn test_force_refresh_keys_internal() {
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
        let mut internal = MockKeysFetchInternal::new();
        internal
            .expect_fetch_keys_internal()
            .return_once(|| Ok(res));
        let keys_fetcher = KeysFetcher::new(internal);
        let jwk_keys = Rc::new(RefCell::new(JwkKeys::default()));
        let now = SystemTime::now();

        let ret = force_refresh_keys_internal(&now, &jwk_keys, &keys_fetcher).await;
        assert!(ret.is_ok());
        assert_eq!(&key, jwk_keys.borrow().get_key(&key.kid).unwrap());
    }

    #[tokio::test]
    async fn test_refresh_keys_internal_jwk_keys_is_not_valid() {
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
        let mut internal = MockKeysFetchInternal::new();
        internal
            .expect_fetch_keys_internal()
            .return_once(|| Ok(res));
        let keys_fetcher = KeysFetcher::new(internal);
        let jwk_keys = Rc::new(RefCell::new(JwkKeys::default()));
        let now = SystemTime::now();

        let ret = refresh_keys_internal(&now, &jwk_keys, &keys_fetcher).await;
        assert!(ret.is_ok());
        assert_eq!(&key, jwk_keys.borrow().get_key(&key.kid).unwrap());
    }

    #[tokio::test]
    async fn test_refresh_keys_internal_jwk_keys_is_valid() {
        let key = JwkKey {
            e: "e".to_string(),
            alg: "alg".to_string(),
            kty: "kty".to_string(),
            kid: "kid".to_string(),
            n: "n".to_string(),
        };
        let keys = vec![key.clone()];
        let now = SystemTime::now();
        let max_age = Duration::from_secs(60);
        let internal = MockKeysFetchInternal::new();
        let keys_fetcher = KeysFetcher::new(internal);
        let jwk_keys = Rc::new(RefCell::new(JwkKeys::new(keys, now, max_age)));

        let ret = refresh_keys_internal(&now, &jwk_keys, &keys_fetcher).await;
        assert!(ret.is_ok());
        assert_eq!(&key, jwk_keys.borrow().get_key(&key.kid).unwrap());
    }

    #[tokio::test]
    async fn test_get_pub_key_internal_kid_first_found() {
        let n = BigUint::from(123_456_u32);
        let n_bytes = n.to_bytes_be();
        let n_b64 = b64_encode(&n_bytes);
        let e_bytes = BigUint::from(65537_u32).to_bytes_be();
        let key = JwkKey {
            e: "AQAB".to_string(),
            alg: "RS256".to_string(),
            kty: "kty".to_string(),
            kid: "kid".to_string(),
            n: n_b64.clone(),
        };
        let keys = vec![key.clone()];
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
        let keys_fetcher = KeysFetcher::new(internal);
        let jwk_keys = Rc::new(RefCell::new(JwkKeys::default()));
        let now = SystemTime::now();

        let pub_key = get_pub_key_internal(&key.kid, &now, &jwk_keys, &keys_fetcher)
            .await
            .unwrap();
        assert_eq!(&key, jwk_keys.borrow().get_key(&key.kid).unwrap());
        assert_eq!(RSAPublicKey::new(&n_bytes, &e_bytes), pub_key);
    }

    #[tokio::test]
    async fn test_get_pub_key_internal_kid_second_found() {
        let n = BigUint::from(123_456_u32);
        let n_bytes = n.to_bytes_be();
        let n_b64 = b64_encode(&n_bytes);
        let e_bytes = BigUint::from(65537_u32).to_bytes_be();
        let key = JwkKey {
            e: "AQAB".to_string(),
            alg: "RS256".to_string(),
            kty: "kty".to_string(),
            kid: "kid".to_string(),
            n: n_b64.clone(),
        };
        let keys = vec![key.clone()];
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
        let keys_fetcher = KeysFetcher::new(internal);
        let now = SystemTime::now();
        let max_age = Duration::from_secs(3600);
        let key2 = JwkKey {
            e: "AQAB".to_string(),
            alg: "alg".to_string(),
            kty: "kty".to_string(),
            kid: "kid2".to_string(),
            n: n_b64.clone(),
        };
        let jwk_keys = Rc::new(RefCell::new(JwkKeys::new(vec![key2.clone()], now, max_age)));

        let pub_key = get_pub_key_internal(
            &key.kid,
            &(now + Duration::from_secs(61)),
            &jwk_keys,
            &keys_fetcher,
        )
        .await
        .unwrap();
        assert_eq!(&key, jwk_keys.borrow().get_key(&key.kid).unwrap());
        assert_eq!(RSAPublicKey::new(&n_bytes, &e_bytes), pub_key);
    }

    #[tokio::test]
    async fn test_get_pub_key_internal_kid_not_found() {
        let n = BigUint::from(123_456_u32);
        let n_bytes = n.to_bytes_be();
        let n_b64 = b64_encode(&n_bytes);
        let key = JwkKey {
            e: "AQAB".to_string(),
            alg: "alg".to_string(),
            kty: "kty".to_string(),
            kid: "kid".to_string(),
            n: n_b64.clone(),
        };
        let keys = vec![key.clone()];
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
        let keys_fetcher = KeysFetcher::new(internal);
        let now = SystemTime::now();
        let max_age = Duration::from_secs(3600);
        let key2 = JwkKey {
            e: "AQAB".to_string(),
            alg: "alg".to_string(),
            kty: "kty".to_string(),
            kid: "kid2".to_string(),
            n: n_b64.clone(),
        };
        let jwk_keys = Rc::new(RefCell::new(JwkKeys::new(vec![key2.clone()], now, max_age)));

        let ret = get_pub_key_internal(
            &key.kid,
            &(now + Duration::from_secs(1)),
            &jwk_keys,
            &keys_fetcher,
        )
        .await;
        assert!(ret.is_err());
        assert_eq!(
            SignatureError::KidNotFound("kid".to_string()),
            ret.err().unwrap()
        );
    }

    #[tokio::test]
    async fn test_verify_id_token_internal() {
        let mut rng = rand::thread_rng();
        let bits = 2048;
        let private_key = RsaPrivateKey::new(&mut rng, bits).unwrap();
        let public_key = private_key.to_public_key();

        let n_bytes = public_key.n().to_bytes_be();
        let e_bytes = public_key.e().to_bytes_be();
        let n_b64 = b64_encode(n_bytes);
        let e_b64 = b64_encode(e_bytes);

        let signing_key = SigningKey::<Sha256>::new(private_key);

        let data = format!("{}.{}", HEADER_B64, PAYLOAD_B64);
        let s_bytes: Box<[u8]> = signing_key.sign(data.as_bytes()).into();
        let s_b64 = b64_encode(&s_bytes);
        let token = format!("{}.{}", data, s_b64);

        let header = id_token::decode_header(HEADER_B64).unwrap();
        let payload = id_token::decode_payload(PAYLOAD_B64).unwrap();
        let project_id = payload.aud.clone();
        let now = UNIX_EPOCH + Duration::from_secs(payload.iat + 1);
        let max_age = Duration::from_secs(3600);

        let key = JwkKey {
            e: e_b64.clone(),
            alg: "RS256".to_string(),
            kty: "kty".to_string(),
            kid: header.kid.clone(),
            n: n_b64.clone(),
        };
        let internal = MockKeysFetchInternal::new();
        let keys_fetcher = KeysFetcher::new(internal);

        let jwk_keys = Rc::new(RefCell::new(JwkKeys::new(vec![key.clone()], now, max_age)));

        let derivation_path =
            verify_id_token_internal(&token, &project_id, &now, &jwk_keys, &keys_fetcher)
                .await
                .unwrap();

        assert_eq!(payload.delivation_path(), derivation_path);
    }

    #[tokio::test]
    async fn test_verifier_verify_id_token() {
        let delivation_path = vec![vec![0_u8]];
        let delivation_path2 = delivation_path.clone();
        let mut id_token_verifier = MockIdTokenVerifier::new();
        id_token_verifier
            .expect_verify_id_token()
            .return_once(move |_, _| Ok(delivation_path2));
        let now = SystemTime::now();

        assert_eq!(
            delivation_path,
            id_token_verifier.verify_id_token("", &now).await.unwrap()
        );
    }
}
