<script setup lang="ts">
import { FieldError, FormError } from '@/models/common.model';
import { useUserStore } from '@/store/user';
import { reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useDisplay } from 'vuetify';

const emits = defineEmits(['signup']);
defineExpose({ reset });
const { t } = useI18n();
const formData = reactive({
  email: '',
  password: '',
  repeatPassword: '',
  firstName: '',
  middleName: '',
  lastName: '',
});

const errors = ref<Map<string, string>>(new Map());

function reset() {
  formData.email = '';
  formData.password = '';
  formData.repeatPassword = '';
  formData.firstName = '';
  formData.middleName = '';
  formData.lastName = '';
}
const isSending = ref(false);
const userStore = useUserStore();
function submit() {
  isSending.value = true;
  userStore.register(formData)
    .then(() => {
      reset();
      errors.value.clear();
      emits('signup');
    })
    .catch((e: unknown) => {
      if (e instanceof FormError) {
        errors.value.clear();
        e.list.forEach(e => {
          errors.value.set(e.field, e.message);
        })
      }
    })
    .finally(() => isSending.value = false);
}
const { smAndUp } = useDisplay();
</script>

<template>
  <v-form @submit.prevent="submit">
    <slot name="prepend"></slot>
    <v-text-field
      v-model="formData.firstName"
      type="text"
      :label="t('user.firstName')"
      :error="errors.has('firstName')"
      :error-messages="errors.get('firstName')"
      :density="smAndUp ? 'default' : 'comfortable'"
      class="mb-2" />
    <v-text-field
      v-model="formData.middleName"
      type="text"
      :label="t('user.middleName')"
      :error="errors.has('middleName')"
      :error-messages="errors.get('middleName')"
      :density="smAndUp ? 'default' : 'comfortable'"
      class="mb-2" />
    <v-text-field
      v-model="formData.lastName"
      type="text"
      :label="t('user.lastName')"
      :error="errors.has('lastName')"
      :error-messages="errors.get('lastName')"
      :density="smAndUp ? 'default' : 'comfortable'"
      class="mb-2" />
    <v-text-field
      v-model="formData.email"
      type="email"
      :label="t('user.email')"
      :error="errors.has('email')"
      :error-messages="errors.get('email')"
      :density="smAndUp ? 'default' : 'comfortable'"
      class="mb-2" />
    <v-text-field
      v-model="formData.password"
      type="password"
      :label="t('user.password')"
      :error="errors.has('password')"
      :error-messages="errors.get('password')"
      :density="smAndUp ? 'default' : 'comfortable'"
      class="mb-2" />
    <v-text-field
      v-model="formData.repeatPassword"
      type="password"
      :label="t('user.repeatPassword')"
      :error="errors.has('repeatPassword')"
      :error-messages="errors.get('repeatPassword')"
      :density="smAndUp ? 'default' : 'comfortable'"
      class="mb-2" />
    <v-btn
      :text="t('actions.signup')"
      color="primary"
      size="x-large"
      block
      class="mt-3"
      :loading="isSending"
      @click="submit" />
    <slot></slot>
  </v-form>
</template>