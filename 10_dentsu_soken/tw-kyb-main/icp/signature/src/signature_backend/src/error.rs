use candid::CandidType;
use std::error;
use std::fmt;
//use std::fmt::Debug;
//use std::str::FromStr;
//use std::u64;

#[derive(Debug, CandidType, PartialEq, Eq)]
pub struct ExpectedActual<T>
where
    T: core::fmt::Debug + CandidType,
{
    pub(crate) expected: T,
    pub(crate) actual: T,
}

#[derive(Debug, CandidType, PartialEq, Eq)]
//#[allow(dead_code)]
pub enum SignatureError {
    //NonNumericMaxAge(String),
    //MaxAgeValueEmpty,
    //NoMaxAgeSpecified,
    //NoCacheControlHeader,
    SerdeError(String),
    IdTokenNotThreeParts,
    Base64Error(String),
    InvalidAlg(ExpectedActual<String>),
    KidNotFound(String),
    InvalidIss(ExpectedActual<String>),
    InvalidAud(ExpectedActual<String>),
    SubEmpty,
    IatFuture(u64),
    AuthTimeFuture(u64),
    IdTokenExpired(u64),
    VerifyError(String),
    ICError(String),
}

impl fmt::Display for SignatureError {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        match *self {
            //Self::NonNumericMaxAge(ref err) => write!(f, "NonNumericMaxAge: {}", err),
            //Self::MaxAgeValueEmpty => write!(f, "MaxAgeValueEmpty"),
            //Self::NoMaxAgeSpecified => write!(f, "NoMaxAgeSpecified"),
            //Self::NoCacheControlHeader => write!(f, "NoCacheControlHeader"),
            Self::SerdeError(ref err) => write!(f, "SerdeError: {}", err),
            Self::IdTokenNotThreeParts => write!(f, "IdTokenNotThreeParts"),
            Self::Base64Error(ref err) => write!(f, "Base64Error: {}", err),
            Self::InvalidAlg(ref content) => write!(f, "InvalidAlg: {:?}", content),
            Self::KidNotFound(ref kid) => write!(f, "KidNotFound: {}", kid),
            Self::InvalidIss(ref content) => write!(f, "InvalidIss: {:?}", content),
            Self::InvalidAud(ref content) => write!(f, "InvalidAud: {:?}", content),
            Self::SubEmpty => write!(f, "SubEmpty"),
            Self::IatFuture(ref iat) => write!(f, "IatFuture: {}", iat),
            Self::AuthTimeFuture(ref auth_time) => write!(f, "AuthTimeFuture: {}", auth_time),
            Self::IdTokenExpired(ref exp) => write!(f, "IdTokenExpired: {}", exp),
            Self::VerifyError(ref content) => write!(f, "VerifyError: {}", content),
            Self::ICError(ref content) => write!(f, "ICError: {}", content),
        }
    }
}

impl error::Error for SignatureError {
    // fn description(&self) -> &str {
    //     *self.
    //     // match *self {
    //     //     Self::FetchError(_) => "FetchError",
    //     //     Self::NonNumericMaxAge(ref err) => &format!("NonNumericMaxAge: {}", err),
    //     //     Self::MaxAgeValueEmpty => "MaxAgeValueEmpty",
    //     //     Self::NoMaxAgeSpecified => "NoMaxAgeSpecified",
    //     //     Self::NoCacheControlHeader => "NoCacheControlHeader",
    //     //     Self::SerdeError(ref err) => &format!("SerdeError: {}", err),
    //     //     Self::IdTokenNotThreeParts => "IdTokenNotThreeParts",
    //     //     Self::Base64Error(ref err) => &format!("Base64Error: {}", err),
    //     //     Self::InvalidAlg => "InvalidAlg",
    //     //     Self::KidNotFound => "KidNotFound",
    //     //     Self::InvalidIss(ref err) => &format!("InvalidIss: {}", err),
    //     // }
    // }

    fn cause(&self) -> Option<&dyn error::Error> {
        None
    }
}
