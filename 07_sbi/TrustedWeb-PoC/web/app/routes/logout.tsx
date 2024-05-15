import { type ActionArgs } from '@remix-run/node';
import { logout } from '~/auth.server';

export const action = ({ request }: ActionArgs) => logout(request);
