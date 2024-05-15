'use client';

import { useSearchParams } from 'next/navigation';
import { useState } from 'react';

const endpointUri =
  'https://tw-isid-test.web.app/tw-isid-test/asia-northeast1/decision';

export default function Pagesess() {
  const searchParams = useSearchParams();
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const onClick = async () => {
    const ret = await fetch(endpointUri, {
      method: 'POST',
      body: JSON.stringify({
        loginId,
        password,
        sessionId: searchParams.get('sessionId'),
      }),
    });
    if (!ret.ok) {
      const error = await ret.text();
      setError(error);
    }
    const location = await ret.text();
    console.log('location :>> ', location);
    location && window.location.replace(location);
  };

  if (error) {
    return (
      <main className="my-8 mx-4">
        <p>{error}</p>
      </main>
    );
  }

  return (
    <main className="my-8 mx-4">
      <h1>Authorization Page</h1>
      <div className="flex flex-col items-center justify-center gap-4 my-4 w-full px-4">
        <div className="flex w-full justify-between">
          <label htmlFor="loginId">User ID:</label>
          <input
            type="text"
            name="loginId"
            id="loginId"
            className="w-60 outline"
            value={loginId}
            autoCapitalize="off"
            onChange={(e) => setLoginId(e.currentTarget.value)}
          />
        </div>
        <div className="flex  w-full justify-between">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            name="password"
            id="password"
            className="w-60 outline"
            autoCapitalize="off"
            value={password}
            onChange={(e) => setPassword(e.currentTarget.value)}
          />
        </div>
        <div className="flex justify-center">
          <button
            onClick={onClick}
            className="text-white bg-blue-500 p-2 inline-block rounded-lg"
          >
            Submit
          </button>
        </div>
      </div>
    </main>
  );
}
