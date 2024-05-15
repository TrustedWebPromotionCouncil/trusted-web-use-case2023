import { Format, PresentationDefinitionV2 } from '@sphereon/pex-models';
import {
  Schema,
  ResponseIss,
  Scope,
  SubjectType,
  SigningAlgo,
  ResponseMode,
  GrantType,
  AuthenticationContextReferences,
  TokenEndpointAuthMethod,
  ClaimType,
  IdTokenType,
} from './enumValues';
import { AnyOpts } from './common';

// https://openid.net/specs/openid-connect-self-issued-v2-1_0.html#section-8.2
// https://openid.net/specs/openid-connect-discovery-1_0.html#ProviderMetadata
type DiscoveryMetadataCommonPayload = {
  authorization_endpoint?: Schema | string;
  issuer?: ResponseIss | string;
  response_types_supported?: ResponseType[] | ResponseType;
  scopes_supported?: Scope[] | Scope;
  subject_types_supported?: SubjectType[] | SubjectType;
  id_token_signing_alg_values_supported?: SigningAlgo[] | SigningAlgo;
  request_object_signing_alg_values_supported?: SigningAlgo[] | SigningAlgo;
  subject_syntax_types_supported?: string[];
  token_endpoint?: string;
  userinfo_endpoint?: string;
  jwks_uri?: string;
  registration_endpoint?: string;
  response_modes_supported?: ResponseMode[] | ResponseMode;
  grant_types_supported?: GrantType[] | GrantType;
  acr_values_supported?:
    | AuthenticationContextReferences[]
    | AuthenticationContextReferences;
  id_token_encryption_alg_values_supported?: SigningAlgo[] | SigningAlgo;
  id_token_encryption_enc_values_supported?: string[] | string;
  userinfo_signing_alg_values_supported?: SigningAlgo[] | SigningAlgo;
  userinfo_encryption_alg_values_supported?: SigningAlgo[] | SigningAlgo;
  userinfo_encryption_enc_values_supported?: string[] | string;
  request_object_encryption_alg_values_supported?: SigningAlgo[] | SigningAlgo;
  request_object_encryption_enc_values_supported?: string[] | string;
  token_endpoint_auth_methods_supported?:
    | TokenEndpointAuthMethod[]
    | TokenEndpointAuthMethod;
  token_endpoint_auth_signing_alg_values_supported?:
    | SigningAlgo[]
    | SigningAlgo;
  display_values_supported?: unknown[] | unknown;
  claim_types_supported?: ClaimType[] | ClaimType;
  claims_supported?: string[] | string;
  service_documentation?: string;
  claims_locales_supported?: string[] | string;
  ui_locales_supported?: string[] | string;
  claims_parameter_supported?: boolean;
  request_parameter_supported?: boolean;
  request_uri_parameter_supported?: boolean;
  require_request_uri_registration?: boolean;
  op_policy_uri?: string;
  op_tos_uri?: string;
} & AnyOpts;

export type DiscoveryMetadataPayload = {
  logo_uri?: string;
  client_purpose?: string;
  client_id?: string;
  redirect_uris?: string[];
  client_name?: string;
  token_endpoint_auth_method?: string;
  application_type?: string;
  response_types?: string;
  grant_types?: string;
  vp_formats?: Format;
  id_token_types_supported?: IdTokenType[] | IdTokenType;
  vp_formats_supported?: Format;
} & DiscoveryMetadataCommonPayload;

export type RPRegistrationMetadataPayload = Pick<
  DiscoveryMetadataPayload,
  | 'client_id'
  | 'id_token_signing_alg_values_supported'
  | 'request_object_signing_alg_values_supported'
  | 'response_types_supported'
  | 'scopes_supported'
  | 'subject_types_supported'
  | 'subject_syntax_types_supported'
  | 'vp_formats'
  | 'client_name'
  | 'logo_uri'
  | 'client_purpose'
> &
  AnyOpts;

export interface VpTokenClaimPayload {
  presentation_definition?: PresentationDefinitionV2;
  presentation_definition_uri?: string;
}

// export type ClaimPayloadOptsVID1 = {
//   id_token?: AnyOpts;
//   vp_token?: VpTokenClaimPayload;
// } & AnyOpts;
