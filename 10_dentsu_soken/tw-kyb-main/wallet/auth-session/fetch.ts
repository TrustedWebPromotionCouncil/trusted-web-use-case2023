import qs from 'qs';

export type Headers = Record<string, string> & {
  'Content-Type': string;
  Authorization?: string;
  Accept?: string;
};

export type FetchRequest = {
  method: 'GET' | 'POST';
  dataType: 'json' | 'form' | 'query';
  headers?: Headers;
  body?: Record<string, string> | string;
};

export const fetchAsync = async <T>(
  requestUrl: string,
  fetchRequest: FetchRequest,
): Promise<T> => {
  if (fetchRequest.method === 'GET') {
    if (fetchRequest.dataType !== 'query') {
      throw new Error(`When the method is GET, the dataType must be query`);
    }
  } else {
    if (fetchRequest.dataType === 'query') {
      throw new Error(
        `When the method is POST, the dataType must be either json or form`,
      );
    }
  }

  const url = new URL(requestUrl);

  const request: Omit<RequestInit, 'headers'> & { headers: HeadersInit } = {
    method: fetchRequest.method,
    mode: 'cors',
    headers: {},
  };

  if (fetchRequest.headers) {
    for (const i in fetchRequest.headers) {
      (request.headers as Headers)[i] = fetchRequest.headers[i] as string;
    }
  }

  if (!('Content-Type' in request.headers)) {
    if (fetchRequest.dataType === 'json') {
      (request.headers as Headers)['Content-Type'] = 'application/json';
    } else if (fetchRequest.dataType === 'form') {
      (request.headers as Headers)['Content-Type'] =
        'application/x-www-form-urlencoded';
    }
  }

  if (fetchRequest.dataType === 'json' && !('Accept' in request.headers)) {
    (request.headers as Headers)['Accept'] =
      'application/json, text/javascript; q=0.01';
  }

  if (fetchRequest.body) {
    if (typeof fetchRequest.body === 'string') {
      if (fetchRequest.dataType === 'json') {
        request.body = fetchRequest.body;
      } else {
        throw new Error('When body is string, the dataType must be json');
      }
    } else {
      if (fetchRequest.dataType === 'form') {
        request.body = qs.stringify(fetchRequest.body);
      } else {
        for (const key of Object.keys(fetchRequest.body)) {
          url.searchParams.append(key, fetchRequest.body[key]);
        }
      }
    }
  }

  // Fix a problem with React Native `URL` causing a trailing slash to be added.
  const correctedUrl = url.toString().replace(/\/$/, '');

  const response = await fetch(correctedUrl, request);

  const contentType = response.headers.get('content-type');

  if (contentType?.includes('application/json')) {
    return response.json();
  }
  // @ts-ignore: Type 'string' is not assignable to type 'T'.
  return response.text();
};
