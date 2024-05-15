import { type ActionArgs } from '@remix-run/node';
import { revokeVc } from '~/features/authority/service.server';
import { actionAuthGuard } from '~/requests.server';

export const action = (args: ActionArgs) => actionAuthGuard(args, 'authority', revokeVc);
