import { Nonce } from './type';
import { load, saveChage } from '.';
import { getRandomValue } from '../utils/random';

const NonceDuration = 86400;
const fileName = 'Nonce.db';

const getData = (): Nonce[] => {
  const prev = load(fileName);
  return prev ? (prev as Nonce[]) : [];
};

export const createNonce = (accessToken: string) => {
  const NonceStore: Nonce[] = getData();
  const nonce: Nonce = {
    accessToken,
    cNonce: getRandomValue(),
    cNonceExpiresIn: NonceDuration,
  };
  NonceStore.push(nonce);
  saveChage(fileName, NonceStore);
  return nonce;
};

export const findNonce = (accessToken: string) => {
  const NonceStore: Nonce[] = getData();
  return NonceStore.find((v) => v.accessToken === accessToken);
};

export const deleteNonce = (accessToken: string) => {
  const NonceStore: Nonce[] = getData();
  NonceStore.forEach((v, i) => {
    if (v.accessToken === accessToken) {
      NonceStore.splice(i, 1);
    }
  });
  saveChage(fileName, NonceStore);
};
