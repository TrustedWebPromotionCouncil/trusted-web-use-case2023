import { defer } from '@remix-run/node';
import { getAuthenticatedUserData } from '~/features/user/service.server';
import { type UserData, type UserType } from '~/features/user/types';

export const getCordaLoader = <TUserType extends UserType, TLoaderData extends Record<string, unknown>>(
  userType: TUserType,
  loader: (user: UserData<TUserType>) => TLoaderData,
) =>
async (request: Request) => {
  const user = await getAuthenticatedUserData(request, userType);
  return defer(loader(user));
};
