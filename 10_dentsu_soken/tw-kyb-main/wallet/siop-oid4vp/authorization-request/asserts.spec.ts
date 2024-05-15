import { describe, it, expect } from 'vitest';

import { assertValidRequestObjectOpts } from './asserts';
import { ClaimPayloadCommonOpts, NoSignature, PassBy, Scope } from '../types';
import { RequestObjectOpts } from './types';

describe('asserts', () => {
  describe('assertValidRequestObjectOpts', () => {
    it('should throw error when passBy is NONE', () => {
      const signature: NoSignature = {
        hexPublicKey: '',
        did: '',
      };
      const opts: RequestObjectOpts<ClaimPayloadCommonOpts> = {
        passBy: PassBy.NONE,
        signature,
      };

      expect(() => assertValidRequestObjectOpts(opts)).toThrow(
        'Request object passBy must be REFERENCE or VALUE',
      );
    });

    it('should throw error when passBy is REFERENCE and reference_uri is not set', () => {
      const signature: NoSignature = {
        hexPublicKey: '',
        did: '',
      };
      const opts: RequestObjectOpts<ClaimPayloadCommonOpts> = {
        passBy: PassBy.REFERENCE,
        signature,
      };

      expect(() => assertValidRequestObjectOpts(opts)).toThrow(
        'referenceUri must be set when REFERENCE is specified',
      );
    });

    it('should throw error when passBy is VALUE and payload is not set', () => {
      const signature: NoSignature = {
        hexPublicKey: '',
        did: '',
      };
      const opts: RequestObjectOpts<ClaimPayloadCommonOpts> = {
        passBy: PassBy.VALUE,
        signature,
      };

      expect(() => assertValidRequestObjectOpts(opts)).toThrow(
        'request(payload) must be set when VALUE is specified',
      );
    });

    it('works when passBy is REFERENCE and reference_uri is set', () => {
      const signature: NoSignature = {
        hexPublicKey: '',
        did: '',
      };
      const opts: RequestObjectOpts<ClaimPayloadCommonOpts> = {
        passBy: PassBy.REFERENCE,
        reference_uri: 'aaa',
        signature,
      };

      expect(() => assertValidRequestObjectOpts(opts)).not.toThrow();
    });

    it('works when passBy is VALUE and reference_uri is set', () => {
      const signature: NoSignature = {
        hexPublicKey: '',
        did: '',
      };
      const opts: RequestObjectOpts<ClaimPayloadCommonOpts> = {
        passBy: PassBy.VALUE,
        payload: {
          scope: Scope.OPENID,
          client_id: '',
          response_type: 'id_token',
        },
        signature,
      };

      expect(() => assertValidRequestObjectOpts(opts)).not.toThrow();
    });
  });
});
