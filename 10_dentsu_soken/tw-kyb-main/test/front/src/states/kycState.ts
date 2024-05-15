import { KYC } from '@/types';
import { atomWithStorage } from 'jotai/utils';

export const kycState = atomWithStorage<KYC>('kycState', {
  type: 'kyc',
  firstName: '',
  lastName: '',
  firstName_kana: '',
  lastName_kana: '',
  birthday: 0,
  gender: 'female',
  prefectuer: '',
  city: '',
  address: '',
  building: '',
});
