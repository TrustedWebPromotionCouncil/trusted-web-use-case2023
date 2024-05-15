import { NavigationGuardNext, RouteLocationNormalized } from 'vue-router';

/**
 * ルーティング制御系
 * @param to
 * @param from
 * @param next
 */
const guards = async (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {};

export default guards;
