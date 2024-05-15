use crate::ic_types::RawHttpResponse;
use std::fmt::Display;

pub fn content_type_json() -> (String, String) {
    ("Content-Type".to_string(), "application/json".to_string())
}

// pub fn access_control_allow_origin(origin: &str) -> (String, String) {
//     (
//         "Access-Control-Allow-Origin".to_string(),
//         origin.to_string(),
//     )
// }

pub fn ok_json_response(body: &[u8]) -> RawHttpResponse {
    RawHttpResponse {
        status_code: 200_u16,
        headers: vec![content_type_json()],
        body: body.to_vec(),
        upgrade: None,
    }
}

pub fn bad_json_response(error: &dyn Display) -> RawHttpResponse {
    RawHttpResponse {
        status_code: 400_u16,
        headers: vec![content_type_json()],
        body: to_error_json(error).into_bytes(),
        upgrade: None,
    }
}

pub fn upgrade_response() -> RawHttpResponse {
    RawHttpResponse {
        status_code: 204_u16,
        headers: vec![],
        body: vec![],
        upgrade: Some(true),
    }
}

fn to_error_json(error: &dyn Display) -> String {
    format!("{{\"error\":\"{error}\"}}")
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::serde_json_utils;
    use serde::Serialize;

    #[derive(Debug, Serialize)]
    struct ErrorBody {
        error: String,
    }

    #[test]
    fn test_to_error_json() {
        let error = "hoge".to_string();
        let error_json = to_error_json(&error);
        //println!("{error_json}");
        let expected = serde_json_utils::to_string(&ErrorBody {
            error: error.clone(),
        })
        .unwrap();
        assert_eq!(expected, error_json);
    }

    #[test]
    fn test_ok_json_response() {
        let body = vec![0_u8];
        let res = ok_json_response(&body);
        assert_eq!(200_u16, res.status_code);
        assert_eq!(
            vec![("Content-Type".to_string(), "application/json".to_string()),],
            res.headers
        );
        assert_eq!(body, res.body);
        assert!(res.upgrade.is_none());
    }

    #[test]
    fn test_bad_json_response() {
        let error = "hoge".to_string();
        //println!("{error_json}");
        let expected_body = serde_json_utils::to_bytes(&ErrorBody {
            error: error.clone(),
        })
        .unwrap();
        let res = bad_json_response(&error);
        assert_eq!(400_u16, res.status_code);
        assert_eq!(
            vec![("Content-Type".to_string(), "application/json".to_string())],
            res.headers
        );
        assert_eq!(expected_body, res.body);
        assert!(res.upgrade.is_none());
    }

    #[test]
    fn test_upgrade_response() {
        let res = upgrade_response();
        assert_eq!(204_u16, res.status_code);
        assert!(res.headers.is_empty(),);
        assert!(res.body.is_empty());
        assert!(res.upgrade.unwrap());
    }
}
