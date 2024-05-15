import { addYears, differenceInSeconds } from 'date-fns';

export const defaultPeriod = (now = new Date()) => {
  const defaultEnd = addYears(now, 10);
  return differenceInSeconds(defaultEnd, now);
};

export const makeDID = (name: string) => `did:detc:${name}`;
export const makeVcId = (sequence: number) => `vc${('00000' + sequence).slice(-5)}`;
