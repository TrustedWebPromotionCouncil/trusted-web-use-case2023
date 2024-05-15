import { describe, it, expect } from 'vitest';

import { parseCredentialOffer } from './credentialOffer';

const RUN = process.env.RUN || '';

const offer =
  // 'openid-credential-offer://?credential_offer=%7B%22credential_issuer%22%3A%22https%3A%2F%2Ftw24-oauth-server.an.r.appspot.com%22%2C%22credential_configuration_ids%22%3A%5B%22IdentityCredential%22%2C%22org.iso.18013.5.1.mDL%22%5D%2C%22grants%22%3A%7B%22urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Apre-authorized_code%22%3A%7B%22pre-authorized_code%22%3A%22BDk4jmDXHGlW9HXMtJ40PW7vQhrNvYNgs7U2Rmy2INc%22%7D%7D%7D';
  'openid-credential-offer://?credential_offer_uri=https%3A%2F%2Ftw24-oauth-server.an.r.appspot.com%2Fapi%2Foffer%2FFzfOGtD2Ke-V9_isKEq87uBM_5OrtlfofS82k8EVNfs';
describe('credentialOffer', () => {
  it.runIf(RUN === 'credentialOffer')('parseCredentialOffer', async () => {
    const ret = await parseCredentialOffer(offer);
    console.log('ret :>> ', ret);
  });
});
