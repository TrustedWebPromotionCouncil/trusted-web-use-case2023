export type Client = {
  clientId: string;
  clientName: string;
  redirectUri: string;
};
export type User = {
  userId: string;
  loginId: string;
  password: string;
};
export type AuthCode = {
  value: string;
  userId: string;
  clientId: string;
  authorizationDetails: string;
  redirectUri: string;
  expiresAt: number;
};
export type AccessToken = {
  value: string;
  userId?: string;
  clientId: string;
  authorizationDetails?: string;
  expiresIn: number;
};
export type PKCE = {
  authCode: string;
  codeChallenge: string;
  codeChallengeMethod: string;
};
export type AuthSession = {
  sessionId: string;
  clientId: string;
  state: string;
  authorizationDetails: string;
  redirectUri: string;
  codeChallenge: string;
  codeChallengeMethod: string;
};

export type Nonce = {
  accessToken: string;
  cNonce: string;
  cNonceExpiresIn: number;
};

export type PreAuthCode = {
  preAuthCode: string;
  userPin?: string;
};

export enum Tables {
  Client = 'Client',
  User = 'User',
  AuthCode = 'AuthCode',
  AccessToken = 'AccessToken',
  PKCE = 'PKCE',
  AuthSession = 'AuthSession',
}

export type TOperation = 'create' | 'update' | 'delete' | 'find';
