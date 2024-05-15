import { Box, ChakraProvider, Text } from '@chakra-ui/react';
import { cssBundleHref } from '@remix-run/css-bundle';
import { json, type LinksFunction, type LoaderArgs } from '@remix-run/node';
import {
  isRouteErrorResponse,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useRouteError,
} from '@remix-run/react';
import Toaster from './components/Toaster';
import { errorMessage } from './errors';
import { getFlashMessage } from './session.server';
import { theme } from './styles';

export const links: LinksFunction = () => [
  { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
  { rel: 'preconnect', href: 'https://fonts.gstatic.com' },
  {
    rel: 'stylesheet',
    href: 'https://fonts.googleapis.com/css2?family=Noto+Sans+JP&family=Poppins:wght@400;700&display=swap',
  },
  ...(cssBundleHref ?
    [
      { rel: 'stylesheet', href: cssBundleHref },
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      { rel: 'preconnect', href: 'https://fonts.gstatic.com' },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Noto+Sans+JP&family=Poppins:wght@400;700&display=swap',
      },
    ] :
    []),
];

export const loader = async ({ request }: LoaderArgs) => {
  const { flash, headers } = await getFlashMessage(request);

  return json({ flash, version: process.env['GIT_COMMIT_SHORT_HASH'] }, headers);
};

type DocumentProps = {
  children: React.ReactNode;
};

const Document = ({ children }: DocumentProps) => (
  <html lang="ja">
    <head>
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width,initial-scale=1" />
      <Meta />
      <Links />
    </head>
    <body>
      {children}
      <ScrollRestoration />
      <Scripts />
      <LiveReload />
    </body>
  </html>
);

export const ErrorBoundary = () => {
  const error = useRouteError();

  return (
    <Document>
      <ChakraProvider theme={theme}>
        <Box p={8}>
          <Text fontWeight="bold" fontSize="4xl">
            {isRouteErrorResponse(error) && (
              `${error.status} ${error.statusText}`
            )}
            {error instanceof Error && errorMessage(error)}
          </Text>
        </Box>
      </ChakraProvider>
    </Document>
  );
};

const App = () => (
  <Document>
    <ChakraProvider theme={theme}>
      <Outlet />
      <Toaster />
    </ChakraProvider>
  </Document>
);

export default App;
