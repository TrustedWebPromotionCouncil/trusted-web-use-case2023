use crate::b64::b64_decode;
use crate::error::{ExpectedActual, SignatureError};
use crate::serde_json_utils;
use serde::{de::DeserializeOwned, Deserialize, Serialize};
use std::time::{SystemTime, UNIX_EPOCH};

#[derive(Deserialize, Serialize, PartialEq, Eq, Debug)]
pub struct Header {
    pub alg: String,
    pub kid: String,
}

impl Header {
    fn verify(&self) -> Result<(), SignatureError> {
        if self.alg != *"RS256" {
            return Err(SignatureError::InvalidAlg(ExpectedActual {
                expected: "RS256".to_string(),
                actual: self.alg.clone(),
            }));
        }

        Ok(())
        // let key = jwk_keys
        //     .get_key(&self.kid)
        //     .ok_or(SignatureError::KidNotFound(self.kid.clone()))?;
        // if key.alg != *"RS256" {
        //     return Err(SignatureError::InvalidAlg(ExpectedActual {
        //         expected: "RS256".to_string(),
        //         actual: key.alg.clone(),
        //     }));
        // }
        // Ok(key)

        //     if key.alg != *"RS256" {
        //         return Err(SignatureError::InvalidAlg(ExpectedActual {
        //             expected: "RS256".to_string(),
        //             actual: key.alg.clone(),
        //         }));
        //     }
        //     Ok(key)
        // }
    }
}

#[derive(Deserialize, Serialize, PartialEq, Eq, Debug)]
pub struct Payload {
    pub iss: String,
    pub aud: String,
    pub sub: String,
    pub exp: u64,
    pub iat: u64,
    pub auth_time: u64,
}

const SKEW_TIME: u64 = 300;

impl Payload {
    fn verify(&self, project_id: &str, now: &SystemTime) -> Result<(), SignatureError> {
        let expected_iss = iss(project_id);
        if self.iss != expected_iss {
            return Err(SignatureError::InvalidIss(ExpectedActual {
                expected: expected_iss,
                actual: self.iss.clone(),
            }));
        }

        if self.aud != *project_id {
            return Err(SignatureError::InvalidAud(ExpectedActual {
                expected: project_id.to_string(),
                actual: self.aud.clone(),
            }));
        }

        if self.sub.is_empty() {
            return Err(SignatureError::SubEmpty);
        }

        let now_secs = now.duration_since(UNIX_EPOCH).unwrap().as_secs();

        if self.auth_time > now_secs + SKEW_TIME {
            return Err(SignatureError::AuthTimeFuture(self.auth_time));
        }

        if self.iat > now_secs + SKEW_TIME {
            return Err(SignatureError::IatFuture(self.iat));
        }

        if self.exp <= now_secs - SKEW_TIME {
            return Err(SignatureError::IdTokenExpired(self.exp));
        }

        Ok(())

        // Ok(vec![
        //     self.iss.clone().into_bytes(),
        //     self.sub.clone().into_bytes(),
        // ])
    }

    pub fn delivation_path(&self) -> Vec<Vec<u8>> {
        vec![self.iss.clone().into_bytes(), self.sub.clone().into_bytes()]
    }
}

fn split3(token: &str) -> Result<[&str; 3], SignatureError> {
    let parts: Vec<&str> = token.split('.').collect();
    parts
        .try_into()
        .map_err(|_| SignatureError::IdTokenNotThreeParts)
}

fn decode<T>(s_b64: &str) -> Result<T, SignatureError>
where
    T: DeserializeOwned,
{
    let bytes = b64_decode(s_b64)?;
    serde_json_utils::from_slice(bytes.as_slice())
}

pub fn decode_header(s_b64: &str) -> Result<Header, SignatureError> {
    decode::<Header>(s_b64)
}

pub fn decode_payload(s_b64: &str) -> Result<Payload, SignatureError> {
    decode::<Payload>(s_b64)
}

fn iss(project_id: &str) -> String {
    format!("https://securetoken.google.com/{}", project_id)
}

