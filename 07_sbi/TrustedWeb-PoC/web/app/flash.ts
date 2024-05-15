import { type FlashOptions } from './session.server';

export const makeFlashMessage = (options: FlashOptions) => ({ flash: options });
