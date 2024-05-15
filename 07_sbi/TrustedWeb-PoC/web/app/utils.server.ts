import { type ActionArgs, type ActionFunction, json, type LoaderFunction } from '@remix-run/node';
import { type UserData, type UserType } from '~/features/user/types';
import { setFlashMessage } from './session.server';

type ErrorInfo<TErrorData> =
  & {
    status?: number;
    data: TErrorData;
    message: string;
  }
  & ({
    instance: any;
    condition?: never;
  } | {
    instance?: never;
    condition: (error: unknown) => boolean;
  } | {
    instance?: never;
    condition?: never;
  });

const returnErrorJson = async <TErrorData>(
  error: unknown,
  request: Request,
  { instance, condition, status, data, message }: ErrorInfo<TErrorData>,
) => {
  // redirectはResponseを投げるため
  if (error instanceof Response) throw error;

  console.log({ error });

  if (
    (instance == null && condition == null) ||
    (instance != null && error instanceof instance) ||
    (condition != null && condition(error))
  ) {
    return json(data, {
      status,
      ...await setFlashMessage(request, { message, status: 'error' }),
    });
  }

  throw error;
};

export const exceptionableResponseWrapper = <
  TResponse extends ReturnType<ActionFunction | LoaderFunction>,
  TErrorData,
>(
  action: () => TResponse,
  errorInfo: ErrorInfo<TErrorData>,
) =>
async (request: Request) => {
  try {
    return await action();
  } catch (error) {
    return returnErrorJson(error, request, errorInfo);
  }
};

export const exceptionableResponseWrapperWithUser = <
  TResponse extends ReturnType<ActionFunction | LoaderFunction>,
  TUserData extends UserData<UserType>,
  TErrorData,
>(
  action: (user: TUserData) => TResponse,
  errorInfo: ErrorInfo<TErrorData>,
) =>
async ({ request }: ActionArgs, user: TUserData) => {
  try {
    return await action(user);
  } catch (error) {
    return await returnErrorJson(error, request, errorInfo);
  }
};
