import { json, redirect } from '@remix-run/node';
import { AuthorizationError } from 'remix-auth';
import { $path } from 'remix-routes';
import invariant from 'tiny-invariant';
import { authenticator } from '~/auth.server';
import { type UserType } from '~/features/user/types';
import { exceptionableResponseWrapper } from '~/utils.server';

export const loginedCheck = async (request: Request, userType: UserType) => {
  const user = await authenticator.isAuthenticated(request);
  if (user != null) {
    // TODO.同ブラウザで複数種類のログインができるのは仕様か要確認
    invariant(user.type == userType, 'user type incorrect.');
    return redirect($path(`/${user.type}/home`));
  }

  return json({});
};

export const login = async (request: Request, type: UserType) =>
  exceptionableResponseWrapper(
    () =>
      authenticator.authenticate('user-pass', request, {
        successRedirect: $path(`/${type}/home`),
        throwOnError: true,
        context: { type },
      }),
    {
      instance: AuthorizationError,
      data: { error: 'login failed.' },
      message: 'ユーザIDかパスワードが異なります。',
    },
  )(request);
