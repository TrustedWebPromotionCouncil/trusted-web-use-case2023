import * as functions from 'firebase-functions';
import * as logger from 'firebase-functions/logger';
import { findAuthSession, deleteAuthSession } from './datastore/AuthSession';
import { findUser } from './datastore/UserStore';
import { createAuthCode } from './datastore/AuthCodeStore';
import { format } from './utils/format';
import { savePKCE } from './datastore/PKCEStore';

const errorMsg = 'error={0}&error_description={1}';

export const decision = functions
  .region('asia-northeast1')
  .https.onRequest((request, response) => {
    response.set('Access-Control-Allow-Origin', '*');
    logger.log('method:', request.method);
    if (request.method !== 'POST') {
      response.status(400).send('error=The medhod should be POST');
      return;
    }

    try {
      const bodyJson = JSON.parse(request.body);
      const session = findAuthSession(bodyJson.sessionId);
      deleteAuthSession(bodyJson.sessionId);
      logger.log('session:', JSON.stringify(session));
      if (!session) {
        response
          .status(400)
          .send(format(errorMsg, 'access_denied', 'illegal session'));
        return;
      }
      const location = `${session.redirectUri}?state=${session.state}`;
      const user = findUser(bodyJson.loginId, bodyJson.password);
      logger.log('user:', JSON.stringify(user));
      if (!user) {
        response.redirect(
          `${location}&${format(
            errorMsg,
            'access_denied',
            'End-user authentication-faild'
          )}`
        );
        return;
      }
      const authCode = createAuthCode(user.userId, session);

      logger.log('authCode:', JSON.stringify(authCode));

      savePKCE({
        authCode: authCode.value,
        codeChallenge: session.codeChallenge,
        codeChallengeMethod: session.codeChallengeMethod,
      });
      response.send(`${location}&code=${authCode.value}`);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      response.status(400).send(`error=${e.message}`);
    }
  });
