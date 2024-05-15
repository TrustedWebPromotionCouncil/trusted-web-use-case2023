import { AccessToken } from './type';
import { getRandomValue } from '../utils/random';
import { load, saveChage } from '.';

const AccessTokenDuration = 86400;
const fileName = 'AccessToken.db';

const getData = (): AccessToken[] => {
  const prev = load(fileName);
  return prev ? (prev as AccessToken[]) : [];
};

export const createAccessToken = (args: {
  clientId: string;
  userId?: string;
  authorizationDetails?: string;
}) => {
  const AccessTokenStore: AccessToken[] = getData();
  const accessToken: AccessToken = {
    value: getRandomValue(),
    clientId: args.clientId,
    userId: args.userId,
    authorizationDetails: args.authorizationDetails,
    expiresIn: AccessTokenDuration,
  };
  AccessTokenStore.push(accessToken);
  saveChage(fileName, AccessTokenStore);
  return { accessToken, issuedAt: Date.now() };
};

export const findAccessToken = (value: string) => {
  const AccessTokenStore: AccessToken[] = getData();
  return AccessTokenStore.find((v) => v.value === value);
};

export const deleteAccessToken = (value: string) => {
  const AccessTokenStore: AccessToken[] = getData();
  AccessTokenStore.forEach((v, i) => {
    if (v.value === value) {
      AccessTokenStore.splice(i, 1);
    }
  });
  saveChage(fileName, AccessTokenStore);
};
