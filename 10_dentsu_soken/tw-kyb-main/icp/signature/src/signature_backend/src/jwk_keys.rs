use crate::b64::b64_decode;
use crate::error::{ExpectedActual, SignatureError};
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::time::{Duration, SystemTime, UNIX_EPOCH};

const FETCH_INTERVAL: Duration = Duration::from_secs(60);

#[derive(Debug, Deserialize, Serialize, Eq, PartialEq, Clone)]
pub struct JwkKey {
    pub kty: String,
    pub alg: String,
    pub kid: String,
    pub n: String,
    pub e: String,
}

impl JwkKey {
    pub fn verify(&self) -> Result<(), SignatureError> {
        if &self.alg != "RS256" {
            Err(SignatureError::InvalidAlg(ExpectedActual {
                expected: "RS256".to_string(),
                actual: self.alg.clone(),
            }))
        } else {
            Ok(())
        }
    }

    pub fn n_bytes(&self) -> Result<Vec<u8>, SignatureError> {
        b64_decode(&self.n)
    }

    pub fn e_bytes(&self) -> Result<Vec<u8>, SignatureError> {
        b64_decode(&self.e)
    }
}

#[derive(Debug)]
pub struct JwkKeys {
    key_map: HashMap<String, JwkKey>,
    fetch_time: SystemTime,
    max_age: Duration,
}

fn keys_as_map(keys: Vec<JwkKey>) -> HashMap<String, JwkKey> {
    let mut map = HashMap::with_capacity(keys.len());
    for key in keys {
        map.insert(String::clone(&key.kid), key);
    }
    map
}

impl JwkKeys {
    pub fn new(keys: Vec<JwkKey>, fetch_time: SystemTime, max_age: Duration) -> Self {
        Self {
            key_map: keys_as_map(keys),
            fetch_time,
            max_age,
        }
    }

    pub fn get_key(&self, kid: &str) -> Option<&JwkKey> {
        self.key_map.get(kid)
    }

    pub fn is_valid(&self, now: &SystemTime) -> bool {
        self.fetch_time + self.max_age >= *now
    }

    pub fn is_fetchable(&self, now: &SystemTime) -> bool {
        self.fetch_time + FETCH_INTERVAL < *now
    }
}

