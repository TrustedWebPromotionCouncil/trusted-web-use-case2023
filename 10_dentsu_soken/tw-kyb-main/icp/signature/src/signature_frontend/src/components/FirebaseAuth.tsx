'use client';

import { useFirebaseAuth } from '@/hooks/useFirebaseAuth';
import { buttonStyles } from '@/styles';

export const FirebaseAuth = () => {
  const { authErr, login, logout, user } = useFirebaseAuth();

  return (
    <div>
      {user ? (
        <div>
          <div>Name: {user?.displayName}</div>
          <div className="mb-1">Email: {user?.email}</div>
          <button className={buttonStyles} onClick={() => logout()}>
            Log Out
          </button>
        </div>
      ) : (
        <button className={buttonStyles} onClick={() => login()}>
          Log In
        </button>
      )}
      {authErr && <div className="py-1 text-red-500 text-xl">{authErr}</div>}
    </div>
  );
};
