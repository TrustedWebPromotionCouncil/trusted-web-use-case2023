import { type UseToastOptions } from '@chakra-ui/react';
import { createCookieSessionStorage, type DataFunctionArgs, type Session } from '@remix-run/node';
import invariant from 'tiny-invariant';

invariant(process.env['SESSION_SECRET'], 'SESSION_SECRET must be set');

export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: '__session',
    sameSite: 'lax',
    path: '/',
    httpOnly: true,
    secrets: [process.env['SESSION_SECRET']],
    // secure: process.env.NODE_ENV === 'production',
    secure: false,
  },
});

export const getSession = async (request: Request) => {
  const cookie = request.headers.get('Cookie');
  return sessionStorage.getSession(cookie);
};

export type FlashOptions = {
  message: string;
  status: UseToastOptions['status'];
};

const setCookieCommitSessionHeaders = async (session: Session) => ({
  'Set-Cookie': await sessionStorage.commitSession(session),
});

export const setFlashMessage = async (
  request: DataFunctionArgs['request'],
  options: FlashOptions,
) => {
  const session = await getSession(request);
  session.flash('flash-message', options);
  return { headers: await setCookieCommitSessionHeaders(session) } as const;
};

export const getFlashMessage = async (request: DataFunctionArgs['request']) => {
  const session = await getSession(request);
  const flash = (session.get('flash-message') ?? null) as FlashOptions | null;
  return {
    flash,
    headers: { headers: await setCookieCommitSessionHeaders(session) },
  } as const;
};
