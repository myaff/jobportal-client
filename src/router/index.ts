// Composables
import { useUserStore } from '@/store/user';
import { RouteLocationNormalized, createRouter, createWebHistory } from 'vue-router';

export enum PageName {
  HOME = 'home',
  VACANCIES = 'vacancies',
  VACANCY = 'vacancy',
  ACCOUNT = 'account',
}

const routes = [
  {
    path: '/',
    name: PageName.HOME,
    redirect: '/vacancies',
    meta: {
      nav: {
        key: 'home',
        icon: 'mdi-home',
      },
    },
  },
  {
    path: '/vacancies',
    name: PageName.VACANCIES,
    component: () => import('@/pages/vacancies/index.vue'),
  },
  {
    path: '/vacancies/:id',
    name: PageName.VACANCY,
    component: () => import('@/pages/vacancies/detail.vue'),
  },
  {
    path: '/account',
    name: PageName.ACCOUNT,
    component: () => import('@/pages/account/index.vue'),
    meta: { needAuth: true },
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

router.beforeEach(async (to: RouteLocationNormalized) => {
  const userStore = useUserStore();
  await userStore.init();
  if (!to.meta?.needAuth) return true;
  if (userStore.isAuthorized) return true;
  else return { name: 'home' };
})

export default router
