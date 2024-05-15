import { CredentialResponse } from '@/oid4vci/types';

export type CredentialOffer = {
  credential_issuer: string;
  credential_configuration_ids: string[];
  grants: {
    authorization_code?: {
      issuer_state?: string;
      authorization_server?: string;
    };
    'urn:ietf:params:oauth:grant-type:pre-authorized_code'?: {
      'pre-authorized_code': string;
      tx_code?: {
        input_mode?: string;
        length?: number;
        description?: string;
      };
      // If no value is provided, Wallets MUST use 5 as the default.
      interval?: number;
      authorization_server?: string;
    };
  };
};

export type CredentialOfferUri = {
  credential_offer_uri: string;
};

export type CredentialOfferListItem = {
  id: string;
  credentialOffer: CredentialOffer;
  acceptDate: number;
  issueState: boolean;
};

export type CredentialListItem = {
  id: string;
  credentialResponse: CredentialResponse;
  // issueState: boolean;
};

export type CredentialOfferList = CredentialOfferListItem[];

export type CredentialList = CredentialListItem[];
