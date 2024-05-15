import { withZod } from '@remix-validated-form/with-zod';
import { z } from 'zod';
import { zfd } from 'zod-form-data';

export const revokeVcParamsValidator = withZod(z.object({
  uuid: zfd.text(z.string().uuid()),
}));

export const revokeVcResponseSchema = z.object({
  revokedAt: z.string(),
});
