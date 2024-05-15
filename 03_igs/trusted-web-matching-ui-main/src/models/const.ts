import { t } from '@/utils';
import { Enums } from './enums';

interface ValueLabel<V, L> {
  value: V;
  label: L;
}
interface Size {
  width: number;
  height: number;
}
export namespace CONST {
  // secure storage key
  export const STORAGE_KEY = import.meta.env.VITE_STORAGE_KEY;
  // email validation
  export const EMAIL_PATTERN =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  export type SORT_TYPE = 'ability' | 'hard_skill' | 'soft_skill' | 'desired_salary' | 'offer_count';
  export const SORT_TYPE_OPTIONS: ValueLabel<SORT_TYPE, string>[] = [
    { value: 'ability', label: t('CANDIDATE_LIST.SORT_TYPE.ABILITY') },
    { value: 'hard_skill', label: t('CANDIDATE_LIST.SORT_TYPE.HARDSKILL') },
    { value: 'soft_skill', label: t('CANDIDATE_LIST.SORT_TYPE.SOFTSKILL') },
    { value: 'desired_salary', label: t('CANDIDATE_LIST.SORT_TYPE.DESIRED_SALARY') },
    { value: 'offer_count', label: t('CANDIDATE_LIST.SORT_TYPE.OFFER_COUNT') },
  ];
  export const GENDER: Record<Enums.Gender, string> = {
    Male: t('GENDER.MALE'),
    Female: t('GENDER.FEMALE'),
    Other: t('GENDER.OTHER'),
  };
  export const SNACKBAR_DELAY: number = 1000;
  export const ABILITY_TYPE_OPTIONS: ValueLabel<Enums.AbilityType, string>[] = [
    { value: Enums.AbilityType.Balanced, label: t('CANDIDATE_LIST.ABILITY_TYPE.BALANCED') },
    { value: Enums.AbilityType.HardSkill, label: t('CANDIDATE_LIST.ABILITY_TYPE.HARDSKILL') },
    { value: Enums.AbilityType.SoftSkill, label: t('CANDIDATE_LIST.ABILITY_TYPE.SOFTSKILL') },
  ];

  // default size setting
  export namespace SIZE {
    export const ICON: number = 24;
    export const MAIN_DIALOG: Size = {
      width: 800,
      height: 900,
    };
    export const MAIN_DIALOG_INNER: Size = {
      width: 750,
      height: 850,
    };
    export const BUTTON: Size = {
      width: 150,
      height: 40,
    };
    export const CONFIRM_DIALOG: Size = {
      width: 600,
      height: 450,
    };
    export const COMPLETED_DIALOG: Size = {
      width: 300,
      height: 200,
    };
    export const BAR_CHART = {
      HARD: 50,
      SOFT: 100,
    };
  }
}
