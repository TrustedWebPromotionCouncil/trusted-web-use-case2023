import { createActor } from '@/canisters/actorUtils';

import { _SERVICE as SIGNATURE_BACKEND_SERVICE } from '../../../declarations/signature_backend/signature_backend.did';

export const signatureBackendCanisterId = (process.env
  .NEXT_PUBLIC_SIGNATURE_BACKEND_CANISTER_ID ||
  process.env.SIGNATURE_BACKEND_CANISTER_ID) as string;
//const signatureBackendCanisterId = 'bf3rp-yyaaa-aaaag-achoq-cai';
const signatureBackendIdlFactory =
  require('../../../declarations/signature_backend/signature_backend.did.js').idlFactory;

//console.log('signatureBackendCanisterId:', signatureBackendCanisterId);
export const signatureBackend = createActor<SIGNATURE_BACKEND_SERVICE>(
  signatureBackendCanisterId,
  signatureBackendIdlFactory
);
