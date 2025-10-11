// Composables
import { UserRole } from '@/models/user.model';
import { useUserStore } from '@/store/user';
import { RouteLocationNormalized, createRouter, createWebHistory } from 'vue-router';

export enum PageName {
  HOME = 'home',
  VACANCIES = 'vacancies',
  VACANCY = 'vacancy',
  ACCOUNT = 'account',
  MY_VACANCIES = 'myVacancies',
  REPLIES = 'replies',
}

const routes = [
  {
    path: '/',
    name: PageName.HOME,
    redirect: '/vacancies',
  },
  {
    path: '/vacancies',
    name: PageName.VACANCIES,
    component: () => import('@/pages/vacancies/index.vue'),
  },
  {
    path: '/vacancies/my',
    name: PageName.MY_VACANCIES,
    component: () => import('@/pages/vacancies/my.vue'),
    meta: { role: [UserRole.MANAGER, UserRole.ADMIN] },
  },
  {
    path: '/vacancies/replies',
    name: PageName.REPLIES,
    component: () => import('@/pages/vacancies/replies.vue'),
    meta: { role: [UserRole.MANAGER, UserRole.ADMIN] },
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
    meta: { role: [UserRole.USER, UserRole.MANAGER, UserRole.ADMIN] },
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

router.beforeEach(async (to: RouteLocationNormalized) => {
  const userStore = useUserStore();
  try {
    await userStore.init();
  } catch(e: unknown) {
    console.log((e as { message?: string })?.message);
  }
  if (!to.meta?.role) return true;
  const accepted = to.meta.role as string[];
  if (accepted.includes(userStore.userRole)) return true;
  return { name: PageName.HOME };
})

export default router
