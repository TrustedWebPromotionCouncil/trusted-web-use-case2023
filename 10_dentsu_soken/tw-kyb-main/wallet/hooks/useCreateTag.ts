import { useState } from 'react';
import { useRecoilValue } from 'recoil';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { db } from '@/firebaseConfig';
import { RootStackParamList } from '@/types';
import { userState } from '@/states';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'CreateTag'>;
};

export const useCreateTag = ({ navigation }: Props) => {
  const user = useRecoilValue(userState);
  const [name, setName] = useState('');
  const [createErr, setCreateErr] = useState('');

  const createTag = async () => {
    if (name !== '') {
      setCreateErr('');
      try {
        await addDoc(collection(db, 'users', user.uid, 'tags'), {
          name,
          createdAt: serverTimestamp(),
        });
        setName('');
        navigation.goBack();
      } catch (err: any) {
        setName('');
        setCreateErr(err.message);
      }
    }
  };
  return {
    name,
    setName,
    createErr,
    createTag,
  };
};
