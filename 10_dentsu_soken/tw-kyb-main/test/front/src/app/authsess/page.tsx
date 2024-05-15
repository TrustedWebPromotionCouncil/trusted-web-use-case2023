'use client';

import { useSearchParams } from 'next/navigation';

export default function Pagesess() {
  const searchParams = useSearchParams();
  const redirectUri = searchParams.get('redirect_uri');
  const onClick = () => redirectUri && window.location.replace(redirectUri);

  return (
    <main>
      <div>
        <p className="text-3xl font-bold text-blue-500 text-center">
          Auth Session {searchParams.get('redirect_uri')}
        </p>
        <div className="flex justify-center">
          <button
            onClick={onClick}
            className="text-white bg-blue-500 p-2 inline-block rounded-lg"
          >
            Redirect
          </button>
        </div>
      </div>
    </main>
  );
}
