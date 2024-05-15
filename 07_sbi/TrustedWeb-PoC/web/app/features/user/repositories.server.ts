import invariant from 'tiny-invariant';
import { dbRead } from '~/db/db.server';
import { type UserType } from './types';

export const getLoginUser = (name: string, type: UserType) =>
  dbRead
    .selectFrom(`${type}_user`)
    .select(['id', 'password'])
    .where('name', '=', name)
    .executeTakeFirst();

const getAuthrityUserData = (id: number) =>
  dbRead
    .selectFrom('authority_user')
    .innerJoin('authority', 'authority.id', 'authority_user.authority')
    .select([
      'authority_user.name',
      (qb) => qb.ref('authority.id').as('authority_id'),
      (qb) => qb.ref('authority.name').as('authority_name'),
      'corda_upstream_url',
      'display_org_name',
    ])
    .where('authority_user.id', '=', id)
    .executeTakeFirst();

const getBusinessUserData = (id: number) =>
  dbRead
    .selectFrom('business_user')
    .innerJoin('business', 'business.id', 'business_user.business')
    .innerJoin('legal_entity', 'business.legal_entity_id', 'legal_entity.id')
    .select([
      'business_user.name',
      (qb) => qb.ref('business.id').as('business_id'),
      (qb) => qb.ref('business.name').as('business_name'),
      (qb) => qb.ref('legal_entity.name').as('legal_entity_name'),
      (qb) => qb.ref('legal_entity.number').as('legal_entity_number'),
      (qb) => qb.ref('legal_entity.location').as('legal_entity_location'),
    ])
    .where('business_user.id', '=', id)
    .executeTakeFirst();

const getPublicUserData = (id: number) =>
  dbRead
    .selectFrom('public_user')
    .innerJoin('public', 'public.id', 'public_user.public')
    .select([
      'public_user.name',
      (qb) => qb.ref('public.id').as('public_id'),
      (qb) => qb.ref('public.name').as('public_name'),
      'corda_upstream_url',
      'display_org_name',
    ])
    .where('public_user.id', '=', id)
    .executeTakeFirst();

const getRevokeUserData = (id: number) =>
  dbRead
    .selectFrom('revoke_user')
    .innerJoin('revoke', 'revoke.id', 'revoke_user.revoke')
    .select([
      'revoke_user.name',
      (qb) => qb.ref('revoke.id').as('revoke_id'),
      (qb) => qb.ref('revoke.name').as('revoke_name'),
      'corda_upstream_url',
      'display_org_name',
    ])
    .where('revoke_user.id', '=', id)
    .executeTakeFirst();

export type ReturnGetUserData = {
  authority: ReturnType<typeof getAuthrityUserData>;
  business: ReturnType<typeof getBusinessUserData>;
  public: ReturnType<typeof getPublicUserData>;
  revoke: ReturnType<typeof getRevokeUserData>;
};

export const getUserData = <TUserType extends UserType>(id: number, type: TUserType) => {
  switch (type) {
    case 'authority':
      return getAuthrityUserData(id) as ReturnGetUserData[TUserType];
    case 'business':
      return getBusinessUserData(id) as ReturnGetUserData[TUserType];
    case 'public':
      return getPublicUserData(id) as ReturnGetUserData[TUserType];
    case 'revoke':
      return getRevokeUserData(id) as ReturnGetUserData[TUserType];
    default:
      invariant(false, 'user type incorrect');
  }
};
