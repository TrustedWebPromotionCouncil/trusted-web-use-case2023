import { CredentialRequest4VcSdJwt, CredentialResponse } from './types';

export const fetch4VcSdJwt = async ({
  credentialEndpoint,
  accessToken,
  vct,
  keyProofJwt,
}: CredentialRequest4VcSdJwt): Promise<CredentialResponse> => {
  const headers = {
    Authorization: `Bearer ${accessToken}`,
    'Content-Type': 'application/json',
  };
  const body = JSON.stringify({
    format: 'vc+sd-jwt',
    vct,
    proof: {
      proof_type: 'jwt',
      jwt: keyProofJwt,
    },
  });

  const res = await fetch(credentialEndpoint, {
    method: 'POST',
    headers,
    body,
  });
  const json = await res.json();
  return json as CredentialResponse;
};
