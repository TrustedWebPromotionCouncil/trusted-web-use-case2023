import './globals.css';
import type { Metadata } from 'next';
import favicon from './favicon.ico';

export const metadata: Metadata = {
  title: 'Threshold ECDSA Signature Demo',
  description: 'Threshold ECDSA Signature Demo',
  icons: [{ rel: 'icon', url: favicon.src }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-white w-screen">{children}</body>
    </html>
  );
}
