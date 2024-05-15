import { PersonalAccount } from '@/types';
import { atomWithStorage } from 'jotai/utils';

export const personalAccountAtom = atomWithStorage<PersonalAccount>(
  'personalAccount',
  {
    id: '',
    firstName: '',
    lastName: '',
  }
);
