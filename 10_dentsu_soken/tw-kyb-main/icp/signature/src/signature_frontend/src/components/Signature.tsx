'use client';

import { useSignature } from '@/hooks/useSignature';
import { uint8ArrayToHex } from '@/utils/hexUtils';
import { buttonStyles, textareaStyles } from '@/styles';

export const Signature = () => {
  const {
    publicKey,
    publicKeyQuering,
    hash,
    signature,
    signing,
    verifyMessage,
    onMessageChange,
    onSignClick,
    onVerifyClick,
    error,
  } = useSignature();
  return (
    <>
      <p className="pt-4 w-full">
        <label htmlFor="message">Message:</label>
        <br />
        <textarea
          id="message"
          className={textareaStyles}
          onChange={onMessageChange}
        ></textarea>
        <br />
        <label htmlFor="sha256">SHA256:</label>
        <br />
        <textarea
          rows={2}
          className={textareaStyles}
          readOnly={true}
          value={hash ? uint8ArrayToHex(hash) : ''}
        ></textarea>
        <br />
        <button id="sign" className={buttonStyles} onClick={onSignClick}>
          Sign
        </button>
        <span className="pl-2 text-blue-500">{signing && 'Signing...'}</span>
      </p>
      <p className="pt-10 w-full">
        <label htmlFor="public_key">Public Key:</label>
        <span className="pl-2 text-blue-500">
          {publicKeyQuering && 'Quering...'}
        </span>
        <br />
        <textarea
          rows={2}
          className={textareaStyles}
          readOnly={true}
          value={publicKey ? uint8ArrayToHex(publicKey) : ''}
        ></textarea>
        <br />
        <label htmlFor="signature">Signature:</label>
        <br />
        <textarea
          rows={4}
          className={textareaStyles}
          readOnly={true}
          value={signature ? uint8ArrayToHex(signature) : ''}
        ></textarea>
        <br />
        <button id="verify" className={buttonStyles} onClick={onVerifyClick}>
          Verify
        </button>
        <span className="pl-2">{verifyMessage}</span>
      </p>
      <p className="text-red-400">{error}</p>
    </>
  );
};
