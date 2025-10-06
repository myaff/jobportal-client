<script lang="ts" setup>
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useUserStore } from './store/user';
import AuthForm from './components/AuthForm.vue';
import RegisterForm from './components/RegisterForm.vue';
import { AuthFormData, UserCreateFormData } from './models/user.model';
import { useRoute, useRouter } from 'vue-router';
import { PageName } from './router';

const { t } = useI18n();
const route = useRoute();
const router = useRouter();
const userStore = useUserStore();
const isAuthorized = computed(() => userStore.isAuthorized);
const user = computed(() => userStore.user);
const authDialog = ref(false);
const authDialogMode = ref<'signin' | 'signup'>('signin');
const signinFormCmp = ref();
function signIn(formData: AuthFormData) {
  userStore.login(formData)
    .then(() => {
      if (signinFormCmp.value?.reset) signinFormCmp.value.reset();
      authDialog.value = false;
    })
}
const signupFormCmp = ref();
function signUp(formData: UserCreateFormData) {
  userStore.register(formData)
    .then(() => {
      if (signupFormCmp.value?.reset) signupFormCmp.value.reset();
      closeAuth();
    })
}
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
</script>

<template>
  <v-app class="bg-grey-lighten-3">
    <v-app-bar>
      <v-container>
        <v-row class="align-center">
          <v-col>
            <v-btn
              prepend-icon="mdi-home"
              variant="flat"
              size="x-large"
              :to="{ name: PageName.HOME }">
              <span class="text-h6 font-weight-black">
                {{ t('app.title') }}
              </span>
            </v-btn>
          </v-col>
          <v-spacer />
          <v-col>
            <v-menu v-if="isAuthorized && user" v-model="profileMenu" location="bottom end" width="200">
              <template #activator="{ props }">
                <v-list-item v-bind="props">
                  <template #append>
                    <v-avatar color="info">
                      {{ user.abbreviation }}
                    </v-avatar>
                  </template>
                  <template #title>
                    <p class="text-right">
                      {{ `${user.firstName} ${user.lastName}` }}
                    </p>
                  </template>
                  <template #subtitle>
                    <p class="text-right">{{ user.email }}</p>
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
            <v-btn v-else icon="mdi-account" @click="authDialog = true" />
          </v-col>
        </v-row>
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
      <v-card :title="t('app.pages.signin')">
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
              ref="signinFormCmp"
              @submit="signIn">
              <v-btn
                :text="t('actions.signup')"
                size="large"
                block
                class="mt-4"
                @click="authDialogMode = 'signup'" />
            </auth-form>
            <register-form
              v-else-if="authDialogMode === 'signup'"
              ref="signupFormComp"
              @submit="signUp">
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