use crate::error::SignatureError;
use ic_cdk::api::management_canister::http_request::{
    http_request_with_closure, CanisterHttpRequestArgument, HttpResponse,
};

pub async fn fetch(
    req: CanisterHttpRequestArgument,
    transform_func: impl FnOnce(HttpResponse) -> HttpResponse + 'static,
) -> Result<HttpResponse, SignatureError> {
    let cycles = http_request_required_cycles(&req)?;
    let response = http_request_with_closure(req, cycles, transform_func)
        .await
        .map_err(|e| SignatureError::ICError(format!("{:?} {}", e.0, e.1)))
        .unwrap()
        .0;
    assert_eq!(response.status, 200_u8);

    Ok(response)
}

fn http_request_required_cycles(arg: &CanisterHttpRequestArgument) -> Result<u128, SignatureError> {
    let max_response_bytes = match arg.max_response_bytes {
        Some(ref n) => *n as u128,
        None => 2 * 1024 * 1024u128, // default 2MiB
    };
    let arg_raw =
        candid::utils::encode_args((arg,)).map_err(|e| SignatureError::ICError(e.to_string()))?;

    // The fee is for a 13-node subnet to demonstrate a typical usage.
    Ok((3_000_000u128
        + 60_000u128 * 13
        + (arg_raw.len() as u128 + "http_request".len() as u128) * 400
        + max_response_bytes * 800)
        * 13)
}

#[cfg(test)]
mod tests {}
