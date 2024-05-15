import { Format } from '@sphereon/pex-models';
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
  EncKeyAlgorithm,
  EncSymmetricAlgorithmCode,
} from './enumValues';
import { AnyOpts, ObjectBy } from './common';

type DiscoveryMetadataCommonOpts = {
  authorizationEndpoint?: Schema | string;
  issuer?: ResponseIss | string;
  responseTypesSupported?: ResponseType[] | ResponseType;
  scopesSupported?: Scope[] | Scope;
  subjectTypesSupported?: SubjectType[] | SubjectType;
  idTokenSigningAlgValuesSupported?: SigningAlgo[] | SigningAlgo;
  requestObjectSigningAlgValuesSupported?: SigningAlgo[] | SigningAlgo;
  subject_syntax_types_supported?: string[];
  tokenEndpoint?: string;
  userinfoEndpoint?: string;
  jwksUri?: string;
  registrationEndpoint?: string;
  responseModesSupported?: ResponseMode[] | ResponseMode;
  grantTypesSupported?: GrantType[] | GrantType;
  acrValuesSupported?:
    | AuthenticationContextReferences[]
    | AuthenticationContextReferences;
  idTokenEncryptionAlgValuesSupported?: SigningAlgo[] | SigningAlgo;
  idTokenEncryptionEncValuesSupported?: string[] | string;
  userinfoSigningAlgValuesSupported?: SigningAlgo[] | SigningAlgo;
  userinfoEncryptionAlgValuesSupported?: SigningAlgo[] | SigningAlgo;
  userinfoEncryptionEncValuesSupported?: string[] | string;
  requestObjectEncryptionAlgValuesSupported?: SigningAlgo[] | SigningAlgo;
  requestObjectEncryptionEncValuesSupported?: string[] | string;
  tokenEndpointAuthMethodsSupported?:
    | TokenEndpointAuthMethod[]
    | TokenEndpointAuthMethod;
  tokenEndpointAuthSigningAlgValuesSupported?: SigningAlgo[] | SigningAlgo;
  displayValuesSupported?: string[] | string;
  claimTypesSupported?: ClaimType[] | ClaimType;
  claimsSupported?: string[] | string;
  serviceDocumentation?: string;
  claimsLocalesSupported?: string[] | string;
  uiLocalesSupported?: string[] | string;
  claimsParameterSupported?: boolean;
  requestParameterSupported?: boolean;
  requestUriParameterSupported?: boolean;
  requireRequestUriRegistration?: boolean;
  opPolicyUri?: string;
  opTosUri?: string;
} & AnyOpts;

export type DiscoveryMetadataOpts = {
  logo_uri?: string;
  clientPurpose?: string;
  client_id?: string;
  redirectUris?: string[] | string;
  clientName?: string;
  tokenEndpointAuthMethod?: string;
  applicationType?: string;
  responseTypes?: string;
  grantTypes?: string;
  vpFormats?: Format;
  idTokenTypesSupported?: IdTokenType[] | IdTokenType;
  vpFormatsSupported?: Format;
} & DiscoveryMetadataCommonOpts;

export type RPRegistrationMetadataOpts = Partial<
  Pick<
    DiscoveryMetadataOpts,
    | 'client_id'
    | 'idTokenSigningAlgValuesSupported'
    | 'requestObjectSigningAlgValuesSupported'
    | 'responseTypesSupported'
    | 'scopesSupported'
    | 'subjectTypesSupported'
    | 'subject_syntax_types_supported'
    | 'vpFormatsSupported'
    | 'clientName'
    | 'logo_uri'
    | 'tos_uri'
    | 'clientPurpose'
  >
> &
  AnyOpts;

export type ClientMetadataProperties = {
  id_token_encrypted_response_alg?: EncKeyAlgorithm;
  id_token_encrypted_response_enc?: EncSymmetricAlgorithmCode;
} & ObjectBy;

export type ClientMetadataOpts = RPRegistrationMetadataOpts &
  ClientMetadataProperties;
