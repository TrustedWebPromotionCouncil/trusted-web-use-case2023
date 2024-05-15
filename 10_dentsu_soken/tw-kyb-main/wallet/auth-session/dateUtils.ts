import { getCurrentTimeInSeconds } from '@/utils/now';
export { getCurrentTimeInSeconds } from '@/utils/now';

const SKEW_TIME = 60 * 5;

export const validIssuedAt = (
  issuedAt: number,
  skewTime = SKEW_TIME,
): boolean => {
  return issuedAt <= getCurrentTimeInSeconds() + skewTime;
};

export const validExpiresIn = (
  issuedAt: number,
  expiresIn?: number,
  skewTime = SKEW_TIME,
): boolean => {
  if (!expiresIn) {
    return true;
  }
  return getCurrentTimeInSeconds() + skewTime <= issuedAt + expiresIn;
};
