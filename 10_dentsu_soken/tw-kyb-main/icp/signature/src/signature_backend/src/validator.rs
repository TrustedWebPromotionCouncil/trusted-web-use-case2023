use crate::error::SignatureError;
use crate::fetch_keys;
use crate::jwk_keys::JwkKeys;

use std::cell::RefCell;

thread_local! {
    static JWK_KEYS: RefCell<JwkKeys> = RefCell::new(JwkKeys::default());
}

async fn refresh_keys() -> Result<(), SignatureError> {
    let is_valid = JWK_KEYS.with(|keys| keys.borrow().is_valid());
    if !is_valid {
        let new_keys = fetch_keys::fetch_keys().await?;
        JWK_KEYS.with(|keys| keys.replace(new_keys));
    }
    Ok(())
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_refresh_keys() -> Result<(), Box<dyn std::error::Error>> {
        Ok(())
    }
}
