use crate::error::SignatureError;
use serde::{de::DeserializeOwned, Serialize};

pub fn from_slice<T>(v: &[u8]) -> Result<T, SignatureError>
where
    T: DeserializeOwned,
{
    serde_json::from_slice(v).map_err(|e| SignatureError::SerdeError(e.to_string()))
}

pub fn to_string<T>(value: &T) -> Result<String, SignatureError>
where
    T: ?Sized + Serialize,
{
    let s = serde_json::to_string(value).map_err(|e| SignatureError::SerdeError(e.to_string()))?;
    Ok(s)
}

pub fn to_bytes<T>(value: &T) -> Result<Vec<u8>, SignatureError>
where
    T: ?Sized + Serialize,
{
    let bytes = to_string(value)?.into_bytes();
    Ok(bytes)
}

#[cfg(test)]
mod tests {
    use super::*;
    use serde::Deserialize;

    #[derive(Debug, Serialize, Deserialize, PartialEq, Eq)]
    struct Hoge {
        aaa: String,
    }

    #[test]
    fn test_to_string() {
        let hoge = Hoge {
            aaa: "aaa".to_string(),
        };
        let s = to_string(&hoge).unwrap();
        println!("{s}")
    }

    #[test]
    fn test_to_bytes_from_slice() {
        let hoge = Hoge {
            aaa: "aaa".to_string(),
        };
        let bytes = to_bytes(&hoge).unwrap();
        let hoge2 = from_slice::<Hoge>(bytes.as_slice()).unwrap();

        assert_eq!(hoge, hoge2);
    }
}
