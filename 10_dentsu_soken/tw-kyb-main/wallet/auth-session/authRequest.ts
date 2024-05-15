import { makeAuthDetail4VcSdJwt } from './authDetail';
import type { Crypto } from './crypto';
import { buildCodeAsync } from './pkce';
import { Params, buildQueryString } from './queryParams';
import { generateRandom } from './cryptoUtils';

type MakeAuthRequestInput = {
  baseUrl: string;
  clientId: string;
  redirectUri: string;
  issuerState?: string;
  crypto: Crypto;
};

export type MakeAuthRequestOutput = {
  url: string;
  state: string;
  codeVerifier: string;
  redirectUri: string;
};

export const makeAuthRequestAsync = async ({
  baseUrl: baseUri,
  clientId,
  redirectUri,
  issuerState,
  crypto,
}: MakeAuthRequestInput): Promise<MakeAuthRequestOutput> => {
  const { codeVerifier, codeChallenge } = await buildCodeAsync(128, crypto);
  const state = await generateRandom(128, crypto);
  const authDetails = JSON.stringify([makeAuthDetail4VcSdJwt()]);
  const params: Params = {
    response_type: 'code',
    client_id: clientId,
    state,
    code_challenge: codeChallenge,
    code_challenge_method: 'S256',
    authorization_details: authDetails,
    redirect_uri: redirectUri,
  };

  if (issuerState) {
    params.issuer_state = issuerState;
  }
  const url = `${baseUri}?${buildQueryString(params)}`;

  return { url, state, codeVerifier, redirectUri };
};
