import { CONST } from '@/models';
import { t } from '.';

export class Validate {
  /**
   * required check
   * @param value
   * @param msg
   * @returns
   */
  static required(value: string | number | boolean | null, msg: string) {
    return (value !== '' && value !== null && value !== false) || t('VALIDATE.VALUE_REQUIRED', { value: msg });
  }
  /**
   * email format check
   * @param value
   * @returns
   */
  static email(value: string) {
    return CONST.EMAIL_PATTERN.test(value) || t('VALIDATE.VALUE_FORMAT', { value: t('PLACEHOLDER.EMAIL') });
  }
  /**
   * limit length check
   * @param value
   * @param limit
   * @returns
   */
  static limit(value: string, limit: number) {
    return value.length <= limit || t('VALIDATE.VALUE_LIMIT', { value: limit });
  }
}
