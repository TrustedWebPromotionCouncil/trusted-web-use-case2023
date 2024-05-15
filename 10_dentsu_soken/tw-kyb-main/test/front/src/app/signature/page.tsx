'use client';

import { useEffect, useState } from 'react';
import { useFirebaseAuth } from '@/hooks/useFirebaseAuth';
import { auth } from '@/firebaseConfig';

type IdToken = {
  header: Record<string, any>;
  body: Record<string, any>;
};

const getCurrentTimeInSeconds = (): number => {
  return Math.floor(Date.now() / 1000);
};

const parseIdToken = async (idToken: string) => {
  const [headerBase64, bodyBase64, signature] = idToken.split('.');
  const header = JSON.parse(Buffer.from(headerBase64, 'base64').toString());
  const body = JSON.parse(Buffer.from(bodyBase64, 'base64').toString());

  const kid = header.kid as string | undefined;
  const iss = (body.iss as string) || '';
  const suffix = `${
    iss.endsWith('/') ? '' : '/'
  }.well-known/openid-configuration`;
  const configurationUrl = `${iss}${suffix}`;
  console.log('configurationUrl:', configurationUrl);

  // const request: Omit<RequestInit, 'headers'> & { headers: HeadersInit } = {
  //   method: 'GET',
  //   mode: 'cors',
  //   headers: {},
  // };

  // const configResponse = await (await fetch(configurationUrl, request)).json();
  // console.log('configResponse:', configResponse);
};

const Signature = () => {
  const { authErr, login, logout, user } = useFirebaseAuth();
  const [idToken, setIdToken] = useState<IdToken | undefined>(undefined);

  return (
    <div className="App">
      <h1>Firebase Authentication</h1>
      {authErr && <div className="py-1 text-red-500 text-xl">{authErr}</div>}
      {user ? (
        <div>
          <h3>Your Name: {user?.displayName}</h3>
          <h5>Email: {user?.email}</h5>
          <p>User ID: {user?.uid}</p>
          <button
            className="py-1 px-3 border-blue-300 rounded-md border-2"
            onClick={() => logout()}
          >
            Log Out
          </button>
        </div>
      ) : (
        <button
          className="py-1 px-3 border-blue-300 rounded-md border-2"
          onClick={() => login()}
        >
          Log In
        </button>
      )}
    </div>
  );
};

export default Signature;
