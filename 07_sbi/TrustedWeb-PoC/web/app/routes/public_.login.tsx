import { type ActionArgs, type LoaderArgs, type V2_MetaFunction } from '@remix-run/node';
import LoginForm from '~/features/login/components/LoginForm';
import { login, loginedCheck } from '~/features/login/services.server';

export const meta: V2_MetaFunction = () => [{ title: 'Public Login' }];
export const loader = ({ request }: LoaderArgs) => loginedCheck(request, 'public');
export const action = ({ request }: ActionArgs) => login(request, 'public');

const PublicLogin = () => <LoginForm type="Public" />;

export default PublicLogin;
