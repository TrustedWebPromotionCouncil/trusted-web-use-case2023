use ic_cdk::api as ic_api;
use std::time::{Duration, SystemTime, UNIX_EPOCH};

#[cfg(test)]
use mockall::automock;

#[cfg_attr(test, automock)]
pub trait Now: Send + Sync {
    fn now(&self) -> SystemTime;
}

pub struct ICNow;

impl Now for ICNow {
    fn now(&self) -> SystemTime {
        let now = ic_api::time();
        let secs = now / 1_000_000_000;
        let sub_nanos = (now % 1_000_000_000) as u32;
        UNIX_EPOCH + Duration::new(secs, sub_nanos)
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_now() {
        let mut mock = MockNow::new();
        mock.expect_now().return_const(SystemTime::now());
        assert!(mock.now() > UNIX_EPOCH);
    }
}
