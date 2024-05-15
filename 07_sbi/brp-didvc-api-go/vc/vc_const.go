package vc

const HTTP_400_ERROR_MSG = "Bad request."
const HTTP_400_FOUND_BRACKET = "Curly bracket was found."
const HTTP_400_BAD_KEY_NAME = "Bad request. KeyName is a string that starts with a lowercase letter and includes alphanumeric characters, hyphens, and underscores."
const HTTP_404_PRIVATE_KEY_NOT_FOUND = "Private key not found in AWS Secrets Manager."
const HTTP_404_PUBLIC_KEY_NOT_FOUND = "Public key not found in AWS Secrets Manager."
const HTTP_500_MULTI_BASE_DECODE_ERROR = "Error Happened in the function of MultiBase Decode."
const HTTP_500_MULTI_BASE_ENCODE_ERROR = "Error Happened in the function of MultiBase Encode."
const HTTP_500_JSON_ENCODE_ERROR = "Error Happened in the function of Json Marshal."
const HTTP_500_JSON_DECODE_ERROR = "Error Happened in the function of Json Unmarshal."

const HTTP_500_BASE64_DECODE_ERROR = "Error Happened in the function of Base64 Decode."

const ENCRYPTION_TYPE = "Ed25519Signature2018"

const VC_CONTEXT = "https://www.w3.org/2018/credentials/v2"
const VC_TYPE = "VerifiableCredential"
const VC_PROOF_PURPOSE = "assertionMethod"

const VP_TYPE = "VerifiablePresentation"
const VP_PROOF_PURPOSE = "authentication"

const NEW_RELIC_APP_NAME = "brp-didvc-api-go"
