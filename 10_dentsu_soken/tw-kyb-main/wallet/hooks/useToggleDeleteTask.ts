import { useState, useCallback } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { setDoc, doc, deleteDoc } from 'firebase/firestore';
import { db } from '@/firebaseConfig';
import { userState, editedTaskState, selectedTagState } from '@/states';

export const useToggleDeleteTask = () => {
  const user = useRecoilValue(userState);
  const tag = useRecoilValue(selectedTagState);
  const setEditedTask = useSetRecoilState(editedTaskState);
  const [toggleErr, setToggleErr] = useState('');
  const [deleteErr, setDeleteErr] = useState('');

  const toggleCompleted = useCallback(
    async (idx: string, bool: boolean) => {
      setToggleErr('');
      try {
        await setDoc(
          doc(db, 'users', user.uid, 'tags', tag.id, 'tasks', idx),
          {
            completed: !bool,
          },
          { merge: true },
        );
        setEditedTask({ id: '', title: '' });
      } catch (err: any) {
        setEditedTask({ id: '', title: '' });
        setToggleErr(err.message);
      }
    },
    [user],
  );
  const deleteTask = useCallback(
    async (idx: string) => {
      setDeleteErr('');
      try {
        await deleteDoc(
          doc(db, 'users', user.uid, 'tags', tag.id, 'tasks', idx),
        );
        setEditedTask({ id: '', title: '' });
      } catch (err: any) {
        setEditedTask({ id: '', title: '' });
        setDeleteErr(err.message);
      }
    },
    [user],
  );
  return {
    tag,
    toggleErr,
    deleteErr,
    deleteTask,
    toggleCompleted,
  };
};