impl Default for JwkKeys {
    fn default() -> Self {
        Self {
            key_map: HashMap::new(),
            fetch_time: UNIX_EPOCH,
            max_age: Duration::from_secs(0),
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::b64::b64_encode;
    use num_bigint::BigUint;

    #[test]
    fn test_jwk_key_verify() {
        let key1 = JwkKey {
            kid: "1".to_owned(),
            e: "AQAB".to_owned(),
            alg: "RS256".to_owned(),
            kty: "RSA".to_owned(),
            n: "n".to_owned(),
        };
        assert!(key1.verify().is_ok());
    }

    #[test]
    fn test_jwk_key_verify_error() {
        let key1 = JwkKey {
            kid: "1".to_owned(),
            e: "AQAB".to_owned(),
            alg: "RS256xxx".to_owned(),
            kty: "RSA".to_owned(),
            n: "n".to_owned(),
        };
        let ret = key1.verify();
        assert!(ret.is_err());
        assert_eq!(
            SignatureError::InvalidAlg(ExpectedActual {
                expected: "RS256".to_string(),
                actual: "RS256xxx".to_string(),
            }),
            ret.err().unwrap()
        );
    }

    #[test]
    fn test_jwk_key_n_bytes() {
        let n = BigUint::from(123_456_u32);
        let n_bytes = n.to_bytes_be();
        let n_b64 = b64_encode(&n_bytes);
        let key1 = JwkKey {
            kid: "1".to_string(),
            e: "AQAB".to_string(),
            alg: "RS256".to_string(),
            kty: "RSA".to_string(),
            n: n_b64.clone(),
        };
        assert_eq!(n_bytes, key1.n_bytes().unwrap());
    }

    #[test]
    fn test_jwk_key_e_bytes() {
        let key1 = JwkKey {
            kid: "1".to_string(),
            e: "AQAB".to_string(),
            alg: "RS256".to_string(),
            kty: "RSA".to_string(),
            n: "n".to_string(),
        };
        assert_eq!(vec![0x01, 0x00, 0x01], key1.e_bytes().unwrap());
    }

    #[test]
    fn test_keys_as_map() {
        let key1 = JwkKey {
            kid: "1".to_owned(),
            e: "AQAB".to_owned(),
            alg: "RS256".to_owned(),
            kty: "RSA".to_owned(),
            n: "n".to_owned(),
        };
        let key2 = JwkKey {
            kid: "2".to_owned(),
            e: "AQAB".to_owned(),
            alg: "RS256".to_owned(),
            kty: "RSA".to_owned(),
            n: "n".to_owned(),
        };
        let map = keys_as_map(vec![key1.clone(), key2.clone()]);
        assert_eq!(&key1, map.get(&key1.kid).unwrap());
        assert_eq!(&key2, map.get(&key2.kid).unwrap());
    }

    #[test]
    fn test_jwk_keys_new() {
        let key1 = JwkKey {
            kid: "1".to_owned(),
            e: "AQAB".to_owned(),
            alg: "RS256".to_owned(),
            kty: "RSA".to_owned(),
            n: "n".to_owned(),
        };
        let key2 = JwkKey {
            kid: "2".to_owned(),
            e: "AQAB".to_owned(),
            alg: "RS256".to_owned(),
            kty: "RSA".to_owned(),
            n: "n".to_owned(),
        };
        let now = SystemTime::now();
        let max_age = Duration::from_secs(0);
        let keys = JwkKeys::new(vec![key1.clone(), key2.clone()], now, max_age);
        assert_eq!(&key1, keys.key_map.get(&key1.kid).unwrap());
        assert_eq!(&key2, keys.key_map.get(&key2.kid).unwrap());
        assert_eq!(&now, &keys.fetch_time);
        assert_eq!(&max_age, &keys.max_age);
    }

    #[test]
    fn test_jwk_keys_get_key() {
        let key1 = JwkKey {
            kid: "1".to_owned(),
            e: "AQAB".to_owned(),
            alg: "RS256".to_owned(),
            kty: "RSA".to_owned(),
            n: "n".to_owned(),
        };
        let key2 = JwkKey {
            kid: "2".to_owned(),
            e: "AQAB".to_owned(),
            alg: "RS256".to_owned(),
            kty: "RSA".to_owned(),
            n: "n".to_owned(),
        };
        let keys = JwkKeys::new(
            vec![key1.clone(), key2.clone()],
            SystemTime::now(),
            Duration::from_secs(0),
        );
        assert_eq!(&key1, keys.get_key(&key1.kid).unwrap());
        assert_eq!(&key2, keys.get_key(&key2.kid).unwrap());
        assert!(keys.get_key("xxx").is_none());
    }

    #[test]
    fn test_jwk_keys_is_valid() {
        let key1 = JwkKey {
            kid: "1".to_owned(),
            e: "AQAB".to_owned(),
            alg: "RS256".to_owned(),
            kty: "RSA".to_owned(),
            n: "n".to_owned(),
        };
        let key2 = JwkKey {
            kid: "2".to_owned(),
            e: "AQAB".to_owned(),
            alg: "RS256".to_owned(),
            kty: "RSA".to_owned(),
            n: "n".to_owned(),
        };
        let now = SystemTime::now();
        let keys = JwkKeys::new(
            vec![key1.clone(), key2.clone()],
            now,
            Duration::from_secs(60),
        );
        assert!(keys.is_valid(&now));

        assert!(!keys.is_valid(&(now + Duration::from_secs(61))));
    }

    #[test]
    fn test_jwk_keys_is_fetchable() {
        let key1 = JwkKey {
            kid: "1".to_owned(),
            e: "AQAB".to_owned(),
            alg: "RS256".to_owned(),
            kty: "RSA".to_owned(),
            n: "n".to_owned(),
        };
        let key2 = JwkKey {
            kid: "2".to_owned(),
            e: "AQAB".to_owned(),
            alg: "RS256".to_owned(),
            kty: "RSA".to_owned(),
            n: "n".to_owned(),
        };
        let now = SystemTime::now();
        let keys = JwkKeys::new(
            vec![key1.clone(), key2.clone()],
            now,
            Duration::from_secs(60),
        );
        assert!(!keys.is_fetchable(&now));

        assert!(keys.is_fetchable(&(now + Duration::from_secs(61))));
    }

    #[test]
    fn test_jwk_keys_default() {
        let keys = JwkKeys::default();
        assert!(keys.is_fetchable(&SystemTime::now()));
    }
}
