import { withZod } from '@remix-validated-form/with-zod';
import { z } from 'zod';
import { zfd } from 'zod-form-data';

export const LoginFormValidator = withZod(z.object({
  id: zfd.text(),
  password: zfd.text(),
}));
