<script lang="ts" setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useUserStore } from './store/user';

const { t } = useI18n();
const userStore = useUserStore();

const user = computed(() => userStore.user);
</script>

<template>
  <v-app class="bg-grey-lighten-3">
    <v-app-bar>
      <v-toolbar-title>{{ t('app.title') }}</v-toolbar-title>
      <v-avatar v-if="user"></v-avatar>
      <v-btn v-else icon>
        <v-icon>mdi-account</v-icon>
      </v-btn>
    </v-app-bar>

    <v-main>
      <router-view v-slot="{ Component }">
        <v-fade-transition hide-on-leave>
          <component :is="Component" />
        </v-fade-transition>
      </router-view>
    </v-main>
  </v-app>
</template>