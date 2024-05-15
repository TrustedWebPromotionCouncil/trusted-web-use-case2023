import { describe, it, expect } from 'vitest';
import path from 'path';
import dotenv from 'dotenv';

import {
  fetchIssuerMetadata,
  getCredentialConfigurationIds,
} from './issuerMetadata';
import { IssuerMetadata } from './types';

dotenv.config({ path: path.resolve(process.cwd(), '.env.test') });

const ISSUER = process.env.ISSUER || '';
const RUN = process.env.RUN || '';

describe('issuerMetadata', () => {
  it.runIf(RUN == 'fetchIssuerMetadata')(
    'fetchIssuerMetadata',
    async () => {
      const meta = await fetchIssuerMetadata(ISSUER);
      //console.log(meta);
      expect(meta.credential_issuer).toEqual(ISSUER);
      expect(meta.credential_endpoint).toEqual(`${ISSUER}/api/credential`);
      expect(meta.batch_credential_endpoint).toEqual(
        `${ISSUER}/api/batch_credential`,
      );
      expect(meta.deferred_credential_endpoint).toEqual(
        `${ISSUER}/api/deferred_credential`,
      );

      const mDL =
        meta.credential_configurations_supported['org.iso.18013.5.1.mDL'];
      expect(mDL).toBeDefined();
      expect(mDL.format).toEqual('mso_mdoc');
      expect(mDL.scope).toEqual('org.iso.18013.5.1.mDL');

      const identityCredential =
        meta.credential_configurations_supported['IdentityCredential'];
      expect(identityCredential).toBeDefined();
      expect(identityCredential.format).toEqual('vc+sd-jwt');
      expect(identityCredential.scope).toEqual('identity_credential');
    },
    20000,
  );

  it('getCredentialConfigurationIds', () => {
    const meta: IssuerMetadata = {
      credential_issuer: '',
      credential_endpoint: '',
      credential_configurations_supported: {
        aaa: {
          format: '',
          claims: {},
          scope: '',
        },
        bbb: {
          format: '',
          claims: {},
          scope: '',
        },
      },
    };
    expect(getCredentialConfigurationIds(meta)).toEqual(['aaa', 'bbb']);
  });
});
