import { useEffect, useState } from 'react';
import sha256 from 'fast-sha256';
import { ecdsaVerify } from 'secp256k1';
import { auth } from '@/firebaseConfig';
import { getPubKey, sign } from '@/icp/tECDSA';

export const useSignature = () => {
  const [publicKey, setPublickey] = useState<Uint8Array | undefined>();
  const [publicKeyQuering, setPublickeyQuering] = useState(false);
  const [_, setMessage] = useState<string | undefined>();
  const [hash, setHash] = useState<Uint8Array | undefined>();
  const [signature, setSignature] = useState<Uint8Array | undefined>();
  const [signing, setSigning] = useState(false);
  const [error, setError] = useState('');
  const [verifyMessage, setVerifyMessage] = useState('');

  useEffect(() => {
    const f = async () => {
      setError('');
      setPublickeyQuering(true);
      try {
        if (auth.currentUser) {
          const idToken = await auth.currentUser.getIdToken(true);

          setPublickey(await getPubKey(idToken));
        }
      } catch (e: any) {
        setError(e.message);
      } finally {
        setPublickeyQuering(false);
      }
    };
    f();
  }, []);

  const onMessageChange = (v: string) => {
    setMessage(v);

    if (v && v.length > 0) {
      setHash(sha256(new TextEncoder().encode(v)));
    } else {
      setHash(undefined);
    }
  };

  const onSignClick = async () => {
    if (hash) {
      setError('');
      setSigning(true);
      setSignature(undefined);
      try {
        if (auth.currentUser) {
          const idToken = await auth.currentUser.getIdToken(true);

          setSignature(await sign(idToken, hash));
        }
      } catch (e: any) {
        setError(e.message);
      } finally {
        setSigning(false);
      }
    }
  };

  const onVerifyClick = () => {
    setVerifyMessage('');
    if (!signature || !hash || !publicKey) {
      return;
    }

    if (ecdsaVerify(signature, hash, publicKey)) {
      setVerifyMessage('Signature is verified');
    } else {
      setVerifyMessage('Signature fails to verify');
    }
  };

  return {
    publicKey,
    publicKeyQuering,
    hash,
    signature,
    signing,
    error,
    verifyMessage,
    onMessageChange,
    onSignClick,
    onVerifyClick,
  };
};
