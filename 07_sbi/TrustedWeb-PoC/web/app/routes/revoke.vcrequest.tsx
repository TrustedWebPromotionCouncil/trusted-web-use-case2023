import { type ActionArgs } from '@remix-run/node';
import { createVcRequest } from '~/features/revoke/services.server';
import { actionAuthGuard } from '~/requests.server';

export const action = (args: ActionArgs) => actionAuthGuard(args, 'revoke', createVcRequest);
