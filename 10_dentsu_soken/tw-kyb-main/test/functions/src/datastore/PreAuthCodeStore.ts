import { PreAuthCode } from './type';
import { getPinValue, getRandomValue } from '../utils/random';
import { load, saveChage } from '.';

const fileName = 'PreAuthCode.db';

const getData = (): PreAuthCode[] => {
  const prev = load(fileName);
  return prev ? (prev as PreAuthCode[]) : [];
};

export const createPreAuthCode = (pinRequired: boolean, pinLen: string) => {
  const PreAuthCodeStore = getData();
  const preAuthCode: string = getRandomValue();
  PreAuthCodeStore.push({
    preAuthCode,
    userPin: pinRequired ? getPinValue(Number(pinLen)) : '',
  });
  saveChage(fileName, PreAuthCodeStore);
  return preAuthCode;
};

export const findPreAuthCode = (
  preAuthCode: string,
  pinRequired: boolean,
  userPin: string
) => {
  const PreAuthCodeStore: PreAuthCode[] = getData();
  if (pinRequired) {
    return PreAuthCodeStore.find(
      (v) => v.preAuthCode === preAuthCode && v.userPin === userPin
    );
  }
  return PreAuthCodeStore.find((v) => v.preAuthCode === preAuthCode);
};

export const deletePreAuthCode = (preAuthCode: string) => {
  const PreAuthCodeStore: PreAuthCode[] = getData();
  PreAuthCodeStore.forEach((v, i) => {
    if (v.preAuthCode === preAuthCode) {
      PreAuthCodeStore.splice(i, 1);
    }
  });
  saveChage(fileName, PreAuthCodeStore);
};
