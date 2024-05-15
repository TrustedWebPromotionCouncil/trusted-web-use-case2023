import { KYB } from '@/types';
import { atomWithStorage } from 'jotai/utils';

export const kybState = atomWithStorage<KYB>('kybState', {
  type: 'kyb',
  corpName: '',
  corpNumber: 0,
  establishDate: 0,
  president: '',
  prefectuer: '',
  city: '',
  address: '',
  building: '',
});
