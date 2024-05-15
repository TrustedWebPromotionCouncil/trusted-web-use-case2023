export const uint8ArrayToHex = (uint8Array: Uint8Array): string => {
  return Buffer.from(uint8Array).toString('hex');
};
