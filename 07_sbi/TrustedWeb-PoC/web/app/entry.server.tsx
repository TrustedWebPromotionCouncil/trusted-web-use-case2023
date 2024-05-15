import createEmotionCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import createEmotionServer from '@emotion/server/create-instance';
import { type AppLoadContext, type EntryContext, Response } from '@remix-run/node';
import { RemixServer } from '@remix-run/react';
import isbot from 'isbot';
import { PassThrough } from 'node:stream';
import { renderToPipeableStream } from 'react-dom/server';

const ABORT_DELAY = 5_000;

const handleRequest = (
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext,
  loadContext: AppLoadContext,
) => {
  const callbackName = isbot(request.headers.get('user-agent')) ?
    'onAllReady' :
    'onShellReady';

  return new Promise((resolve, reject) => {
    let shellRendered = false;
    const emotionCache = createEmotionCache({ key: 'css' });

    const { pipe, abort } = renderToPipeableStream(
      <CacheProvider value={emotionCache}>
        <RemixServer
          context={remixContext}
          url={request.url}
          abortDelay={ABORT_DELAY}
        />
      </CacheProvider>,
      {
        [callbackName]() {
          shellRendered = true;
          const body = new PassThrough();
          const { renderStylesToNodeStream } = createEmotionServer(emotionCache);
          const bodyWithStyles = renderStylesToNodeStream();
          body.pipe(bodyWithStyles);

          responseHeaders.set('Content-Type', 'text/html');

          resolve(
            new Response(bodyWithStyles, { headers: responseHeaders, status: responseStatusCode }),
          );

          pipe(body);
        },
        onShellError(error: unknown) {
          reject(error);
        },
        onError(error: unknown) {
          responseStatusCode = 500;
          // Log streaming rendering errors from inside the shell.  Don't log
          // errors encountered during initial shell rendering since they'll
          // reject and get logged in handleDocumentRequest.
          if (shellRendered) {
            console.error(error);
          }
        },
      },
    );

    setTimeout(abort, ABORT_DELAY);
  });
};

export default handleRequest;
