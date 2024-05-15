import { Crypto } from './crypto';

const CHARSET =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

export const convertBytesToString = (bytes: Uint8Array): string => {
  const state: string[] = [];
  for (let i = 0; i < bytes.byteLength; i += 1) {
    const index = bytes[i] % CHARSET.length;
    state.push(CHARSET[index]);
  }
  return state.join('');
};

export const generateRandom = (size: number, crypto: Crypto): string => {
  const bytes = crypto.getRandomBytes(size);

  return convertBytesToString(bytes);
};