pub fn decode_verify(
    id_token: &str,
    project_id: &str,
    now: &SystemTime,
) -> Result<(Header, Payload, Vec<u8>, Vec<u8>), SignatureError> {
    let parts = split3(id_token)?;
    let header = decode_header(parts[0])?;
    header.verify()?;

    let payload = decode_payload(parts[1])?;
    payload.verify(project_id, now)?;

    let message = format!("{}.{}", parts[0], parts[1]).into_bytes();
    let sig = b64_decode(parts[2])?;

    Ok((header, payload, message, sig))
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::b64::b64_encode;
    use rsa::{pkcs1v15::SigningKey, sha2::Sha256, signature::Signer, RsaPrivateKey};
    use std::time::Duration;

    const HEADER_B64: &str =
        "eyJhbGciOiJSUzI1NiIsImtpZCI6ImRhMGI1ZDQyNDRjY2ZiNzViMjcwODQxNjI5NWYwNWQ1MThjYTY5MDMifQ";

    const PAYLOAD: &[u8] = r#"{"iss": "https://securetoken.google.com/YOUR_PROJECT_ID",
  "provider_id": "anonymous",
  "aud": "YOUR_PROJECT_ID",
  "auth_time": 1501381779,
  "user_id": "USER_ID",
  "sub": "USER_ID",
  "iat": 1501654829,
  "exp": 1501658429,
  "firebase": {
    "identities": {},
    "sign_in_provider": "anonymous"
  }
}"#
    .as_bytes();

    const PAYLOAD_B64: &str = "eyJpc3MiOiAiaHR0cHM6Ly9zZWN1cmV0b2tlbi5nb29nbGUuY29tL1lPVVJfUFJPSkVDVF9JRCIsCiAgInByb3ZpZGVyX2lkIjogImFub255bW91cyIsCiAgImF1ZCI6ICJZT1VSX1BST0pFQ1RfSUQiLAogICJhdXRoX3RpbWUiOiAxNTAxMzgxNzc5LAogICJ1c2VyX2lkIjogIlVTRVJfSUQiLAogICJzdWIiOiAiVVNFUl9JRCIsCiAgImlhdCI6IDE1MDE2NTQ4MjksCiAgImV4cCI6IDE1MDE2NTg0MjksCiAgImZpcmViYXNlIjogewogICAgImlkZW50aXRpZXMiOiB7fSwKICAgICJzaWduX2luX3Byb3ZpZGVyIjogImFub255bW91cyIKICB9Cn0";

    #[test]
    fn test_split3() {
        let parts = split3("a.b.c").unwrap();
        assert_eq!(["a", "b", "c"], parts);
    }

    #[test]
    fn test_split3_err() {
        let r = split3("a.b");
        //println!("{:?}", r);
        assert!(r.is_err());
        assert_eq!("IdTokenNotThreeParts", r.err().unwrap().to_string());
    }

    #[test]
    fn test_decode_header() {
        let header = decode_header(HEADER_B64).unwrap();
        assert_eq!("RS256", header.alg);
        assert_eq!("da0b5d4244ccfb75b2708416295f05d518ca6903", header.kid);
    }

    #[test]
    fn test_decode_payload() {
        let payload = decode_payload(PAYLOAD_B64).unwrap();
        assert_eq!(
            "https://securetoken.google.com/YOUR_PROJECT_ID",
            payload.iss
        );
        assert_eq!("YOUR_PROJECT_ID", payload.aud);
        assert_eq!("USER_ID", payload.sub);
        assert_eq!(1501654829, payload.iat);
        assert_eq!(1501658429, payload.exp);
        assert_eq!(1501381779, payload.auth_time);
    }

    #[test]
    fn test_payload() {
        let encoded = b64_encode(PAYLOAD);
        assert_eq!(encoded, PAYLOAD_B64);
        let original = b64_decode(&encoded).unwrap();
        assert_eq!(PAYLOAD, &original);
    }

    #[test]
    fn test_verify_header() {
        let header = decode::<Header>(HEADER_B64).unwrap();

        let ret = header.verify();

        assert!(ret.is_ok());
    }

    #[test]
    fn test_verify_header_invalid_alg() {
        let mut header = decode::<Header>(HEADER_B64).unwrap();
        header.alg = "RS256xxx".to_string();
        let ret = header.verify();

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
    fn test_verify_payload() {
        let payload = decode::<Payload>(PAYLOAD_B64).unwrap();
        let now = UNIX_EPOCH + Duration::from_secs(payload.iat + 1);

        assert!(payload.verify("YOUR_PROJECT_ID", &now).is_ok());
    }

    #[test]
    fn test_verify_payload_iss_error() {
        let mut payload = decode::<Payload>(PAYLOAD_B64).unwrap();
        payload.iss = "hoge".to_string();
        let now = UNIX_EPOCH + Duration::from_secs(payload.iat + 1);

        let ret = payload.verify("YOUR_PROJECT_ID", &now);
        assert!(ret.is_err());
        assert_eq!(
            SignatureError::InvalidIss(ExpectedActual {
                expected: iss("YOUR_PROJECT_ID"),
                actual: "hoge".to_string(),
            }),
            ret.err().unwrap()
        );
    }

    #[test]
    fn test_verify_payload_aud_error() {
        let mut payload = decode::<Payload>(PAYLOAD_B64).unwrap();
        payload.aud = "hoge".to_string();
        let now = UNIX_EPOCH + Duration::from_secs(payload.iat + 1);

        let ret = payload.verify("YOUR_PROJECT_ID", &now);
        assert!(ret.is_err());
        assert_eq!(
            SignatureError::InvalidAud(ExpectedActual {
                expected: "YOUR_PROJECT_ID".to_string(),
                actual: "hoge".to_string(),
            }),
            ret.err().unwrap()
        );
    }

    #[test]
    fn test_verify_payload_sub_error() {
        let mut payload = decode::<Payload>(PAYLOAD_B64).unwrap();
        payload.sub = "".to_string();
        let now = UNIX_EPOCH + Duration::from_secs(payload.iat + 1);

        let ret = payload.verify("YOUR_PROJECT_ID", &now);
        assert!(ret.is_err());
        assert_eq!(SignatureError::SubEmpty, ret.err().unwrap());
    }

    #[test]
    fn test_verify_payload_auth_time_error() {
        let payload = decode::<Payload>(PAYLOAD_B64).unwrap();
        let now = UNIX_EPOCH + Duration::from_secs(payload.auth_time - SKEW_TIME - 1);

        let ret = payload.verify("YOUR_PROJECT_ID", &now);
        assert!(ret.is_err());
        assert_eq!(
            SignatureError::AuthTimeFuture(payload.auth_time),
            ret.err().unwrap()
        );
    }

    #[test]
    fn test_verify_payload_iat_error() {
        let payload = decode::<Payload>(PAYLOAD_B64).unwrap();
        let now = UNIX_EPOCH + Duration::from_secs(payload.auth_time - SKEW_TIME);

        let ret = payload.verify("YOUR_PROJECT_ID", &now);
        assert!(ret.is_err());
        assert_eq!(SignatureError::IatFuture(payload.iat), ret.err().unwrap());
    }

    #[test]
    fn test_verify_payload_exp_error() {
        let payload = decode::<Payload>(PAYLOAD_B64).unwrap();
        let now = UNIX_EPOCH + Duration::from_secs(payload.exp + SKEW_TIME);

        let ret = payload.verify("YOUR_PROJECT_ID", &now);
        assert!(ret.is_err());
        assert_eq!(
            SignatureError::IdTokenExpired(payload.exp),
            ret.err().unwrap()
        );
    }

    #[test]
    fn test_payload_delivation_path() {
        let payload = decode::<Payload>(PAYLOAD_B64).unwrap();
        let expected = vec![
            payload.iss.clone().into_bytes(),
            payload.sub.clone().into_bytes(),
        ];

        assert_eq!(expected, payload.delivation_path());
    }

    #[test]
    fn test_decode_verify() {
        let mut rng = rand::thread_rng();
        let bits = 2048;
        let private_key = RsaPrivateKey::new(&mut rng, bits).unwrap();
        // let public_key = private_key.to_public_key();

        // let n_bytes = public_key.n().to_bytes_be();
        // let e_bytes = public_key.e().to_bytes_be();
        // let b64_n = general_purpose::URL_SAFE.encode(n_bytes);
        // let b64_e = general_purpose::URL_SAFE.encode(e_bytes);

        let signing_key = SigningKey::<Sha256>::new(private_key);

        let data = format!("{}.{}", HEADER_B64, PAYLOAD_B64);
        let s_bytes: Box<[u8]> = signing_key.sign(data.as_bytes()).into();
        let s_b64 = b64_encode(&s_bytes);
        let id_token = format!("{}.{}", data, s_b64);

        let header = decode::<Header>(HEADER_B64).unwrap();
        let payload = decode::<Payload>(PAYLOAD_B64).unwrap();
        let project_id = payload.aud.clone();
        let now = UNIX_EPOCH + Duration::from_secs(payload.iat + 1);

        let (header2, payload2, m_bytes2, s_bytes2) =
            decode_verify(&id_token, &project_id, &now).unwrap();

        assert_eq!(header, header2);
        assert_eq!(payload, payload2);
        assert_eq!(data.into_bytes(), m_bytes2);
        assert_eq!(s_bytes.into_vec(), s_bytes2);

        // let header = decode::<Header>(B64_HEADER).unwrap();
        // let key1 = JwkKey {
        //     kid: header.kid.clone(),
        //     e: b64_e,
        //     alg: "RS256".to_owned(),
        //     kty: "RSA".to_owned(),
        //     n: b64_n,
        // };
        // let jwk_keys = JwkKeys::new(
        //     vec![key1.clone()],
        //     SystemTime::now() + Duration::from_secs(600),
        // );

        // let payload = decode::<Payload>(B64_PAYLOAD).unwrap();
        // let project_id = payload.aud.clone();
        // let now = UNIX_EPOCH + Duration::from_secs(payload.iat + 1);

        // let path = verify(&id_token, &jwk_keys, &project_id, &now).unwrap();
        // assert_eq!(
        //     vec![
        //         payload.iss.clone().into_bytes(),
        //         payload.sub.clone().into_bytes()
        //     ],
        //     path
        // );
    }

    #[test]
    fn test_decode_verify_header_error() {
        let mut rng = rand::thread_rng();
        let bits = 2048;
        let private_key = RsaPrivateKey::new(&mut rng, bits).unwrap();

        let signing_key = SigningKey::<Sha256>::new(private_key);

        let header = Header {
            alg: "RS256xxx".to_string(),
            kid: "1".to_string(),
        };
        let header_str = serde_json::to_string(&header).unwrap();
        let b64_header = b64_encode(header_str);
        let data = format!("{}.{}", b64_header, PAYLOAD_B64);
        let sig_bytes: Box<[u8]> = signing_key.sign(data.as_bytes()).into();
        let b64_sig = b64_encode(&sig_bytes);
        let id_token = format!("{}.{}", data, b64_sig);

        let payload = decode::<Payload>(PAYLOAD_B64).unwrap();
        let project_id = payload.aud.clone();
        let now = UNIX_EPOCH + Duration::from_secs(payload.iat + 1);

        let ret = decode_verify(&id_token, &project_id, &now);

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
    fn test_decode_verify_payload_error() {
        let mut rng = rand::thread_rng();
        let bits = 2048;
        let private_key = RsaPrivateKey::new(&mut rng, bits).unwrap();

        let signing_key = SigningKey::<Sha256>::new(private_key);

        let mut payload = decode::<Payload>(PAYLOAD_B64).unwrap();
        payload.iss = "hoge".to_string();
        let payload_str = serde_json::to_string(&payload).unwrap();
        let b64_payload = b64_encode(payload_str);
        let data = format!("{}.{}", HEADER_B64, b64_payload);
        let sig_bytes: Box<[u8]> = signing_key.sign(data.as_bytes()).into();
        let b64_sig = b64_encode(&sig_bytes);
        let id_token = format!("{}.{}", data, b64_sig);

        let project_id = payload.aud.clone();
        let now = UNIX_EPOCH + Duration::from_secs(payload.iat + 1);

        let ret = decode_verify(&id_token, &project_id, &now);

        assert!(ret.is_err());
        assert_eq!(
            SignatureError::InvalidIss(ExpectedActual {
                expected: iss("YOUR_PROJECT_ID"),
                actual: "hoge".to_string(),
            }),
            ret.err().unwrap()
        );
    }
}
