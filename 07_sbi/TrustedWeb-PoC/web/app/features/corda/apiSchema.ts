import { makeApi, Zodios, type ZodiosOptions } from '@zodios/core';
import { z } from 'zod';

const postCordavcJson_Body = z
  .object({
    authOrgName: z.string(),
    vcID: z.string(),
    validityPeriod: z.number().int(),
  })
  .passthrough();
const VerificationMethod = z
  .object({
    controller: z.string(),
    id: z.string(),
    publicKeyMultibase: z.string(),
    type: z.string(),
  })
  .passthrough();
const DIDDocument = z
  .object({
    '@context': z.string(),
    id: z.string(),
    verificationMethod: z.array(VerificationMethod),
  })
  .passthrough();
const CredentialSubject = z
  .object({ blockHash: z.string(), didDocument: DIDDocument, uuid: z.string() })
  .passthrough();
const Issuer = z
  .object({ id: z.string(), name: z.string() })
  .partial()
  .passthrough();
const Proof = z
  .object({
    type: z.string(),
    created: z.string().datetime({ offset: true }),
    proofPurpose: z.string(),
    verificationMethod: z.string(),
    signatureValue: z.string(),
  })
  .partial()
  .passthrough();
const VerifiableCredential = z.union([
  z.null(),
  z
    .object({
      '@context': z.array(z.string()),
      id: z.string(),
      type: z.array(z.string()),
      credentialSubject: CredentialSubject,
      issuer: Issuer,
      validFrom: z.string().datetime({ offset: true }),
      validUntil: z.string().datetime({ offset: true }),
      proof: Proof,
    })
    .partial()
    .passthrough(),
]);

export const schemas = {
  postCordavcJson_Body,
  VerificationMethod,
  DIDDocument,
  CredentialSubject,
  Issuer,
  Proof,
  VerifiableCredential,
};

