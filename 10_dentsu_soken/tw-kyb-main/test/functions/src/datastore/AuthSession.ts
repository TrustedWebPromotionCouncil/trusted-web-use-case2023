import { AuthSession } from './type';
import { getRandomValue } from '../utils/random';
import { load, saveChage } from '.';

const fileName = 'AuthSession.db';

const getData = (): AuthSession[] => {
  const prev = load(fileName);
  return prev ? (prev as AuthSession[]) : [];
};

export const createAuthSession = (
  args: { sessionId?: string } & AuthSession
) => {
  const AuthSessionStore: AuthSession[] = getData();
  const session: AuthSession = {
    ...args,
    sessionId: getRandomValue(),
  };
  AuthSessionStore.push(session);
  saveChage(fileName, AuthSessionStore);
  return session;
};

export const findAuthSession = (sessionId: string) => {
  const AuthSessionStore: AuthSession[] = getData();
  return AuthSessionStore.find((v) => v.sessionId === sessionId);
};

export const deleteAuthSession = (sessionId: string) => {
  const AuthSessionStore: AuthSession[] = getData();
  AuthSessionStore.forEach((v, i) => {
    if (v.sessionId === sessionId) {
      AuthSessionStore.splice(i, 1);
    }
  });
  saveChage(fileName, AuthSessionStore);
};
