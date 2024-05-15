import { v4 as uuidv4 } from 'uuid';

export const createUuidv4 = (): string => {
  return uuidv4();
};

export const getOrCreateUuidv4 = (value: string | null | undefined): string => {
  return value || createUuidv4();
};
