import { useState, useEffect } from 'react';
import {
  //signInWithPopup,
  signOut,
  GoogleAuthProvider,
  User,
  onAuthStateChanged,
  signInWithPopup,
} from 'firebase/auth';
import { auth } from '@/firebaseConfig';

export const googleProvider = new GoogleAuthProvider();

auth.languageCode = 'ja';

export const useFirebaseAuth = () => {
  const [authErr, setAuthErr] = useState('');
  const [user, setUser] = useState<User | null>();
  //const [idToken, setIdToken] = useState<string | null>();

  const login = async () => {
    try {
      setAuthErr('');
      await signInWithPopup(auth, googleProvider);
    } catch (err: any) {
      setAuthErr(err.message);
    }
  };

  const logout = async () => {
    try {
      setAuthErr('');
      await signOut(auth);
    } catch (err: any) {
      setAuthErr(err.message);
    }
  };

  useEffect(() => {
    const unregister = onAuthStateChanged(auth, (user) => {
      setUser(user);
      // if (auth.currentUser) {
      //   auth.currentUser.getIdToken(true).then((idToken) => {
      //     setIdToken(idToken);
      //     console.log('IdToken:', idToken);
      //   });
      // }
    });
    return unregister;
  });

  return {
    authErr,
    login,
    logout,
    user,
  };
};
