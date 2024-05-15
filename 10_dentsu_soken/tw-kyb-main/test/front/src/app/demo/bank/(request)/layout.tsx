'use client';

import BankHeader from '@/components/demo/BankHeader';
import FootNavigation from '@/components/demo/FootNavigation';
import Header from '@/components/demo/Header';
import { useFirebaseAuth } from '@/hooks/useFirebaseAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <BankHeader />
      <main>{children}</main>
    </>
  );
}
