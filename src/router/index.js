import { createRouter, createWebHistory } from 'vue-router';
import { useUserStore } from '@/stores/user.js';

// Import views and layouts
import LoginLayout from '@/views/layouts/LoginLayout.vue';
import HomeLayout from '@/views/layouts/HomeLayout.vue';
import HomeView from '@/views/HomeView.vue';
import LoginView from '@/views/LoginView.vue';
import ChangePasswordView from '@/views/ChangePasswordView.vue';
import ArsipDompetkuView from '@/views/ArsipDompetku.vue'; 

const routes = [
  {
    path: '/login',
    name: 'login',
    meta: { layout: LoginLayout },
    component: LoginView,
  },
  {
    path: '/',
    name: 'home',
    meta: { layout: HomeLayout },
    component: HomeView,
  },
  {
    path: '/change-password',
    name: 'change-password',
    meta: { layout: HomeLayout },
    component: ChangePasswordView,
  },
  {
    path: '/account-form',
    name: 'account-form',
    meta: { layout: HomeLayout },
    component: () => import('@/views/AccountFormView.vue'),
  },
  {
    path: '/arsip-dompetku',
    name: 'arsip-dompetku',
    meta: { layout: HomeLayout },
    component: ArsipDompetkuView, // Register ArsipDompetku view
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  const userStore = useUserStore(); // Access store without setup()

  if (to.name !== 'login' && !userStore.token) {
    next({ name: 'login' });
  } else if (to.name === 'login' && userStore.token) {
    next({ name: 'home' });
  } else {
    next();
  }
});

export default router;
