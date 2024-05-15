import { useState } from 'react';
import { useRecoilValue, useRecoilState } from 'recoil';
import { setDoc, doc } from 'firebase/firestore';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/types';
import { db } from '@/firebaseConfig';
import { userState, selectedTagState, editedTaskState } from '@/states';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'EditTask'>;
};

export const useEditTask = ({ navigation }: Props) => {
  const user = useRecoilValue(userState);
  const tag = useRecoilValue(selectedTagState);
  const [editedTask, setEditedTask] = useRecoilState(editedTaskState);
  const [updateErr, setUpdateErr] = useState('');

  const resetInput = () => {
    setEditedTask({ id: '', title: '' });
  };
  const onChangeTask = (txt: string) =>
    setEditedTask({ ...editedTask, title: txt });

  const updateTask = async () => {
    setUpdateErr('');
    if (editedTask?.title !== '' && editedTask?.id !== '') {
      try {
        await setDoc(
          doc(db, 'users', user.uid, 'tags', tag.id, 'tasks', editedTask.id),
          {
            title: editedTask.title,
          },
          { merge: true },
        );
        setEditedTask({ id: '', title: '' });
        navigation.goBack();
      } catch (err: any) {
        setEditedTask({ id: '', title: '' });
        setUpdateErr(err.message);
      }
    }
  };
  return {
    onChangeTask,
    editedTask,
    updateErr,
    updateTask,
    resetInput,
  };
};
