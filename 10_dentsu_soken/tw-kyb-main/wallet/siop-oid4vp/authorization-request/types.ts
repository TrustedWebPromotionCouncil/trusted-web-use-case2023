import { Hasher } from '@sphereon/ssi-types';
import {
  ResponseMode,
  Scope,
  SubjectType,
  SigningAlgo,
  Schema,
  InternalSignature,
  ExternalSignature,
  NoSignature,
  AnyOpts,
  ObjectBy,
  ClientMetadataOpts,
  InternalVerification,
  ExternalVerification,
} from '../types';

export type RequestObjectPayloadOpts<CT extends AnyOpts> = {
  scope: string;
  response_type: string;
  client_id: string;
  redirect_uri?: string;
  response_uri?: string;
  id_token_hint?: string;
  claims?: CT;
  nonce?: string;
  state?: string;
  authorization_endpoint?: string;
  response_mode?: ResponseMode;
  response_types_supported?: ResponseType[] | ResponseType;
  scopes_supported?: Scope[] | Scope;
  subject_types_supported?: SubjectType[] | SubjectType;
  request_object_signing_alg_values_supported?: SigningAlgo[] | SigningAlgo;
} & AnyOpts;

export type RequestObjectOpts<CT extends AnyOpts> = {
  payload?: RequestObjectPayloadOpts<CT>;
  signature: InternalSignature | ExternalSignature | NoSignature;
} & ObjectBy;

export type AuthorizationRequestPayloadOpts<CT extends AnyOpts> = {
  request_uri?: string;
} & Partial<RequestObjectPayloadOpts<CT>>;

type AuthorizationRequestCommonOpts<CT extends AnyOpts> = {
  clientMetadata?: ClientMetadataOpts;
  payload?: AuthorizationRequestPayloadOpts<CT>;
  requestObject: RequestObjectOpts<CT>;

  uriScheme?: Schema | string;
};

export type AuthorizationRequestOpts = {
  idTokenType?: string;
} & AuthorizationRequestCommonOpts<AnyOpts>;

export type CreateAuthorizationRequestOpts = AuthorizationRequestOpts;

export interface VerifyAuthorizationRequestOpts {
  correlationId: string;

  verification: InternalVerification | ExternalVerification;
  nonce?: string;
  state?: string;

  hasher?: Hasher;
}
