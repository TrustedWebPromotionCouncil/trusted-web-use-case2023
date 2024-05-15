import * as u8a from 'uint8arrays';

const BACKEND_URL = 'https://bf3rp-yyaaa-aaaag-achoq-cai.raw.icp0.io';

export const getPubKey = async (idToken: string) => {
  const req_body = { token: idToken };
  console.log(req_body);

  const res = await fetch(`${BACKEND_URL}/public_key`, {
    method: 'POST',
    body: JSON.stringify(req_body),
  });
  const res_json = await res.json();
  if (res_json.error) {
    console.error(res_json.error);
    throw new Error(res_json.error);
  } else {
    const pub_key = u8a.fromString(res_json.pub_key, 'base64url');
    console.log('fetch publicKey:', pub_key);
    return pub_key;
  }
};

export const sign = async (idToken: string, hash: Uint8Array) => {
  const req_body = {
    token: idToken,
    message_hash: u8a.toString(hash, 'base64url'),
  };
  console.log(req_body);

  const res = await fetch(`${BACKEND_URL}/sign`, {
    method: 'POST',
    body: JSON.stringify(req_body),
  });
  const res_json = await res.json();
  if (res_json.error) {
    console.error(res_json.error);
    throw new Error(res_json.error);
  } else {
    const signature = u8a.fromString(res_json.signature, 'base64url');
    console.log('fetch signature:', signature);
    return signature;
  }
};
