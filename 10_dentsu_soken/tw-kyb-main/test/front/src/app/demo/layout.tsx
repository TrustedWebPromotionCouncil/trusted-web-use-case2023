'use client';
import { useLoading } from '@/hooks/useLoading';
import { Freeze } from 'react-freeze';

export const Loading = () => {
  return (
    <div className="relative w-screen h-screen bg-white">
      <div className="absolute inset-1/2 -translate-x-1/2 -translate-y-1/2 w-fit h-fit">
        <div className="w-32 h-32 border-8 border-t-demo-blue rounded-full animate-spin"></div>
      </div>
    </div>
  );
};

export default function DemoRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isloading } = useLoading();
  return (
    <Freeze freeze={isloading.state === 'loading'} placeholder={<Loading />}>
      {children}
    </Freeze>
  );
}
