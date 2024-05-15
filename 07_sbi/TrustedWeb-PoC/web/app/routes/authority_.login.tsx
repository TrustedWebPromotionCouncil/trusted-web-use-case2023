import { type ActionArgs, type LoaderArgs, type V2_MetaFunction } from '@remix-run/node';
import LoginForm from '~/features/login/components/LoginForm';
import { login, loginedCheck } from '~/features/login/services.server';

export const meta: V2_MetaFunction = () => [{ title: 'Authority Login' }];
export const loader = ({ request }: LoaderArgs) => loginedCheck(request, 'authority');
export const action = ({ request }: ActionArgs) => login(request, 'authority');

const AuthorityLogin = () => <LoginForm type="Authority" />;

export default AuthorityLogin;
