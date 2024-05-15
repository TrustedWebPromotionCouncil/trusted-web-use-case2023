'use client';

import { useFirebaseAuth } from '@/hooks/useFirebaseAuth';
import { Signature } from '@/components/Signature';
import { FirebaseAuth } from '@/components/FirebaseAuth';

export default function Home() {
  const { user } = useFirebaseAuth();

  return (
    <main className="flex min-h-screen flex-col items-center p-2">
      <div className="flex flex-col items-start w-96">
        <h1 className="text-xl pb-4">Threshold ECDSA Signature Demo</h1>
        <FirebaseAuth />
        {user && <Signature />}
      </div>
    </main>
  );
}
