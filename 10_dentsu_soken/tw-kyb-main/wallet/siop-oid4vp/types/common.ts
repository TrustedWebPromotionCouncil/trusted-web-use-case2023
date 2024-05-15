import { VerifyCallback as WellknownDIDVerifyCallback } from '@sphereon/wellknown-dids-client';
import { JWTVerifyOptions } from 'did-jwt';
import { Resolvable } from 'did-resolver';
import { Signer } from '../../jwt-alg';
import {
  PassBy,
  PropertyTargets,
  SigningAlgo,
  VerificationMode,
  CheckLinkedDomain,
} from './enumValues';

export interface AnyOpts {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [x: string]: any;
}

export interface ObjectBy {
  passBy: PassBy;
  reference_uri?: string; // for pass by reference

  targets?: PropertyTargets;
}

export interface InternalSignature {
  hexPrivateKey: string; // hex private key Only secp256k1 format
  did: string;

  alg: SigningAlgo;
  kid?: string; // Optional: key identifier

  customJwtSigner?: Signer;
}

export interface ExternalSignature {
  signatureUri: string; // url to call to generate a withSignature
  did: string;
  authZToken?: string; // Optional: bearer token to use to the call
  hexPublicKey?: string; // Optional: hex encoded public key to compute JWK key, if not possible from DIDres Document

  alg: SigningAlgo;
  kid?: string; // Optional: key identifier. default did#keys-1
}

export interface NoSignature {
  hexPublicKey: string;
  did: string;
  kid?: string;
}

export interface ResolveOpts {
  jwtVerifyOpts?: JWTVerifyOptions;
  resolver?: Resolvable;
  resolveUrl?: string;

  // By default we fallback to the universal resolver for max interop.
  noUniversalResolverFallback?: boolean;
  subjectSyntaxTypesSupported?: string[];
}

export interface Verification {
  checkLinkedDomain?: CheckLinkedDomain;
  wellknownDIDVerifyCallback?: WellknownDIDVerifyCallback;
  //presentationVerificationCallback?: PresentationVerificationCallback;
  mode: VerificationMode;
  resolveOpts: ResolveOpts;
  //revocationOpts?: RevocationOpts;
  //replayRegistry?: IRPSessionManager;
}

export type InternalVerification = Verification;

export interface ExternalVerification extends Verification {
  verifyUri: string; // url to call to verify the id_token withSignature
  authZToken?: string; // Optional: bearer token to use to the call
}
