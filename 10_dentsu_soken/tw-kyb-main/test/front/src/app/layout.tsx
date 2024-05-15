import './globals.css';
import type { Metadata } from 'next';
import { Noto_Sans_JP, Roboto } from 'next/font/google';
// import { useLoading } from '@/hooks/useLoading';
// import { Freeze } from 'react-freeze';

export const metadata: Metadata = {
  title: 'Test',
  description: 'Test',
};

const noto = Noto_Sans_JP({
  weight: ['400', '500', '700'],
  subsets: ['latin'],
  variable: '--font-noto',
});

const roboto = Roboto({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-roboto',
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // const { isloading } = useLoading();
  return (
    <html lang="jp">
      <body
        className={`bg-white ${noto.variable} ${roboto.variable} font-sans`}
      >
        {/* <Freeze
          freeze={isloading.state === 'loading'}
          placeholder={<p className="mt-4">ユーザデータ Loading...</p>}
        > */}
        {children}
        {/* </Freeze> */}
      </body>
    </html>
  );
}
