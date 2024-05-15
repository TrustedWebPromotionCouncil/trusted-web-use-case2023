import sha256 from 'fast-sha256';
import * as u8a from 'uint8arrays';
import { fetchIssuerMetadata } from '@/oid4vci/issuerMetadata';
import { buildHeaderAndPayload } from '@/oid4vci/keyProof';
import { fetchOpenidConfiguration } from '@/oid4vci/openidConfiguration';
import { fetch4PreAuthorizedCodeFlow } from '@/oid4vci/tokenEndpoint';
import { CredentialOfferListItem } from '@/types/oid4vci';
import { parseCredentialOffer } from '@/utils/credentialOffer';
import { BarCodeScannerResult } from 'expo-barcode-scanner';
import { useState } from 'react';
import { fetch4VcSdJwt } from '@/oid4vci/credentialEndpoint';
import { CredentialResponse } from '@/oid4vci/types';
import { es256k } from '@/jwt-alg';
import { getPubKey, sign } from '@/icp/tECDSA';
import { auth } from '@/firebaseConfig';
import { useRecoilState } from 'recoil';
import {
  CredentialListState,
  CredentialOfferListState,
} from '@/states/oid4vci';
import * as ExpoCrypto from 'expo-crypto';

const CLIENT_ID = process.env.EXPO_PUBLIC_CLIENT_ID || '';

export const useOID4VCI = () => {
  const [credentialOfferList, setCredentialOfferList] = useRecoilState(
    CredentialOfferListState,
  );
  const [credentialList, setCredentialList] =
    useRecoilState(CredentialListState);
  const [credentialResponse, setCredentailResponse] = useState<
    CredentialResponse | undefined
  >();
  const [err, setErr] = useState<string | undefined>();

  const findCredentialOffer = (id: string) => {
    return credentialOfferList.find((v) => v.id === id);
  };

  const findCredential = (id: string) => {
    return credentialList.find((v) => v.id === id);
  };

  const scanQr = async (result: BarCodeScannerResult) => {
    try {
      setErr(undefined);
      const offer = await parseCredentialOffer(result.data);
      console.log('credential offer :>> ', offer);
      const listItem: CredentialOfferListItem = {
        id: ExpoCrypto.randomUUID(),
        credentialOffer: offer,
        acceptDate: Date.now(),
        issueState: false,
      };
      setCredentialOfferList((prev) => [...prev, listItem]);
    } catch (error: any) {
      setErr(error.message);
    }
  };

  const getIdToken = async () => {
    if (!auth.currentUser) {
      throw new Error('you must login');
    }
    return await auth.currentUser.getIdToken(true);
  };

  const fetchVC = async (id: string) => {
    try {
      const credentialOffer = findCredentialOffer(id)?.credentialOffer;
      if (!credentialOffer) {
        throw new Error('Credential Offer is undefined');
      }
      const ISSUER = credentialOffer.credential_issuer;
      const config = await fetchOpenidConfiguration(ISSUER);
      const issuerMetadata = await fetchIssuerMetadata(ISSUER);
      const IdToken = await getIdToken();
      if (credentialOffer.grants.authorization_code) {
        // Authorizeation Code Flow
      } else if (
        credentialOffer.grants[
          'urn:ietf:params:oauth:grant-type:pre-authorized_code'
        ]
      ) {
        const PRE_AUTHORIZED_CODE =
          credentialOffer.grants[
            'urn:ietf:params:oauth:grant-type:pre-authorized_code'
          ]['pre-authorized_code'];
        const tokenResponse = await fetch4PreAuthorizedCodeFlow({
          tokenEndpoint: config.token_endpoint,
          clientId: CLIENT_ID,
          preAuthorizedCode: PRE_AUTHORIZED_CODE,
        });
        console.log('tokenResponse :>> ', tokenResponse);
      // const { privateKey, publicKey } = es256k.genKeyPair();
      const  publicKey = await getPubKey(IdToken);
      const headerAndPayloadBase64Url = buildHeaderAndPayload({
        alg: es256k,
        publicKey,
        issuer: ISSUER,
        clientId: CLIENT_ID,
        nonce: tokenResponse.c_nonce,
      });
      
      const msgHash = sha256(
        new TextEncoder().encode(headerAndPayloadBase64Url),
      );
        // const signature = es256k.sign({ privateKey, msgHash });
        const signature = await sign(IdToken,msgHash);
        const signatureBase64Url = u8a.toString(signature, 'base64url');
        const keyProofJwt = `${headerAndPayloadBase64Url}.${signatureBase64Url}`;
        const credentialConfigurationId = 'IdentityCredential';
        const vct = issuerMetadata.credential_configurations_supported[
          credentialConfigurationId
        ].vct as string;
        const credentialResponse = await fetch4VcSdJwt({
          credentialEndpoint: issuerMetadata.credential_endpoint,
          accessToken: tokenResponse.access_token,
          vct,
          keyProofJwt,
        });
        console.log('credential :>> ', credentialResponse.credential);
        setCredentailResponse(credentialResponse);
        updateList(id, credentialResponse);
      }
    } catch (error) {
      console.log('error :>> ', error);
    }
  };

  const updateList = (id: string, credentialResponse: CredentialResponse) => {
    const updatedOfferList = credentialOfferList.map((v) =>
      v.id === id ? { ...v, issueState: true } : v,
    );
    setCredentialOfferList(updatedOfferList);
    setCredentialList((prev) => [
      ...prev,
      {
        id,
        credentialResponse,
      },
    ]);
  };

  return {
    err,
    credentialList,
    credentialResponse,
    credentialOfferList,
    findCredentialOffer,
    findCredential,
    scanQr,
    fetchVC,
  };
};
