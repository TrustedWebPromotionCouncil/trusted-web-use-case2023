import { User } from './type';
import { getRandomValue } from '../utils/random';

export const UserStore: User[] = [
  { userId: getRandomValue(), loginId: 'john', password: 'john' },
];

export const findUser = (loginId: string, password: string) => {
  return UserStore.find(
    (v) => v.loginId === loginId && v.password === password
  );
};
