import * as functions from 'firebase-functions';
import * as logger from 'firebase-functions/logger';

export const qsGet = functions
  .region('asia-northeast1')
  .https.onRequest((request, response) => {
    if (request.method !== 'GET') {
      response.status(400).send('error=The medhod should be GET');
      return;
    }

    logger.log('query:', request.query);
    if (!request.query || !(request.query.arg1 && request.query.arg2)) {
      response.status(400).send('error=Illegal body');
      return;
    }

    try {
      const { arg1, arg2 } = request.query;
      const result = encodeURIComponent('Result ' + arg1);
      const result2 = encodeURIComponent('Result2 ' + arg2);
      response.status(200).send(`result=${result}&result2=${result2}`);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      response.status(400).send(`error=${e.message}`);
    }
  });
