import { createRouter, createWebHistory, RouterOptions } from 'vue-router';
import routes from './routes';
// import guards from './guards';

const routerOptions: RouterOptions = {
  history: createWebHistory(`${import.meta.env.BASE_URL || ''}`),
  routes: routes,
};

const router = createRouter(routerOptions);

// router.beforeEach((to, from, next) => guards(to, from, next));

export default router;
