import * as functions from 'firebase-functions';
import * as logger from 'firebase-functions/logger';

export const addJson = functions
  .region('asia-northeast1')
  .https.onRequest((request, response) => {
    logger.log('method:', request.method);
    if (request.method !== 'POST') {
      response.status(400).json({ error: 'The medhod should be POST' });
      return;
    }

    logger.log('body:', request.body);
    if (!request.body || !(request.body.arg1 && request.body.arg2)) {
      response.status(400).json({ error: 'Illegal body' });
      return;
    }

    try {
      const arg1 = Number(request.body.arg1);
      const arg2 = Number(request.body.arg2);
      response.status(200).json({ result: arg1 + arg2 });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      response.status(400).json({ message: e.message });
    }
  });
