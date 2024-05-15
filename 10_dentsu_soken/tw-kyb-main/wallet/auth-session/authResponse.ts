import { AuthSessionResult } from './authSession';
import { MakeAuthRequestOutput } from './authRequest';
import * as queryParams from './queryParams';

export const checkAuthResponse = (
  response: AuthSessionResult,
): string | undefined => {
  if (response.type === 'cancel') {
    return undefined;
  }

  if (response.type !== 'success') {
    throw new Error(`Unexpected response type: ${response.type}`);
  }

  return response.url as string;
};

export type ParsedAuthResponseUrl = {
  code: string;
  state: string;
  issuerState?: string;
  params: queryParams.Params;
};

export const parseAuthResponseUrl = (url: string): ParsedAuthResponseUrl => {
  const params = queryParams.getQueryParams(url);
  const { code, issuer_state, state, error, error_description } = params;

  if (error) {
    throw new Error(`${error}: ${error_description}`);
  }

  return {
    code,
    state,
    issuerState: issuer_state,
    params,
  };
};

export const checkParsedAuthResponseUrl = (
  makeOutput: MakeAuthRequestOutput,
  parsedUrl: ParsedAuthResponseUrl,
) => {
  if (makeOutput.state != parsedUrl.state) {
    throw new Error(
      'Cross-Site request verification failed. Cached state and returned state do not match.',
    );
  }
};