const endpoints = makeApi([
  {
    method: 'get',
    path: '/corda/get-corda-network-info',
    alias: 'getCordagetCordaNetworkInfo',
    description: `Cordaネットワーク内のすべてのノードのCorda Identityを取得します。
`,
    requestFormat: 'json',
    response: z.array(z.string()),
  },
  {
    method: 'get',
    path: '/corda/get-my-identity',
    alias: 'getCordagetMyIdentity',
    description: `呼び出し元ノードのX500組織名を取得します。
`,
    requestFormat: 'json',
    response: z.void(),
  },
  {
    method: 'get',
    path: '/corda/get-my-role',
    alias: 'getCordagetMyRole',
    description: `呼び出し元ノードのRoleを取得します
(例、 公的機関：AUTH_ORG、失効管理体：AUTH_ORG_CONSORTIUM、認証機構：AUTH_COMPANY)。
`,
    requestFormat: 'json',
    response: z.void(),
  },
  {
    method: 'post',
    path: '/corda/revocation/vc',
    alias: 'postCordarevocationvc',
    description: `事業所用VCに使用するUUIDを発番
Role制限：　認証機構
`,
    requestFormat: 'json',
    response: z
      .object({ blockHash: z.string(), uuid: z.string().uuid() })
      .passthrough(),
    errors: [
      {
        status: 401,
        description: `Unauthorized: 期待されていないRoleです。`,
        schema: z.void(),
      },
      {
        status: 500,
        description: `Internal Server Error: Cordaの例外が発生しました。`,
        schema: z.void(),
      },
    ],
  },
  {
    method: 'get',
    path: '/corda/revocation/vc-revoked-list',
    alias: 'getCordarevocationvcRevokedList',
    description: `失効ずみの事業所用VC（UUID）の一覧を取得
Role制限：　失効管理体　OR　認証機構
`,
    requestFormat: 'json',
    response: z.array(z.object({ uuid: z.string().uuid() }).passthrough()),
    errors: [
      {
        status: 401,
        description: `Unauthorized: 期待されていないRoleです。`,
        schema: z.void(),
      },
      {
        status: 500,
        description: `Internal Server Error: Cordaの例外が発生しました。`,
        schema: z.void(),
      },
    ],
  },
  {
    method: 'get',
    path: '/corda/revocation/vc-status/:uuid',
    alias: 'getCordarevocationvcStatusUuid',
    description: `uuidのVCの認証状態を取得
Role制限：　失効管理体　OR　認証機構
`,
    requestFormat: 'json',
    parameters: [
      {
        name: 'uuid',
        type: 'Path',
        schema: z.string().uuid(),
      },
    ],
    response: z.object({ status: z.string() }).partial().passthrough(),
    errors: [
      {
        status: 401,
        description: `Unauthorized: 期待されていないRoleです。`,
        schema: z.void(),
      },
      {
        status: 500,
        description: `Internal Server Error: Cordaの例外が発生しました。`,
        schema: z.void(),
      },
    ],
  },
  {
    method: 'get',
    path: '/corda/revocation/vc-valid-list',
    alias: 'getCordarevocationvcValidList',
    description: `有効の事業所用VC（UUID）の一覧を取得
Role制限：　失効管理体　OR　認証機構
`,
    requestFormat: 'json',
    response: z.array(z.object({ uuid: z.string().uuid() }).passthrough()),
    errors: [
      {
        status: 401,
        description: `Unauthorized: 期待されていないRoleです。`,
        schema: z.void(),
      },
      {
        status: 500,
        description: `Internal Server Error: Cordaの例外が発生しました。`,
        schema: z.void(),
      },
    ],
  },
  {
    method: 'delete',
    path: '/corda/revocation/vc/:uuid',
    alias: 'deleteCordarevocationvcUuid',
    description: `UUIDで指定された事業所用VCを失効させる
Role制限：　認証機構
`,
    requestFormat: 'json',
    parameters: [
      {
        name: 'uuid',
        type: 'Path',
        schema: z.string().uuid(),
      },
    ],
    response: z.object({ blockHash: z.string() }).passthrough(),
    errors: [
      {
        status: 401,
        description: `Unauthorized: 期待されていないRoleです。`,
        schema: z.void(),
      },
      {
        status: 500,
        description: `Internal Server Error: Cordaの例外が発生しました。`,
        schema: z.void(),
      },
    ],
  },
  {
    method: 'put',
    path: '/corda/revocation/vc/:uuid',
    alias: 'putCordarevocationvcUuid',
    description: `UUIDで指定された事業所用VCを失効させ、新UUIDを発番
Role制限：　認証機構
`,
    requestFormat: 'json',
    parameters: [
      {
        name: 'uuid',
        type: 'Path',
        schema: z.string().uuid(),
      },
    ],
    response: z
      .object({ blockHash: z.string(), uuid: z.string().uuid() })
      .passthrough(),
    errors: [
      {
        status: 401,
        description: `Unauthorized: 期待されていないRoleです。`,
        schema: z.void(),
      },
      {
        status: 500,
        description: `Internal Server Error: Cordaの例外が発生しました。`,
        schema: z.void(),
      },
    ],
  },
  {
    method: 'post',
    path: '/corda/vc-json',
    alias: 'postCordavcJson',
    description: `リクエストパラメータに基づいてVCを生成。
Role制限：　失効管理体　OR　認証機構
`,
    requestFormat: 'json',
    parameters: [
      {
        name: 'body',
        type: 'Body',
        schema: postCordavcJson_Body,
      },
    ],
    response: VerifiableCredential,
    errors: [
      {
        status: 401,
        description: `Unauthorized: 期待されていないRoleです。`,
        schema: z.void(),
      },
      {
        status: 500,
        description: `Internal Server Error: Cordaの例外が発生しました。`,
        schema: z.void(),
      },
    ],
  },
  {
    method: 'get',
    path: '/corda/vc-json-list',
    alias: 'getCordavcJsonList',
    description: `VC(JSONデータ)リストを取得。
Role制限：　失効管理体　OR　認証機構
`,
    requestFormat: 'json',
    response: z.array(VerifiableCredential),
    errors: [
      {
        status: 401,
        description: `Unauthorized: 期待されていないRoleです。`,
        schema: z.void(),
      },
      {
        status: 500,
        description: `Internal Server Error: Cordaの例外が発生しました。`,
        schema: z.void(),
      },
    ],
  },
  {
    method: 'get',
    path: '/corda/vc-json-list-for-auth-company',
    alias: 'getCordavcJsonListForAuthCompany',
    description: `認証機構用のVC（JSONデータ）リストを取得。
Role制限：　公的機関
`,
    requestFormat: 'json',
    response: z.array(VerifiableCredential),
    errors: [
      {
        status: 401,
        description: `Unauthorized: 期待されていないRoleです。`,
        schema: z.void(),
      },
      {
        status: 500,
        description: `Internal Server Error: Cordaの例外が発生しました。`,
        schema: z.void(),
      },
    ],
  },
  {
    method: 'get',
    path: '/corda/vc-json-list-for-auth-consortium',
    alias: 'getCordavcJsonListForAuthConsortium',
    description: `失効管理体用のVC（JSONデータ）リストを取得。
Role制限：　公的機関
`,
    requestFormat: 'json',
    response: z.array(VerifiableCredential),
    errors: [
      {
        status: 401,
        description: `Unauthorized: 期待されていないRoleです。`,
        schema: z.void(),
      },
      {
        status: 500,
        description: `Internal Server Error: Cordaの例外が発生しました。`,
        schema: z.void(),
      },
    ],
  },
  {
    method: 'get',
    path: '/corda/version',
    alias: 'getCordaversion',
    requestFormat: 'json',
    response: z.void(),
  },
]);

export const api = new Zodios(endpoints);

export function createApiClient(baseUrl: string, options?: ZodiosOptions) {
  return new Zodios(baseUrl, endpoints, options);
}
