export interface Crypto {
  getRandomBytes(size: number): Uint8Array;
  sha256Async(code: string): Promise<string>;
}
