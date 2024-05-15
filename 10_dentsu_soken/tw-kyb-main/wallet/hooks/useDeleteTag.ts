import { useState } from 'react';
import { doc, deleteDoc } from 'firebase/firestore';
import { useRecoilValue } from 'recoil';
import { db } from '@/firebaseConfig';
import { userState } from '@/states';

export const useDeleteTag = () => {
  const user = useRecoilValue(userState);
  const [deleteErr, setDeleteErr] = useState('');
  const deleteTag = async (idx: string) => {
    setDeleteErr('');
    try {
      await deleteDoc(doc(db, 'users', user.uid, 'tags', idx));
    } catch (err: any) {
      setDeleteErr(err.message);
    }
  };
  return {
    deleteTag,
    deleteErr,
  };
};
