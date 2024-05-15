import type { FetchRequest } from './fetch';
import { Params } from './queryParams';
import { fetchAsync } from './fetch';
import { sleep } from './sleep';
import { getCurrentTimeInSeconds } from './dateUtils';
import { validIssuedAt } from './dateUtils';

type MakeAuthTokenRequestInput = {
  clientId: string;
  code: string;
  codeVerifier: string;
  redirectUri: string;
};

export const makeAuthTokenRequest = ({
  clientId,
  code,
  codeVerifier,
  redirectUri,
}: MakeAuthTokenRequestInput): FetchRequest => {
  const body: Params = {
    grant_type: 'authorization_code',
    client_id: clientId,
    code,
    code_verifier: codeVerifier,
    redirect_uri: redirectUri,
  };

  return {
    method: 'POST',
    dataType: 'form',
    body,
  };
};

type MakePreAuthTokenRequestInput = {
  clientId: string;
  preAuthorizedCode: string;
  userPin?: string;
};

export const makePreAuthTokenRequest = ({
  clientId,
  preAuthorizedCode,
  userPin,
}: MakePreAuthTokenRequestInput): FetchRequest => {
  const body: Params = {
    grant_type: 'urn:ietf:params:oauth:grant-type:pre-authorized_code',
    client_id: clientId,
    'pre-authorized_code': preAuthorizedCode,
  };

  if (userPin) {
    body.user_pin = userPin;
  }

  return {
    method: 'POST',
    dataType: 'form',
    body,
  };
};

export type AuthTokenResponse = {
  accessToken: string;
  tokenType: string;
  issuedAt: number;
  expiresIn?: number;
  cNonce?: string;
  cNonceExpiresIn?: number;
  rawResponse: Record<string, any>;
};

const RETRY_MAX = 100;
const RETRY_INTERVAL = 5000;
const RETRY_INCRESED_INTERVAL = 5000;

export const fetchAuthTokenRequestAsync = async (
  url: string,
  fetchRequest: FetchRequest,
): Promise<AuthTokenResponse> => {
  let interval = RETRY_INTERVAL;

  for (let retry = 0; retry < RETRY_MAX; retry += 1) {
    const res: Record<string, any> = await fetchAsync(url, fetchRequest);

    if (!res.error) {
      if (res.issued_at && !validIssuedAt(res.issued_at)) {
        throw new Error(
          `Authorization Token Request Error: invalid_issued_at ${res.issued_at} in the future`,
        );
      }

      return {
        accessToken: res.access_token,
        tokenType: res.token_type,
        issuedAt: res.issued_at || getCurrentTimeInSeconds(),
        expiresIn: res.expires_in,
        cNonce: res.c_nonce,
        cNonceExpiresIn: res.c_nonce_expires_in,
        rawResponse: res,
      };
    } else if (res.error === 'authorization_pending') {
      await sleep(interval);
    } else if (res.error === 'slow_down') {
      interval += RETRY_INCRESED_INTERVAL;
      await sleep(interval);
    } else {
      throw new Error(`Authorization Token Request Error: ${res.error}`);
    }
  }

  throw new Error(
    `Authorization Token Request Error: retry_max_exceeded ${RETRY_MAX}`,
  );
};
