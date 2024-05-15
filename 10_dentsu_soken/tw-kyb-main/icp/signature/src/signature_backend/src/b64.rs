use base64::{engine::general_purpose::URL_SAFE_NO_PAD, Engine as _};

use crate::error::SignatureError;

#[allow(dead_code)]
pub fn b64_encode<T: AsRef<[u8]>>(input: T) -> String {
    URL_SAFE_NO_PAD.encode(input)
}

pub fn b64_decode(input: &str) -> Result<Vec<u8>, SignatureError> {
    let s = input.trim_end_matches('=');
    URL_SAFE_NO_PAD
        .decode(s)
        .map_err(|e| SignatureError::Base64Error(e.to_string()))
}

#[cfg(test)]
mod tests {
    use super::*;
    use num_bigint::BigUint;

    const E_B64: &str = "AQAB";

    #[test]
    fn test_strip_suffix_eq() {
        assert_eq!("abc", "abc==".trim_end_matches('='));
        assert_eq!("abc", "abc".trim_end_matches('='));
    }

    #[test]
    fn test_b64_encode() {
        let e: BigUint = BigUint::from(65_537_u32);
        let e_bytes = e.to_bytes_be();
        assert_eq!(E_B64, b64_encode(e_bytes));
    }

    #[test]
    fn test_b64_decode() {
        let e: BigUint = BigUint::from(65_537_u32);
        let e_bytes = e.to_bytes_be();
        assert_eq!(e_bytes, b64_decode(E_B64).unwrap());
        assert_eq!(e_bytes, b64_decode(&format!("{}==", E_B64)).unwrap());
    }
}
