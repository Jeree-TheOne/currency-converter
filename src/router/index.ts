import { createRouter, createWebHistory } from 'vue-router';
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/pages/HomePage.vue'),
    },
    {
      path: '/convert',
      name: 'convert',
      component: () => import('@/pages/ConvertPage.vue'),
    },
  ],
});

export default router;
