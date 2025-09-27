// Composables
import { useUserStore } from '@/store/user';
import { RouteLocationNormalized, createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'home',
    // route level code-splitting
    // this generates a separate chunk (Home-[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import('@/pages/index.vue'),
    meta: {
      nav: {
        key: 'home',
        icon: 'mdi-home',
      },
    },
  },
  {
    path: '/vacancies',
    name: 'vacancies',
    component: () => import('@/pages/vacancies/index.vue'),
  },
  {
    path: '/vacancies/:id',
    name: 'vacanciesDetail',
    component: () => import('@/pages/vacancies/detail.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
})

router.beforeEach(async (to: RouteLocationNormalized) => {
  if (!to.meta?.needAuth || to.name === 'auth') return true;
  const userStore = useUserStore();
  await userStore.init();
  if (userStore.isAuthorized) return true;
  else return { name: 'auth' };
})

export default router
