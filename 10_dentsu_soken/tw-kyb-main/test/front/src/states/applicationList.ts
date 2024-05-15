import { COE, KYB, KYC, Bank } from '@/types';
import { atomWithStorage } from 'jotai/utils';

type Application = {
  id: string;
  status: boolean;
  content: KYC | KYB | COE | Bank;
  issuer: string;
};

export const applicationState = atomWithStorage<Array<Application>>(
  'applicationState',
  []
);
