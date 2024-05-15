'use client';

import BankNavigationHeader from '@/components/demo/BankNavigationHeader';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <BankNavigationHeader />
      <main className="mt-[50px] lg:mt-[100px] pt-6">{children}</main>
    </>
  );
}
