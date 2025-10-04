<script lang="ts" setup>
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useUserStore } from './store/user';
import AuthForm from './components/AuthForm.vue';
import RegisterForm from './components/RegisterForm.vue';
import { AuthFormData } from './models/user.model';

const { t } = useI18n();
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
function signUp(formData: AuthFormData) {
  userStore.register(formData)
    .then(() => {
      if (signupFormCmp.value?.reset) signupFormCmp.value.reset();
      closeAuth();
    })
}
function closeAuth() {
  authDialog.value = false;
  authDialogMode.value = 'signin';
}
</script>

<template>
  <v-app class="bg-grey-lighten-3">
    <v-app-bar>
      <v-toolbar-title>{{ t('app.title') }}</v-toolbar-title>
      <v-avatar v-if="isAuthorized && user"></v-avatar>
      <v-btn v-else icon="mdi-account" @click="authDialog = true" />
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
      width="auto">
      <v-card
        width="500"
        min-width="360"
        :title="t('app.pages.signin')">
        <template #append>
          <v-btn
            icon="mdi-close"
            variant="flat"
            @click="closeAuth" />
        </template>
        <v-card-item>
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
        </v-card-item>
      </v-card>
    </v-dialog>
  </v-app>
</template>