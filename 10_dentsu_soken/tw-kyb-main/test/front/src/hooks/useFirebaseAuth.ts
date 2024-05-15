import { useState, useEffect } from 'react';
import {
  signInWithPopup,
  signOut,
  GoogleAuthProvider,
  User,
  onAuthStateChanged,
} from 'firebase/auth';
import { auth } from '@/firebaseConfig';
import axios from 'axios';

export const googleProvider = new GoogleAuthProvider();

auth.languageCode = 'ja';

const parseIdToken = async (idToken: string) => {
  const [headerBase64, bodyBase64, signature] = idToken.split('.');
  const header = JSON.parse(Buffer.from(headerBase64, 'base64').toString());
  const body = JSON.parse(Buffer.from(bodyBase64, 'base64').toString());

  console.log(JSON.stringify(header, undefined, 2));
  console.log(JSON.stringify(body, undefined, 2));

  const kid = header.kid as string | undefined;
  const iss = (body.iss as string) || '';
  const suffix = `${
    iss.endsWith('/') ? '' : '/'
  }.well-known/openid-configuration`;
  const configurationUrl = `${iss}${suffix}`;
  console.log('configurationUrl:', configurationUrl);

  const response = await axios.get(configurationUrl);
  console.log(JSON.stringify(response, undefined, 2));
};

export const useFirebaseAuth = () => {
  const [authErr, setAuthErr] = useState('');
  const [user, setUser] = useState<User | null>(null);

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
      // parseIdToken(idToken);
      //console.log('IdToken:', idToken);
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
