import { type ApiOf, type ZodiosResponseByPath } from '@zodios/core';
import { makeAxios } from '~/axiosConfig.server';
import { createApiClient } from './apiSchema';

const axiosInstance = makeAxios();

export const apiClient = createApiClient(`${process.env['AUTHORITY_API_URL']}`, { axiosInstance });

type API = ApiOf<typeof apiClient>;
export type SignedVC = NonNullable<ZodiosResponseByPath<API, 'post', '/:authorityName/vc-requests'>['vc']>;
