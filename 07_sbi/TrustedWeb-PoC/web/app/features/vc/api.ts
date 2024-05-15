import { makeAxios } from '~/axiosConfig.server';

const VC_API_UPSTREAM_URL_BASE = process.env['VC_API_URL'];

export const vcAxios = makeAxios(VC_API_UPSTREAM_URL_BASE);
