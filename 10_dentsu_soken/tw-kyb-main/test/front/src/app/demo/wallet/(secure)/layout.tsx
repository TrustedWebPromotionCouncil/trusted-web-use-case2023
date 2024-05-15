'use client';

import FootNavigation from '@/components/demo/FootNavigation';
import Header from '@/components/demo/Header';
import { useFirebaseAuth } from '@/hooks/useFirebaseAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import {} from 'firebase/auth';
import { auth } from '@/firebaseConfig';
import { useLoading } from '@/hooks/useLoading';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useFirebaseAuth();
  const router = useRouter();

  useEffect(() => {
    // if (!user) {
    //   router.push('/demo/wallet/00_login');
    // }
  }, [user]);

  return (
    <>
      <Header
        id={user ? user.uid : ''}
        name={user?.displayName ? user.displayName : ''}
        isGroup={false}
      />
      <main>{children}</main>
      <FootNavigation />
    </>
  );
}
