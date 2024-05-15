import { useFirebaseAuth } from '@/hooks/useFirebaseAuth';
import { useRouter } from 'next/navigation';
import React from 'react';
import { FcGoogle } from 'react-icons/fc';

// TODO 文言

export type LoginButtonProps = {
  type: 'google' | 'webAuth';
};

export type ButtonProps = {
  onClick: React.MouseEventHandler<HTMLButtonElement>;
};

const Google = ({ onClick }: ButtonProps) => {
  return (
    <button
      className="w-[292px] h-14 p-4 flex gap-6 items-center border rounded shadow active:translate-y-1 active:shadow-none"
      onClick={onClick}
    >
      <FcGoogle className="inline-block" size={24} />
      <span className="font-bold text-google-login">Sign in with Google</span>
    </button>
  );
};

const WebAuth = () => {
  return (
    <button className="w-[292px] h-14 border border-demo-blue text-demo-blue font-bold tracking-wide rounded-lg hover:bg-demo-blue hover:text-white active:opacity-70">
      Sign in with Web Authn
    </button>
  );
};

export default function LoginButton({ type }: LoginButtonProps) {
  const { login } = useFirebaseAuth();
  // const router = useRouter();

  return type === 'google' ? (
    <Google
      onClick={async () => {
        await login();
        // router.push('/demo/wallet/01_home');
      }}
    />
  ) : (
    <WebAuth />
  );
}
