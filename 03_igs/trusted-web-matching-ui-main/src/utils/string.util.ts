import { Enums, CONST } from '@/models';
export class StringUtils {
  /**
   * parse gender enums
   * @param gender
   * @returns
   */
  static parseGender(gender: string) {
    const g = Enums.Gender[gender as keyof typeof Enums.Gender] || Enums.Gender.Other;

    return CONST.GENDER[g];
  }
}
