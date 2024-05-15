import { AuthCode, AuthSession } from './type';
import { getRandomValue } from '../utils/random';
import { load, saveChage } from '.';

const AuthCodeDuration = 10 * 60 * 1000;
const fileName = 'AuthCode.db';

const getData = (): AuthCode[] => {
  const prev = load(fileName);
  return prev ? (prev as AuthCode[]) : [];
};

export const createAuthCode = (userId: string, session: AuthSession) => {
  if (!userId || !session) {
    throw new Error('');
  }
  const authCode: AuthCode = {
    value: getRandomValue(),
    userId,
    clientId: session.clientId,
    authorizationDetails: session.authorizationDetails,
    redirectUri: session.redirectUri,
    expiresAt: Date.now() + AuthCodeDuration,
  };
  const AuthCodeStore = getData();
  AuthCodeStore.push(authCode);
  saveChage(fileName, AuthCodeStore);
  return authCode;
};

export const findAuthCode = (value: string) => {
  const AuthCodeStore: AuthCode[] = getData();
  return AuthCodeStore.find((v) => v.value === value);
};

export const deleteAuthCode = (value: string) => {
  const AuthCodeStore: AuthCode[] = getData();
  AuthCodeStore.forEach((v, i) => {
    if (v.value === value) {
      AuthCodeStore.splice(i, 1);
    }
  });
  saveChage(fileName, AuthCodeStore);
};
