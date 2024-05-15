import i18n from '@/i18n';
export const t = i18n.global.t;

export class Utils {
  /**
   * Simplified route import.
   * @param route
   */
  static lazyLoad(name: string) {
    return () => import(`@/pages/${name}View/${name}View.vue`);
  }
}
