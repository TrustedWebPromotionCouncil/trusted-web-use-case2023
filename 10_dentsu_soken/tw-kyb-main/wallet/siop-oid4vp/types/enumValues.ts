export enum KeyType {
  EC = 'EC',
}

export enum KeyCurve {
  SECP256k1 = 'secp256k1',
  ED25519 = 'ed25519',
}

export enum TokenEndpointAuthMethod {
  CLIENT_SECRET_POST = 'client_secret_post',
  CLIENT_SECRET_BASIC = 'client_secret_basic',
  CLIENT_SECRET_JWT = 'client_secret_jwt',
  PRIVATE_KEY_JWT = 'private_key_jwt',
}

export enum SigningAlgo {
  EDDSA = 'EdDSA',
  RS256 = 'RS256',
  PS256 = 'PS256',
  ES256 = 'ES256',
  ES256K = 'ES256K',
}

export enum Scope {
  OPENID = 'openid',
  OPENID_DIDAUTHN = 'openid did_authn',
  //added based on the https://openid.net/specs/openid-connect-implicit-1_0.html#SelfIssuedDiscovery
  PROFILE = 'profile',
  EMAIL = 'email',
  ADDRESS = 'address',
  PHONE = 'phone',
}

export enum ResponseType {
  ID_TOKEN = 'id_token',
  VP_TOKEN = 'vp_token',
}

export enum SubjectIdentifierType {
  JKT = 'jkt',
  DID = 'did',
}

export enum SubjectSyntaxTypesSupportedValues {
  DID = 'did',
  JWK_THUMBPRINT = 'urn:ietf:params:oauth:jwk-thumbprint',
}

export enum CredentialFormat {
  JSON_LD = 'w3cvc-jsonld',
  JWT = 'jwt',
}

export enum SubjectType {
  PUBLIC = 'public',
  PAIRWISE = 'pairwise',
}

export enum Schema {
  OPENID = 'openid:',
  OPENID_VC = 'openid-vc:',
}

export enum ResponseIss {
  SELF_ISSUED_V1 = 'https://self-issued.me',
  SELF_ISSUED_V2 = 'https://self-issued.me/v2',
  JWT_VC_PRESENTATION_V1 = 'https://self-issued.me/v2/openid-vc',
}

export enum RevocationStatus {
  VALID = 'valid',
  INVALID = 'invalid',
}

export enum RevocationVerification {
  NEVER = 'never', // We don't want to verify revocation
  IF_PRESENT = 'if_present', // If credentialStatus is present, did-auth-siop will verify revocation. If present and not valid an exception is thrown
  ALWAYS = 'always', // We'll always check the revocation, if not present or not valid, throws an exception
}

/**
 * Determines where a property will end up. Methods that support this argument are optional. If you do not provide any value it will default to all targets.
 */
export enum PropertyTarget {
  // The property will end up in the oAuth2 authorization request
  AUTHORIZATION_REQUEST = 'authorization-request',

  // OpenID Request Object (the JWT)
  REQUEST_OBJECT = 'request-object',
}

export type PropertyTargets = PropertyTarget | PropertyTarget[];

export enum GrantType {
  AUTHORIZATION_CODE = 'authorization_code',
  IMPLICIT = 'implicit',
}

export enum ResponseMode {
  FRAGMENT = 'fragment',
  FORM_POST = 'form_post',
  POST = 'post', // Used in OID4VP spec <= version 17
  // Defined in openid4vp spec > 17 and replaces POST above
  // See https://openid.net/specs/openid-4-verifiable-presentations-1_0.html#name-response-mode-direct_post
  DIRECT_POST = 'direct_post',
  QUERY = 'query',
}

export enum ProtocolFlow {
  SAME_DEVICE = 'same_device',
  CROSS_DEVICE = 'cross_device',
}

export enum AuthenticationContextReferences {
  PHR = 'phr',
  PHRH = 'phrh',
}

export enum ClaimType {
  NORMAL = 'normal',
  AGGREGATED = 'aggregated',
  DISTRIBUTED = 'distributed',
}

export enum IdTokenType {
  SUBJECT_SIGNED = 'subject_signed',
  ATTESTER_SIGNED = 'attester_signed',
}

export enum VerifiablePresentationTypeFormat {
  JWT_VP = 'jwt_vp',
  LDP_VP = 'ldp_vp',
  SD_JWT_VC = 'vc+sd-jwt',
}

export enum VerifiableCredentialTypeFormat {
  LDP_VC = 'ldp_vc',
  JWT_VC = 'jwt_vc',
  SD_JWT_VC = 'vc+sd-jwt',
}

export enum EncSymmetricAlgorithmCode {
  XC20P = 'XC20P', // default
}

export enum EncKeyAlgorithm {
  ECDH_ES = 'ECDH-ES', // default
}

export enum PassBy {
  NONE = 'NONE',
  REFERENCE = 'REFERENCE',
  VALUE = 'VALUE',
}

export enum ResponseContext {
  RP = 'rp',
  OP = 'op',
}

export enum CheckLinkedDomain {
  NEVER = 'never',
  IF_PRESENT = 'if_present',
  ALWAYS = 'always',
}

export enum VerificationMode {
  INTERNAL,
  EXTERNAL,
}
