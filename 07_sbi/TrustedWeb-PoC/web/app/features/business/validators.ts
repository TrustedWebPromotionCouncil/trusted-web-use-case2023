import { withZod } from '@remix-validated-form/with-zod';
import { z } from 'zod';
import { zfd } from 'zod-form-data';

export const vcRequestValidator = withZod(z.object({
  country: zfd.text(z.string().min(1).max(30)),
  address: zfd.text(z.string().min(1).max(200)),
  addressIncludedInVc: z.enum(['no', 'yes']).transform((yesNo) => yesNo === 'yes'),
  contactName: zfd.text(z.string().min(1).max(30)),
  contactDepartment: zfd.text(z.string().min(1).max(30)),
  contactJobTitle: zfd.text(z.string().min(1).max(30)),
  contactNumber: zfd.text(z.string().min(1).max(20).regex(/^[0-9]+$/)),
  contactInfoIncludedInVc: z.enum(['no', 'yes']).transform((yesNo) => yesNo === 'yes'),
  legalEntityIdentifier: zfd.text(z.string().min(1).max(30).regex(/^[0-9]+$/)),
  legalEntityName: zfd.text(z.string().min(1).max(50)),
  location: zfd.text(z.string().min(1).max(200)),
  authenticationLevel: zfd.numeric(z.number().int().min(1).max(3)),
}));

export const vcRenewResponseSchema = z.object({
  renewedAt: z.string(),
});
