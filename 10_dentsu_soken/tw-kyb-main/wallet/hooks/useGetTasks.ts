import { useState, useEffect } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { collection, query, onSnapshot, orderBy } from 'firebase/firestore';
import { format } from 'date-fns';
import { db } from '@/firebaseConfig';
import { userState, selectedTagState, editedTaskState } from '@/states';
import { Task } from '@/types';

export const useGetTasks = () => {
  const user = useRecoilValue(userState);
  const tag = useRecoilValue(selectedTagState);
  const setEditedTask = useSetRecoilState(editedTaskState);
  const [tasks, setTasks] = useState<Task[]>();
  const [getErr, setGetErr] = useState('');

  useEffect(() => {
    const q = query(
      collection(db, 'users', user.uid, 'tags', tag.id, 'tasks'),
      orderBy('createdAt', 'desc'),
    );
    const unsub = onSnapshot(
      q,
      (snapshot) => {
        setTasks(
          snapshot.docs.map(
            (doc) =>
              ({
                id: doc.id,
                title: doc.data().title,
                completed: doc.data().completed,
                createdAt: format(
                  doc.data({ serverTimestamps: 'estimate' }).createdAt.toDate(),
                  'yyyy-MM-dd HH:mm',
                ),
              } as Task),
          ),
        );
      },
      (err: any) => {
        setGetErr(err.message);
      },
    );
    return () => {
      unsub();
      setEditedTask({ id: '', title: '' });
    };
  }, []);
  return {
    tasks,
    getErr,
  };
};
