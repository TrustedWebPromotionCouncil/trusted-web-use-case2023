import { atom } from 'recoil';
import { CredentialList, CredentialOfferList } from '@/types/oid4vci';

export const CredentialOfferListState = atom<CredentialOfferList>({
  key: 'credentialOffer',
  default: [],
});

export const CredentialListState = atom<CredentialList>({
  key: 'credential',
  default: [],
});
