import { useMatches } from '@remix-run/react';
import { useMemo } from 'react';
import { type User, type UserType } from './types';

export const useUser = <TUserType extends UserType>(type: TUserType) => {
  const matchingRoutes = useMatches();
  const userData = useMemo(() => matchingRoutes.find((route) => route.id === `routes/${type}`), [matchingRoutes, type]);

  if (userData == null) {
    throw new Error('No user found in root loader, but user is required by useUser.');
  }

  return userData.data as User<TUserType>;
};
