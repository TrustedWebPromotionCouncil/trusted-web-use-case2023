import { Utils } from '@/utils';
import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'main',
    component: Utils.lazyLoad('Index'),
  },
  {
    path: '/:catchAll(.*)',
    component: Utils.lazyLoad('Index'),
  },
];

export default routes;
