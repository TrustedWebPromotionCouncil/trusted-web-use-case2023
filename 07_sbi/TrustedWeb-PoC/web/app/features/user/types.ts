import { type SerializeFrom } from '@remix-run/node';
import { type ReturnGetUserData } from './repositories.server';

export type UserType = 'authority' | 'business' | 'public' | 'revoke';
export type UserData<TUserType extends UserType> = NonNullable<Awaited<ReturnGetUserData[TUserType]>>;
export type User<TUserType extends UserType> = SerializeFrom<NonNullable<Awaited<ReturnGetUserData[TUserType]>>>;
export type AuthrityUser = UserData<'authority'>;
export type BusinessUser = UserData<'business'>;
export type PublicUser = UserData<'public'>;
export type RevokeUser = UserData<'revoke'>;
