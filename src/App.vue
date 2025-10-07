<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useUserStore } from './store/user';
import AuthForm from './components/AuthForm.vue';
import RegisterForm from './components/RegisterForm.vue';
import { useRoute, useRouter } from 'vue-router';
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
    if (route?.meta?.needAuth) router.push({ name: 'home' });
  });
}
function closeAuth() {
  authDialog.value = false;
  authDialogMode.value = 'signin';
}
const profileMenu = ref(false);

const appStore = useAppStore();
onMounted(async () => await appStore.init());
const { smAndUp } = useDisplay();
</script>

<template>
  <v-app class="bg-grey-lighten-3">
    <v-app-bar>
      <v-container>
        <div class="d-flex ga-2 align-center">
          <v-btn
            prepend-icon="mdi-home"
            variant="flat"
            size="x-large"
            :to="{ name: PageName.HOME }"
            class="w-auto flex-0-0">
            <span class="text-h6 font-weight-black">
              {{ t('app.title') }}
            </span>
          </v-btn>
          <v-spacer />
          <v-menu v-if="isAuthorized && user" v-model="profileMenu" location="bottom end" width="200">
            <template #activator="{ props }">
              <v-list-item v-bind="props">
                <template #append>
                  <v-avatar color="info">
                    {{ user.abbreviation }}
                  </v-avatar>
                </template>
                <template v-if="smAndUp" #title>
                  <p class="text-right">
                    {{ `${user.firstName} ${user.lastName}` }}
                  </p>
                </template>
                <template v-if="smAndUp" #subtitle>
                  <p class="text-right">
                    {{ user.email }}
                  </p>
                </template>
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
          <v-btn v-else icon="mdi-account" class="w-auto flex-0-0 ml-auto" @click="authDialog = true" />
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
                class="mt-4"
                @click="authDialogMode = 'signup'" />
            </auth-form>
            <register-form
              v-else-if="authDialogMode === 'signup'"
              @signup="closeAuth">
              <v-btn
                :text="t('actions.signin')"
                size="large"
                block
                class="mt-4"
                @click="authDialogMode = 'signin'" />
            </register-form>
          </transition>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-app>
</template>