/* eslint-disable max-len */
import * as functions from 'firebase-functions';
import * as logger from 'firebase-functions/logger';

const json = {
  keys: [
    {
      use: 'sig',
      n: 'jCEKJtbQ3_FUk2gPX0w53VOQqXiu4uor6B0nssKwE-QPbZobp1c4jct6U4E3jAZshwIbiBSWq0Ob_4OmXv-nbAZSy9-LJjuCKeo6KVCpLmm2UMHZHkRCkC_AZUI7OzTbCEzmXtrYQ79-JTXZtuq5_N6SnQe5FYlzeTRdrcV8FS5VBje4JjoEOye9OvcQjE48cjuL-n0nhoqOpsEnuJDdA2UJhLKF565cItdpf8f113SsdDv6ixEgnnmeqluuNjvjlWb64pGHh6gIJ7gBIflo9qX8VKNsBpR07aGzaGFsm8hZ2OUsPc-BN_kILAdRNxwWJNKm2DHSMP_2X-R4yx7flw',
      kty: 'RSA',
      e: 'AQAB',
      alg: 'RS256',
      kid: '0d0e86bd64740cad2475628da2ec496df52adb5d',
    },
    {
      kty: 'RSA',
      n: 'rbzOJNizQZ6raMKcivjW4s7741-bh27mkkrSTRh5oTNHhRRp2a7MQU5FmXrQITC04E-ENdsxyP6JjwpMOn62qXbvorxBKhlERqay-JSQAElAJoyJMUdbz0fS_yt-hHfan1gnWNK3LqtAbE3lVzauY8VeiuUi9yGw9j6q_iInWgsmZTGFYsIgGf_Ct_gCkua1C-J6ad54-Xc-JWnj60tI0GCKmW-5icasXJ6xO4V1rc5P-A_8_cWvIWOhrIWHAi0MlzKcblLkS0AxgkRwRdOS51QjFETe99dBe-wt8gu1UwftHbfNYXEiwZunXOJxDCWGVgrX0nk45pxH1JZOqfjFgw',
      e: 'AQAB',
      kid: 'd49e47fbdd4ee2414796d8e08cef6b55d0704e4d',
      alg: 'RS256',
      use: 'sig',
    },
  ],
};

export const jsonGet = functions
  .region('asia-northeast1')
  .https.onRequest((request, response) => {
    logger.log('method:', request.method);
    if (request.method !== 'GET') {
      response.status(400).json({ error: 'The medhod should be GET' });
      return;
    }

    try {
      response.status(200).json(json);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      response.status(400).json({ message: e.message });
    }
  });
