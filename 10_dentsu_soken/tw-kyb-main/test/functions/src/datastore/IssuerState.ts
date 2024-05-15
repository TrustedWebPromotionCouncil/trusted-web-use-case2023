import { load, saveChage } from '.';
import { getRandomValue } from '../utils/random';

const fileName = 'IssuerState.db';

const getData = (): string[] => {
  const prev = load(fileName);
  return prev ? (prev as string[]) : [];
};

export const createIssuerState = () => {
  const IssuerStateStore: string[] = getData();
  const issuerState = getRandomValue();
  IssuerStateStore.push(issuerState);
  saveChage(fileName, IssuerStateStore);
  return issuerState;
};

export const findIssuerState = (issuerState: string) => {
  const IssuerStateStore: string[] = getData();
  return IssuerStateStore.find((v) => v === issuerState);
};

export const deleteIssuerState = (issuerState: string) => {
  const IssuerStateStore: string[] = getData();
  IssuerStateStore.forEach((v, i) => {
    if (v === issuerState) {
      IssuerStateStore.splice(i, 1);
    }
  });
  saveChage(fileName, IssuerStateStore);
};
