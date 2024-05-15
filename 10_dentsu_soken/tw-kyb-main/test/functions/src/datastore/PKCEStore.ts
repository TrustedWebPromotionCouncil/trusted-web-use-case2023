import { PKCE } from './type';
import { load, saveChage } from '.';

const fileName = 'PKCE.db';

const getData = (): PKCE[] => {
  const prev = load(fileName);
  return prev ? (prev as PKCE[]) : [];
};

export const savePKCE = (args: PKCE) => {
  const PKCEStore: PKCE[] = getData();
  PKCEStore.push(args);
  saveChage(fileName, PKCEStore);
};

export const findPKCE = (authCode: string) => {
  const PKCEStore: PKCE[] = getData();
  return PKCEStore.find((v) => v.authCode === authCode);
};

export const deletePKCE = (authCode: string) => {
  const PKCEStore: PKCE[] = getData();
  PKCEStore.forEach((v, i) => {
    if (v.authCode === authCode) {
      PKCEStore.splice(i, 1);
    }
  });
  saveChage(fileName, PKCEStore);
};
