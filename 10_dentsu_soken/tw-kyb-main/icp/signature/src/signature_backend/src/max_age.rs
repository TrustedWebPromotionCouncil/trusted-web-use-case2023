use crate::error::SignatureError;
use std::num::ParseIntError;
use std::time::Duration;

pub fn get_max_age(cache_control_value: Option<String>) -> Result<Duration, SignatureError> {
    match cache_control_value {
        Some(v) => parse_max_age_value(&v),
        None => Err(SignatureError::NoCacheControlHeader),
    }
}

fn parse_max_age_value(s: &str) -> Result<Duration, SignatureError> {
    let tokens: Vec<&str> = s.split(',').collect();
    for token in tokens {
        let key_value: Vec<&str> = token.split('=').map(|s| s.trim()).collect();
        let key = key_value.first().unwrap();
        let val = key_value.get(1);

        if String::from("max-age").eq(&key.to_lowercase()) {
            match val {
                Some(value) => {
                    return Ok(Duration::from_secs(value.parse().map_err(
                        |e: ParseIntError| SignatureError::NonNumericMaxAge(e.to_string()),
                    )?))
                }
                None => return Err(SignatureError::MaxAgeValueEmpty),
            }
        }
    }
    Err(SignatureError::NoMaxAgeSpecified)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_parse_max_age_value() {
        let value = "public, max-age=19204, must-revalidate, no-transform";
        assert_eq!(
            Duration::from_secs(19204),
            parse_max_age_value(value).unwrap()
        );
    }

    #[test]
    fn test_parse_max_age_value_non_numeric_max_age_err() -> Result<(), String> {
        let value = "public, max-age=19a204, must-revalidate, no-transform";
        let err = parse_max_age_value(value).unwrap_err();
        match err {
            SignatureError::NonNumericMaxAge(_) => Ok(()),
            _ => Err("NonNumericMaxAge did not occur".to_owned()),
        }
    }

    #[test]
    fn test_parse_max_age_value_non_numeric_max_age_empty_err() -> Result<(), String> {
        let value = "public, max-age=, must-revalidate, no-transform";
        let err = parse_max_age_value(value).unwrap_err();
        match err {
            SignatureError::NonNumericMaxAge(_) => Ok(()),
            _ => Err("NonNumericMaxAge did not occur".to_owned()),
        }
    }

    #[test]
    fn test_parse_max_age_value_no_max_age_specified_err() -> Result<(), String> {
        let value = "public, must-revalidate, no-transform";
        let err = parse_max_age_value(value).unwrap_err();
        match err {
            SignatureError::NoMaxAgeSpecified => Ok(()),
            _ => Err("NoMaxAgeSpecified did not occur".to_owned()),
        }
    }

    #[test]
    fn test_get_max_age() {
        let value = "public, max-age=19204, must-revalidate, no-transform";
        assert_eq!(
            Duration::from_secs(19204),
            get_max_age(Some(value.to_owned())).unwrap()
        );
    }

    #[test]
    fn test_get_max_age_no_cache_control_header_err() -> Result<(), String> {
        let err = get_max_age(None).unwrap_err();
        match err {
            SignatureError::NoCacheControlHeader => Ok(()),
            _ => Err("NoCacheControlHeader did not occur".to_owned()),
        }
    }
}
