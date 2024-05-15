import { AnyOpts, PassBy, Errors } from '../types';

import { RequestObjectOpts } from './types';

export const assertValidRequestObjectOpts = (
  opts: RequestObjectOpts<AnyOpts>,
) => {
  if (opts.passBy !== PassBy.REFERENCE && opts.passBy !== PassBy.VALUE) {
    throw new Error(Errors.REQUEST_OBJECT_PASSBY_MUST_VALUE_OR_REFERENCE);
  } else if (opts.passBy === PassBy.REFERENCE && !opts.reference_uri) {
    throw new Error(Errors.NO_REFERENCE_URI);
  } else if (opts.passBy === PassBy.VALUE && !opts.payload) {
    throw new Error(Errors.NO_REQUEST);
  }
};
