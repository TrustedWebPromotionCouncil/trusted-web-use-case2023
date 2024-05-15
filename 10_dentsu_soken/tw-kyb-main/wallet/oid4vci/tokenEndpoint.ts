import { TokenRequest4PreAuthorizedCodeFlow, TokenResponse } from './types';
import qs from 'qs';

export const fetch4PreAuthorizedCodeFlow = async ({
  tokenEndpoint,
  clientId,
  preAuthorizedCode,
}: TokenRequest4PreAuthorizedCodeFlow): Promise<TokenResponse> => {
  const headers = {
    'Content-Type': 'application/x-www-form-urlencoded',
  };
  const body = qs.stringify({
    client_id: clientId,
    grant_type: 'urn:ietf:params:oauth:grant-type:pre-authorized_code',
    'pre-authorized_code': preAuthorizedCode,
  });

  const res = await fetch(tokenEndpoint, {
    method: 'POST',
    headers,
    body,
  });
  const json = await res.json();
  return json as TokenResponse;
};
