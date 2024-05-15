'use client';

import { useSearchParams } from 'next/navigation';
import { useState } from 'react';

export default function Pagesess() {
  const searchParams = useSearchParams();
  const redirectUri = searchParams.get('redirect_uri');
  const [uri, setUri] = useState('');
  const [authCodeGrant, setAuthCodeGrant] = useState(true);
  const [issuerState, setIssuerState] = useState(true);
  const [preAuthCodeGrant, setPreAuthCodeGrant] = useState(false);
  const [pinReq, setPinReq] = useState(false);
  const [pinLen, setPinLen] = useState('0');
  const [credentials, setcredentials] = useState(
    JSON.stringify(
      [
        {
          format: 'vc+sd-jwt',
          credential_definition: { type: 'IdentityCredential' },
        },
      ],
      null,
      2
    )
  );
  const [endpoint, setEndpoint] = useState(
    `${redirectUri ? redirectUri : 'openid-credential-offer'}`
  );

  const onClick = () => {
    window.location.replace(uri);
  };

  const onSubmit = async () => {
    const ret = await fetch(
      'https://tw-isid-test.web.app/tw-isid-test/asia-northeast1/credentialOfferIssue',
      {
        method: 'POST',
        body: JSON.stringify({
          authCodeGrant,
          issuerState,
          preAuthCodeGrant,
          pinReq,
          pinLen,
          credentials,
          endpoint,
        }),
      }
    );
    const text = await ret.text();
    if (ret.ok) {
      setUri(text);
    }
  };

  return (
    <main>
      <div>
        <p className="text-3xl font-bold text-blue-500 text-center">
          Credentail Offer
        </p>

        <div className="flex flex-col my-4 gap-2 items-center justify-center">
          {!uri && (
            <>
              <div className="flex gap-4">
                <label htmlFor="authCodeGrant">Authorization code grant</label>
                <input
                  type="checkbox"
                  name="authCodeGrant"
                  id="authCodeGrant"
                  className="scale-150"
                  checked={authCodeGrant}
                  onChange={() => setAuthCodeGrant((prev) => !prev)}
                />
              </div>
              <div className="flex gap-4">
                <label htmlFor="issuerState">issuer state</label>
                <input
                  type="checkbox"
                  name="issuerState"
                  id="issuerState"
                  className="scale-150"
                  checked={issuerState}
                  onChange={() => setIssuerState((prev) => !prev)}
                />
              </div>
              <div className="flex gap-4">
                <label htmlFor="preAuthCodeGrant">
                  Pre-authorization code grant
                </label>
                <input
                  type="checkbox"
                  name="preAuthCodeGrant"
                  id="preAuthCodeGrant"
                  className="scale-150"
                  checked={preAuthCodeGrant}
                  onChange={() => setPreAuthCodeGrant((prev) => !prev)}
                />
              </div>
              <div className="flex gap-4">
                <label htmlFor="pinReq">User pin required</label>
                <input
                  type="checkbox"
                  name="pinReq"
                  id="pinReq"
                  className="scale-150"
                  checked={pinReq}
                  onChange={() => setPinReq((prev) => !prev)}
                />
              </div>
              <div className="flex gap-4">
                <label htmlFor="pinLen">User pin length</label>
                <input
                  type="number"
                  name="pinLen"
                  id="pinLen"
                  className="w-10 outline"
                  value={pinLen}
                  onChange={(e) => setPinLen(e.currentTarget.value)}
                />
              </div>
              <div className="flex gap-4">
                <label htmlFor="pinLen">credentials</label>
                <textarea
                  name="credentials"
                  id="credentials"
                  cols={30}
                  rows={10}
                  value={credentials}
                  className="outline"
                  onChange={(e) => setcredentials(e.currentTarget.value)}
                ></textarea>
              </div>
              <div className="flex gap-4">
                <label htmlFor="endpoint">Credential Offer Endpoint</label>
                <input
                  type="text"
                  name="endpoint"
                  id="endpoint"
                  className="w-60 outline"
                  value={endpoint}
                  onChange={(e) => setEndpoint(e.currentTarget.value)}
                />
              </div>
              <button
                onClick={onSubmit}
                className="text-white bg-blue-500 p-2 inline-block rounded-lg"
              >
                Submit
              </button>
            </>
          )}
          {uri && (
            <>
              <p className="text-sm font-bold text-blue-500 text-center">
                Redirect URL {uri}
              </p>
              <div className="flex justify-center">
                <button
                  onClick={onClick}
                  className="text-white bg-blue-500 p-2 inline-block rounded-lg"
                >
                  Redirect
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
