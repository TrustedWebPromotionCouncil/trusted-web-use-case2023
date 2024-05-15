use std::time::{Duration, SystemTime, UNIX_EPOCH};

use async_trait::async_trait;
use ic_cdk::api::management_canister::ecdsa::{
    self, EcdsaCurve, EcdsaKeyId, EcdsaPublicKeyArgument, SignWithEcdsaArgument,
};
#[cfg(test)]
use mockall::automock;

use crate::error::SignatureError;

#[cfg_attr(test, automock)]
#[async_trait]
pub trait ICApi {
    async fn ecdsa_public_key(
        &self,
        derivation_path: Vec<Vec<u8>>,
    ) -> Result<Vec<u8>, SignatureError>;

    async fn sign_with_ecdsa(
        &self,
        derivation_path: Vec<Vec<u8>>,
        message_hash: Vec<u8>,
    ) -> Result<Vec<u8>, SignatureError>;

    fn time(&self) -> SystemTime;
}

pub struct ICApiImpl;

#[async_trait]
impl ICApi for ICApiImpl {
    async fn ecdsa_public_key(
        &self,
        derivation_path: Vec<Vec<u8>>,
    ) -> Result<Vec<u8>, SignatureError> {
        let arg = EcdsaPublicKeyArgument {
            canister_id: None,
            derivation_path,
            key_id: ecdsa_key_id(),
        };
        let public_key = ecdsa::ecdsa_public_key(arg)
            .await
            .map_err(|e| SignatureError::ICError(format!("{:?} {}", e.0, e.1)))?
            .0
            .public_key;
        Ok(public_key)
    }

    async fn sign_with_ecdsa(
        &self,
        derivation_path: Vec<Vec<u8>>,
        message_hash: Vec<u8>,
    ) -> Result<Vec<u8>, SignatureError> {
        assert!(message_hash.len() == 32);
        let arg = SignWithEcdsaArgument {
            message_hash,
            derivation_path,
            key_id: ecdsa_key_id(),
        };
        let signature = ecdsa::sign_with_ecdsa(arg.clone())
            .await
            .map_err(|e| SignatureError::ICError(format!("{:?} {}", e.0, e.1)))?
            .0
            .signature;
        Ok(signature)
    }

    fn time(&self) -> SystemTime {
        let now = ic_cdk::api::time();
        let secs = now / 1_000_000_000;
        let sub_nanos = (now % 1_000_000_000) as u32;
        UNIX_EPOCH + Duration::new(secs, sub_nanos)
    }
}

pub fn dfx_network() -> &'static str {
    option_env!("DFX_NETWORK").unwrap_or("local")
}

pub fn ecdsa_key_name() -> &'static str {
    match dfx_network() {
        "ic" => "key_1",
        "playground" => "test_key_1",
        _ => "dfx_test_key",
    }
}

pub fn ecdsa_key_id() -> EcdsaKeyId {
    EcdsaKeyId {
        curve: EcdsaCurve::Secp256k1,
        name: ecdsa_key_name().to_string(),
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_dfx_network() {
        assert_eq!("local", dfx_network());
    }

    #[test]
    fn test_ecdsa_key_name() {
        assert_eq!("dfx_test_key", ecdsa_key_name());
    }

    #[test]
    fn test_ecdsa_key_id() {
        let expected = EcdsaKeyId {
            curve: EcdsaCurve::Secp256k1,
            name: "dfx_test_key".to_string(),
        };
        assert_eq!(expected, ecdsa_key_id());
    }

    #[tokio::test]
    async fn test_ecdsa_public_key() {
        let mut ic = MockICApi::new();
        // let public_key = vec![0_u8; 65];
        // let public_key2 = public_key.clone();
        ic.expect_ecdsa_public_key()
            .returning(|_| Ok(vec![0_u8; 65]));
        assert_eq!(vec![0_u8; 65], ic.ecdsa_public_key(vec![]).await.unwrap());
    }

    #[tokio::test]
    async fn test_sign_with_ecdsa() {
        let mut ic = MockICApi::new();
        // let public_key = vec![0_u8; 65];
        // let public_key2 = public_key.clone();
        ic.expect_sign_with_ecdsa()
            .returning(|_, _| Ok(vec![0_u8; 64]));
        assert_eq!(
            vec![0_u8; 64],
            ic.sign_with_ecdsa(vec![], vec![0_u8; 32]).await.unwrap()
        );
    }

    #[test]
    fn test_time() {
        let mut ic = MockICApi::new();
        let now = SystemTime::now();
        ic.expect_time().return_const(now);
        assert_eq!(now, ic.time());
    }
}
