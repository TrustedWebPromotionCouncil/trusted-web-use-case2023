import { COE } from '@/types';
import { atomWithStorage } from 'jotai/utils';

export const coeState = atomWithStorage<COE>('eocState', {
  type: 'coe',
  corpName: '',
  hireDate: 0,
  seviceYears: 0,
  firstName: '',
  lastName: '',
  gender: 'female',
  prefectuer: '',
  city: '',
  address: '',
  building: '',
});
