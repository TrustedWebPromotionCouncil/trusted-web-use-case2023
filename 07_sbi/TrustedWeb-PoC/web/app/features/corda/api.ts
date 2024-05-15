import invariant from 'tiny-invariant';
import { makeAxios } from '~/axiosConfig.server';
import { type UserType } from '~/features/user/types';
import { createApiClient } from './apiSchema';

const MOCK_UPSTREAM_URL_BASE = process.env['MOCK_UPSTREAM_URL_BASE'];
const BRP_DEV_UPSTREAM_URL_BASE = process.env['BRP_DEV_UPSTREAM_URL_BASE'];
const BRP_UAT_UPSTREAM_URL_BASE = process.env['BRP_UAT_UPSTREAM_URL_BASE'];
const isUseMock = !!process.env['USE_CORDA_MOCK'];
const isUseCordaDev = !!process.env['USE_CORDA_DEV'];
const isUseCordaUat = !!process.env['USE_CORDA_UAT'];

const axiosInstance = makeAxios();

type CordaUserType = Exclude<UserType, 'business'>;

const getBrpUpstreamPort = (type: CordaUserType) => {
  switch (type) {
    case 'authority':
      return '8088';
    case 'public':
      return '8085';
    case 'revoke':
      return '8086';
    default:
      invariant(false, 'user type invalid.');
  }
};

export const getUpstreamUrlBase = (type: CordaUserType) => {
  if (isUseMock) {
    if (MOCK_UPSTREAM_URL_BASE) {
      return MOCK_UPSTREAM_URL_BASE;
    } else {
      throw new Error('MOCK_UPSTREAM_URL_BASE is not defined');
    }
  }
  const port = getBrpUpstreamPort(type);
  if (isUseCordaDev) {
    if (BRP_DEV_UPSTREAM_URL_BASE) {
      return `${BRP_DEV_UPSTREAM_URL_BASE}:${port}/brp`;
    } else {
      throw new Error('BRP_DEV_UPSTREAM_URL_BASE is not defined');
    }
  }
  if (isUseCordaUat) {
    if (BRP_UAT_UPSTREAM_URL_BASE) {
      return `${BRP_UAT_UPSTREAM_URL_BASE}:${port}/brp`;
    } else {
      throw new Error('BRP_UAT_UPSTREAM_URL_BASE is not defined');
    }
  }
  return `http://localhost:${port}/brp`;
};

type CordaccessibleUser = {
  corda_upstream_url: string;
};

export const cordaApiClient = ({ corda_upstream_url }: CordaccessibleUser) =>
  createApiClient(corda_upstream_url, { axiosInstance: axiosInstance });
