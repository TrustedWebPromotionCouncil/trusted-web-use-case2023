import * as functions from 'firebase-functions';
import * as logger from 'firebase-functions/logger';

export const hello = functions
  .region('asia-northeast1')
  .https.onRequest((request, response) => {
    logger.info('Hello logs!', { structuredData: true });
    response.send(`Hello ${request.query.name}`);
  });
