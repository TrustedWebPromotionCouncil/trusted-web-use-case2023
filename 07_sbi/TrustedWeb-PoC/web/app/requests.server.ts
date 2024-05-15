import { type ActionArgs, type ActionFunction, json } from '@remix-run/node';
import { validationError, type Validator, type ValidatorData } from 'remix-validated-form';
import { getAuthenticatedUserData } from './features/user/service.server';
import { type UserData, type UserType } from './features/user/types';
import { setFlashMessage } from './session.server';

export const notFound = () => new Response('Not Found', { status: 404, statusText: 'Not Found' });

export const actionAuthGuard = async <
  TUserType extends UserType,
  TFunction extends (args: ActionArgs, user: UserData<TUserType>) => ReturnType<ActionFunction>,
>(
  args: ActionArgs,
  userType: TUserType,
  func: TFunction,
) => {
  const user = await getAuthenticatedUserData(args.request, userType);
  // 明示的にキャストしないと Promise<any> 等に推論される
  return func(args, user) as ReturnType<TFunction>;
};

export const checkedFormData = <
  TUserData extends UserData<UserType>,
  TValidator extends Validator<any>,
  TResponse extends ReturnType<ActionFunction>,
>(
  validator: TValidator,
  func: (query: ValidatorData<TValidator>, user: TUserData) => TResponse,
) =>
async ({ request }: ActionArgs, user: TUserData) => {
  const formData = await validator.validate(await request.formData());
  if (formData.error) {
    console.log(formData.error.fieldErrors);
    return validationError(
      formData.error,
      undefined,
      formData.error.fieldErrors['toast'] != null ?
        await setFlashMessage(request, { message: formData.error.fieldErrors['toast'], status: 'error' }) :
        undefined,
    );
  }

  try {
    return await func(formData.data, user);
  } catch (error) {
    console.log(error);

    return json(
      { error: 'unknown error.' },
      await setFlashMessage(request, { message: 'unknown error.', status: 'error' }),
    );
  }
};

export const getResponseOrThrowWithCatchAction = async <TData>(
  request: () => Promise<TData>,
  catchAction: () => Promise<void> | void,
) => {
  try {
    return await request();
  } catch (error) {
    await catchAction();
    throw error;
  }
};
