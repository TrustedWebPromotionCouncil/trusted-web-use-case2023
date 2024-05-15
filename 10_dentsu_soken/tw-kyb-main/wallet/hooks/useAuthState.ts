import { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/firebaseConfig';
import { userState } from '@/states';

export const useAuthState = () => {
  const [user, setUser] = useRecoilState(userState);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (authUser) => {
      setIsLoading(true);
      if (authUser) {
        setUser({
          uid: authUser.uid,
          email: authUser.email!,
        });
      } else {
        setUser({
          uid: '',
          email: '',
        });
      }
      setIsLoading(false);
    });
    return () => {
      unsub();
    };
  }, []);
  return {
    user,
    isLoading,
  };
};
