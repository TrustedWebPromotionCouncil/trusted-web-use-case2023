import { Authenticator } from 'remix-auth';
import { FormStrategy } from 'remix-auth-form';
import { $path } from 'remix-routes';
import invariant from 'tiny-invariant';
import { z } from 'zod';
import { sessionStorage } from '~/session.server';
import { LoginFormValidator } from './features/login/validators';
import { getLoginUser, getUserData } from './features/user/repositories.server';
import { type UserType } from './features/user/types';

type User = {
  id: number;
  type: UserType;
};

const userTypeContextSchema = z.object({ type: z.enum(['authority', 'business', 'public', 'revoke']) });

export const authenticator = new Authenticator<User>(sessionStorage);

authenticator.use(
  new FormStrategy(async ({ form, context }) => {
    const formData = await LoginFormValidator.validate(form);
    invariant(formData.error == null, JSON.stringify(formData.error?.fieldErrors));

    const userTypeContext = userTypeContextSchema.safeParse(context);
    invariant(userTypeContext.success, 'user context invalid.');

    const { id, password } = formData.data;
    const user = await getLoginUser(id, userTypeContext.data.type);

    invariant(user, 'user not found.');
    // TODO.パスワードのhash化
    invariant(user.password === password, 'password mismatch.');

    return { id: user.id, type: userTypeContext.data.type };
  }),
  'user-pass',
);

export const requireUser = async (request: Request, userType: UserType) => {
  const user = await authenticator.isAuthenticated(request, { failureRedirect: $path(`/${userType}/login`) });
  if (user.type !== userType) throw new Response('Not Found', { status: 404, statusText: 'Not Found' });

  const userData = await getUserData(user.id, user.type);
  if (userData == null) throw await logout(request);

  return userData;
};

export const logout = (request: Request) => authenticator.logout(request, { redirectTo: '/' });
