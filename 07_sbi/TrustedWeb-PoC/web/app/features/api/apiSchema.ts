import { makeApi, Zodios, type ZodiosOptions } from '@zodios/core';
import { z } from 'zod';

const Context = z.array(z.string());
const Id = z.string();
const Type = z.array(z.string());
const VerificationMethod = z
  .object({
    id: z.string().optional(),
    type: z.string().optional().default('Ed25519VerificationKey2018'),
    controller: z.string().optional(),
    publicKeyMultibase: z.string(),
  })
  .passthrough();
const DIDDocument = z
  .object({
    '@context': z.string().default('https://w3id.org/did/v1'),
    id: z.string(),
    verificationMethod: z.array(VerificationMethod).min(1),
  })
  .passthrough();
const BusinessUnitInfo = z
  .object({
    businessUnitName: z.string().max(50),
    country: z.string().max(30),
    address: z.string().max(200).optional(),
    contactInfo: z
      .object({
        name: z.string().max(30),
        department: z.string().max(30),
        jobTitle: z.string(),
        contactNumber: z.string().max(20),
      })
      .partial()
      .passthrough()
      .optional(),
  })
  .passthrough();
const LegalEntityInfo = z
  .object({
    legalEntityIdentifier: z.string().max(30),
    legalEntityName: z.string().max(50),
    location: z.string().max(200),
  })
  .passthrough();
const ValidityDateTime = z.string();
const Proof = z
  .object({
    type: z.string().optional().default('Ed25519Signature2018'),
    created: z.string().datetime({ offset: true }).optional(),
    proofPurpose: z.string().optional(),
    verificationMethod: z.string().optional(),
    signatureValue: z.string(),
  })
  .passthrough();
const requestVc_Body = z
  .object({
    '@context': Context,
    id: Id,
    type: Type,
    credentialSubject: z
      .object({
        didDocument: DIDDocument,
        businessUnitInfo: BusinessUnitInfo,
        legalEntityInfo: LegalEntityInfo,
        authenticationLevel: z.enum(['1', '2', '3']),
        challenge: z.string(),
      })
      .passthrough(),
    issuer: z
      .object({ id: z.string().max(1000), name: z.string().max(50) })
      .passthrough(),
    validFrom: ValidityDateTime.datetime({ offset: true }),
    validUntil: z.string().datetime({ offset: true }),
    proof: Proof,
  })
  .passthrough();
const AuthenticatorInfo = z
  .object({
    digitalCertificateOrganizationName: z.string(),
    digitalCertificateOrganizationCredentialIssuer: z.string(),
  })
  .passthrough();

export const schemas = {
  Context,
  Id,
  Type,
  VerificationMethod,
  DIDDocument,
  BusinessUnitInfo,
  LegalEntityInfo,
  ValidityDateTime,
  Proof,
  requestVc_Body,
  AuthenticatorInfo,
};

const endpoints = makeApi([
  {
    method: 'post',
    path: '/:authorityName/vc-requests',
    alias: 'requestVc',
    description: `事業所IDを申請するためのエンドポイント

リクエストボディのVCは認証とVC発行に必要なデータを送るために使用する。レスポンスでステータスとVC（事業所ID）を返す。
`,
    requestFormat: 'json',
    parameters: [
      {
        name: 'body',
        type: 'Body',
        schema: requestVc_Body,
      },
      {
        name: 'TTW-Auth-Id',
        type: 'Header',
        schema: z.string(),
      },
      {
        name: 'authorityName',
        type: 'Path',
        schema: z.literal('authority-1'),
      },
    ],
    response: z
      .object({
        requestId: z.string(),
        status: z.enum(['Approved', 'Rejected']),
        vc: z
          .object({
            '@context': Context,
            id: Id,
            type: Type,
            credentialSubject: z
              .object({
                didDocument: DIDDocument,
                authenticatorInfo: AuthenticatorInfo,
                businessUnitInfo: BusinessUnitInfo,
                legalEntityInfo: LegalEntityInfo,
                authenticationLevel: z.enum(['1', '2', '3']),
                revocationEndPoints: z.array(z.string()),
                linkedVP: z.object({}).partial().passthrough(),
                uuid: z.string(),
              })
              .passthrough(),
            issuer: z
              .object({ id: z.string().max(1000), name: z.string().max(50) })
              .passthrough(),
            validFrom: ValidityDateTime.datetime({ offset: true }),
            validUntil: z.string().datetime({ offset: true }),
            proof: Proof,
          })
          .passthrough()
          .optional(),
      })
      .passthrough(),
  },
  {
    method: 'get',
    path: '/:organizationName/challenge',
    alias: 'getChallenge',
    requestFormat: 'json',
    parameters: [
      {
        name: 'organizationName',
        type: 'Path',
        schema: z.enum(['authority-1', 'revoke-1']),
      },
    ],
    response: z
      .object({
        authId: z.string(),
        challenge: z.string(),
        exp: z.number().int().default(1695196332),
      })
      .passthrough(),
  },
  {
    method: 'get',
    path: '/:revokeName/vc-status/:uuid',
    alias: 'getVcStatus',
    description: `失効機関用WebApi
対象VCのuuid対するVC状態（Valid, Revoked, Unknown）を失効機関CordaNodeより取得し、失効機関の認証情報と共に返却する
`,
    requestFormat: 'json',
    parameters: [
      {
        name: 'revokeName',
        type: 'Path',
        schema: z.literal('revoke-1'),
      },
      {
        name: 'uuid',
        type: 'Path',
        schema: z.string(),
      },
    ],
    response: z.object({ uuid: z.string(), status: z.string() }).passthrough(),
  },
]);

export const api = new Zodios(endpoints);

export function createApiClient(baseUrl: string, options?: ZodiosOptions) {
  return new Zodios(baseUrl, endpoints, options);
}
