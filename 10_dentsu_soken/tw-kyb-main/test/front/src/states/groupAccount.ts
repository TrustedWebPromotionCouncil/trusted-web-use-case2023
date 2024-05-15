import { GroupAccount, RegisteredAccount } from '@/types';
import { atomWithStorage } from 'jotai/utils';
import { atom } from 'jotai';

// export const RegisteredAccountAtom = atomWithStorage<RegisteredAccount[]>(
//   'registeredAccount',
//   []
// );

export const groupAccountAtom = atomWithStorage<GroupAccount[]>(
  'groupAccount',
  []
);

// export const groupAccountAtom = atom(async (get) => {
//   return get(atomWithStorage<GroupAccount[]>('groupAccount', []));
// });
