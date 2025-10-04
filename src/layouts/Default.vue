<script lang="ts" setup>
import { useUserStore } from '@/store/user';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';

const { t } = useI18n();

const router = useRouter();
const route = useRoute();

const nav = computed(() => {
  return router.getRoutes()
    .filter(item => item?.meta?.nav)
    .map(item => {
      const navInfo = item.meta.nav as { key: string, icon: string, to?: string };
      return {
        to: navInfo?.to ?? { name: item.name },
        name: item.name,
        key: navInfo.key,
        icon: navInfo.icon,
      };
    });
});

interface RouteWithTab {
  name: string;
  meta: {
    tab: {
      key: string;
      icon: string;
    }
  };
}
const navRoute = computed(() => {
  if (!route.meta.nav) return route;
  const routeMeta = route.meta as { nav: { key: string } };
  return route.matched.find(item => item.name === routeMeta.nav?.key) ?? route;
})
const tabs = computed(() => {
  if (!route?.meta.tab || !route.meta.nav) return [];
  const routeMeta = route.meta as { nav: { key: string } };
  const parent = route.matched.find(item => item.name === routeMeta.nav?.key);
  if (!parent || !parent.children.length) return [];
  return parent.children
    .filter(child => child?.meta?.tab)
    .map(child => {
      const routeWidthTab = child as unknown as RouteWithTab;
      return {
        name: routeWidthTab.name,
        to: { name: routeWidthTab.name },
        key: routeWidthTab.meta.tab.key,
        icon: routeWidthTab.meta.tab.icon,
      };
    });
});

const userStore = useUserStore();
const user = computed(() => userStore.user);
const isAuthorized = computed(() => userStore.isAuthorized);
const signOut = () => {
  userStore.logout();
  // router.push({ name: 'auth' });
}
</script>

<template>
  <v-app>
    <v-navigation-drawer v-if="isAuthorized" rail>
      <v-list>
        <v-list-item title="Muffin" />
      </v-list>
      <v-divider />
      <v-list nav>
        <v-list-item
          v-for="item in nav"
          :key="item.name"
          :to="item.to"
          :title="t(`page.${item.key}`)"
          :prepend-icon="item.icon"
          :active="navRoute.name === item.name" />
      </v-list>
      <template #append>
        <v-list>
          <v-list-item @click="signOut" :title="t('btn.signout')" prepend-icon="mdi-logout-variant" />
        </v-list>
      </template>
    </v-navigation-drawer>
    <v-main>
      <v-app-bar>
        <v-app-bar-title v-if="navRoute.name !== 'home'" class="app-bar-title">
          {{ t(`page.${navRoute.name as String}`) }}
        </v-app-bar-title>
        <v-tabs v-if="tabs.length" align-tabs="title">
          <v-tab
            v-for="tab in tabs"
            :key="tab.key"
            :to="tab.to"
            :active="route.name === tab.name">
            {{ t(`page.${tab.key}`) }}
          </v-tab>
        </v-tabs>
      </v-app-bar>
      <v-layout class="page-content pa-4" full-height>
        <router-view />
      </v-layout>
    </v-main>
  </v-app>
</template>

<style scoped lang="scss">
.app-bar-title {
  flex: 0 0 auto;
}
</style>