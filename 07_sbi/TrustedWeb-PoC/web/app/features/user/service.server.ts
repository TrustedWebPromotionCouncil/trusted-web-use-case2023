import { json } from '@remix-run/node';
import { $path } from 'remix-routes';
import { authenticator, logout } from '~/auth.server';
import { notFound } from '~/requests.server';
import { getUserData } from './repositories.server';
import { type UserData, type UserType } from './types';

export const userDataLoader = async <TUserType extends UserType>(request: Request, userType: TUserType) => {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: $path(`/${userType as UserType}/login`),
  });
  if (user.type !== userType) throw notFound();

  const userData = await getUserData(user.id, user.type) as UserData<TUserType>;
  if (userData == null) return logout(request);

  return json(userData);
};

export const getAuthenticatedUserData = async <TUserType extends UserType>(request: Request, userType: TUserType) => {
  const user = await authenticator.isAuthenticated(request);
  if (user == null || user.type !== userType) throw notFound();

  const userData = await getUserData(user.id, user.type);
  if (userData == null) throw notFound();

  return userData as UserData<TUserType>;
};
