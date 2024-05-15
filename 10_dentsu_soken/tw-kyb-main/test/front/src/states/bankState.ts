import { Bank } from '@/types';
import { atomWithStorage } from 'jotai/utils';

export const bankState = atomWithStorage<Bank>('bankState', {
  name: '',
  address: '',
  corpName: '',
  type: 'bank',
  accountType: '普通',
  cash: false,
  transfer: false,
  other: false,
});
