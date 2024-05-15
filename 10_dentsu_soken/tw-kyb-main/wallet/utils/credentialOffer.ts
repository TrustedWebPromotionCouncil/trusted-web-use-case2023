import { CredentialOffer } from '@/types/oid4vci';
import qs from 'qs';

export const parseCredentialOffer = async (
  uri: string,
): Promise<CredentialOffer> => {
  const offer = JSON.parse(
    qs.parse(uri.split('://?')[1]).credential_offer as string,
  );

  if (Object.hasOwn(offer, 'grants')) {
    return offer as CredentialOffer;
  } else if (Object.hasOwn(offer, 'credential_offer_uri')) {
    const response = await fetch(offer.credential_offer_uri as string);
    return (await response.json()) as CredentialOffer;
  } else {
    throw new Error('invalid offer');
  }
};
