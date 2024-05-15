import { useState } from 'react';
import { useRecoilValue, useRecoilState } from 'recoil';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { db } from '@/firebaseConfig';
import { RootStackParamList } from '@/types';
import { userState, selectedTagState, editedTaskState } from '@/states';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'CreateTask'>;
};

export const useCreateTask = ({ navigation }: Props) => {
  const user = useRecoilValue(userState);
  const tag = useRecoilValue(selectedTagState);
  const [editedTask, setEditedTask] = useRecoilState(editedTaskState);
  const [createErr, setCreateErr] = useState('');
  const resetInput = () => {
    setEditedTask({ id: '', title: '' });
  };
  const onChangeTask = (txt: string) =>
    setEditedTask({ ...editedTask, title: txt });

  const createTask = async () => {
    setCreateErr('');
    if (editedTask?.title !== '') {
      try {
        await addDoc(
          collection(db, 'users', user.uid, 'tags', tag.id, 'tasks'),
          {
            title: editedTask.title,
            completed: false,
            createdAt: serverTimestamp(),
          },
        );
        setEditedTask({ id: '', title: '' });
        navigation.goBack();
      } catch (err: any) {
        setEditedTask({ id: '', title: '' });
        setCreateErr(err.message);
      }
    }
  };
  return {
    onChangeTask,
    editedTask,
    createErr,
    createTask,
    resetInput,
  };
};
