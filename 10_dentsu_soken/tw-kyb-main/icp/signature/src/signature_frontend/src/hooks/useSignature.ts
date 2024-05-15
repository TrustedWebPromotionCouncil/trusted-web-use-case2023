import { useEffect, useState, ChangeEventHandler } from 'react';
import sha256 from 'fast-sha256';
import { ecdsaVerify } from 'secp256k1';
import { signatureBackend } from '@/canisters';

import { isOk } from '@/utils/variantUtils';
import { auth } from '@/firebaseConfig';
import * as u8a from 'uint8arrays';

// const BACKEND_URL = 'https://bf3rp-yyaaa-aaaag-achoq-cai.raw.icp0.io';

// const parseIdToken = (idToken: string) => {
//   console.log('IdToken:', idToken);
//   const [headerBase64, bodyBase64, signature] = idToken.split('.');
//   const headerStr = u8a.toString(
//     u8a.fromString(headerBase64, 'base64url'),
//     'utf8'
//   );
//   const bodyStr = u8a.toString(u8a.fromString(bodyBase64, 'base64url'), 'utf8');
//   const header = JSON.parse(headerStr);
//   const body = JSON.parse(bodyStr);

//   console.log('Header:', header);
//   console.log('Body:', body);
// };

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
          //parseIdToken(idToken);

          const req_body = { token: idToken };
          console.log(req_body);
          const res = await signatureBackend.public_key(req_body);
          if (isOk(res)) {
            const pub_key = u8a.fromString(res.Ok.pub_key, 'base64url');
            console.log('publicKey:', pub_key);
            setPublickey(pub_key);
          } else {
            setError(res.Err.toString());
          }

          // {
          //   const res2 = await fetch(`${BACKEND_URL}/public_key`, {
          //     method: 'POST',
          //     body: JSON.stringify(req_body),
          //   });
          //   const res2_json = await res2.json();
          //   if (res2_json.error) {
          //     console.error(res2_json.error);
          //   } else {
          //     const pub_key = u8a.fromString(res2_json.pub_key, 'base64url');
          //     console.log('fetch publicKey:', pub_key);
          //   }
          // }
        }
      } catch (e: any) {
        setError(e.message);
      } finally {
        setPublickeyQuering(false);
      }
    };
    f();
  }, []);

  const onMessageChange: ChangeEventHandler<HTMLTextAreaElement> = (e) => {
    const v = e.target.value;
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

          const req_body = {
            token: idToken,
            message_hash: u8a.toString(hash, 'base64url'),
          };
          console.log(req_body);
          const res = await signatureBackend.sign(req_body);
          if (isOk(res)) {
            const signature = u8a.fromString(res.Ok.signature, 'base64url');
            console.log('signature:', signature);
            setSignature(signature);
          } else {
            setError(res.Err.toString());
          }

          // {
          //   const res2 = await fetch(`${BACKEND_URL}/sign`, {
          //     method: 'POST',
          //     body: JSON.stringify(req_body),
          //   });
          //   const res2_json = await res2.json();
          //   if (res2_json.error) {
          //     console.error(res2_json.error);
          //   } else {
          //     const signature = u8a.fromString(
          //       res2_json.signature,
          //       'base64url'
          //     );
          //     console.log('fetch signature:', signature);
          //   }
          // }
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
