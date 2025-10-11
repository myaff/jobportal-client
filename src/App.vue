<script lang="ts" setup>
import { computed, onMounted, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useUserStore } from './store/user';
import AuthForm from './components/AuthForm.vue';
import RegisterForm from './components/RegisterForm.vue';
import { onBeforeRouteLeave, useRoute, useRouter } from 'vue-router';
import { PageName } from './router';
import { useAppStore } from './store/app';
import { useDisplay } from 'vuetify';

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const userStore = useUserStore();
const isAuthorized = computed(() => userStore.isAuthorized);
const user = computed(() => userStore.user);
const authDialog = ref(false);
const authDialogMode = ref<'signin' | 'signup'>('signin');

function logout() {
  return userStore.logout().then(() => {
    if (route?.meta?.role) router.push({ name: 'home' });
  });
}
function closeAuth() {
  authDialog.value = false;
  authDialogMode.value = 'signin';
}
const profileMenu = ref(false);

const appStore = useAppStore();
onMounted(async () => await appStore.init());
const { smAndUp, lgAndUp } = useDisplay();

const mainNav = computed(() => {
  return [
    {
      name: PageName.VACANCIES,
      title: t('app.pages.vacanciesSearch'),
    },
    (user.value?.managerAndUp && {
      name: PageName.MY_VACANCIES,
      title: t('app.pages.myVacancies'),
    }),
     (user.value?.managerAndUp && {
      name: PageName.REPLIES,
      title: t('app.pages.replies'),
    }),
  ].filter(item => !!item);
})
const mobileNavOpen = ref(false);
watch(lgAndUp, value => {
  if (!value) mobileNavOpen.value = false;
})
watch(() => route.name, () => {
  mobileNavOpen.value = false;
})
</script>

<template>
  <v-app class="bg-grey-lighten-3">
    <v-app-bar>
      <v-container>
        <div class="d-flex ga-2 align-center">
          <v-btn
            v-if="!lgAndUp"
            icon="mdi-menu"
            class="flex-0-0"
            variant="plain"
            @click="mobileNavOpen = true" />
          <v-btn
            prepend-icon="mdi-home"
            variant="flat"
            size="x-large"
            :to="{ name: PageName.HOME }"
            :active="false"
            class="w-auto flex-0-0">
            <span class="text-h6 font-weight-black">
              {{ t('app.title') }}
            </span>
          </v-btn>
          <v-tabs v-if="lgAndUp">
            <v-tab
              v-for="item in mainNav"
              :key="item.name"
              :to="{ name: item.name }">
              {{ item.title }}
            </v-tab>
          </v-tabs>
          <v-spacer />
          <v-menu v-if="isAuthorized && user" v-model="profileMenu" location="bottom end" width="200">
            <template #activator="{ props }">
              <v-list-item v-bind="props">
                <div class="d-flex align-center">
                  <div v-if="smAndUp" class="text-right mr-3">
                    <p class="text-bofy-1 font-weight-bold">
                      {{ `${user.firstName} ${user.lastName}` }}
                    </p>
                    <p class="text-body-2 color-grey">
                      {{ user.email }}
                    </p>
                  </div>
                  <v-avatar color="info" class="flex-0-0">
                    {{ user.abbreviation }}
                  </v-avatar>
                </div>
              </v-list-item>
            </template>
            <v-list nav>
              <v-list-item
                :title="t('app.pages.account')"
                prepend-icon="mdi-account-cog-outline"
                :to="{ name: PageName.ACCOUNT }" />
              <v-list-item
                :title="t('actions.signout')"
                prepend-icon="mdi-logout"
                class="text-red"
                @click="logout" />
            </v-list>
          </v-menu>
          <v-btn v-else icon="mdi-account" class="flex-0-0 ml-auto" @click="authDialog = true" />
        </div>
      </v-container>
    </v-app-bar>

    <v-main>
      <router-view v-slot="{ Component }">
        <v-fade-transition hide-on-leave>
          <component :is="Component" />
        </v-fade-transition>
      </router-view>
    </v-main>

    <v-dialog
      v-model="authDialog"
      max-width="500">
      <v-card :title="authDialogMode === 'signin' ? t('app.pages.signin') : t('app.pages.signup')">
        <template #append>
          <v-btn
            icon="mdi-close"
            variant="flat"
            @click="closeAuth" />
        </template>
        <v-card-text>
          <transition name="fade" mode="out-in">
            <auth-form
              v-if="authDialogMode === 'signin'"
              @signin="closeAuth">
              <v-btn
                :text="t('actions.signup')"
                size="large"
                block
                variant="plain"
                class="mt-4"
                @click="authDialogMode = 'signup'" />
            </auth-form>
            <register-form
              v-else-if="authDialogMode === 'signup'"
              @signup="closeAuth">
              <v-btn
                :text="t('actions.signin')"
                size="large"
                variant="plain"
                block
                class="mt-4"
                @click="authDialogMode = 'signin'" />
            </register-form>
          </transition>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-bottom-sheet v-if="!lgAndUp && mainNav.length > 1" v-model="mobileNavOpen">
      <v-list>
        <v-list-item
          v-for="item in mainNav"
          :key="item.name"
          :to="{ name: item.name }">
          {{ item.title }}
        </v-list-item>
      </v-list>
    </v-bottom-sheet>
  </v-app>
</template>