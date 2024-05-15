import { atom } from 'recoil';

import { EditedTask, SelectedTag, User } from '@/types';

export const editedTaskState = atom<EditedTask>({
  key: 'editedTask',
  default: {
    id: '',
    title: '',
  },
});

export const selectedTagState = atom<SelectedTag>({
  key: 'selectedTag',
  default: {
    id: '',
    name: '',
  },
});

export const userState = atom<User>({
  key: 'user',
  default: {
    uid: '',
    email: '',
  },
});
