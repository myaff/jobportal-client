<script setup lang="ts">
import { reactive } from 'vue';
import { useI18n } from 'vue-i18n';

const emits = defineEmits(['submit']);
defineExpose({ reset });
const { t } = useI18n();
const formData = reactive({
  username: '',
  password: '',
  repeatPassword: '',
  firstName: '',
  middleName: '',
  lastName: '',
});
function submit() {
  emits('submit', formData);
}
function reset() {
  formData.username = '';
  formData.password = '';
}
</script>

<template>
  <v-form @submit.prevent="submit">
    <slot name="prepend"></slot>
    <v-text-field
      v-model="formData.firstName"
      type="email"
      :label="t('user.firstName')" />
    <v-text-field
      v-model="formData.middleName"
      type="email"
      :label="t('user.middleName')" />
    <v-text-field
      v-model="formData.lastName"
      type="email"
      :label="t('user.lastName')" />
    <v-text-field
      v-model="formData.username"
      type="email"
      :label="t('user.username')" />
    <v-text-field
      v-model="formData.password"
      type="password"
      :label="t('user.password')"
      class="mt-2" />
    <v-btn
      :text="t('actions.signup')"
      color="primary"
      size="x-large"
      block
      class="mt-3"
      @click="submit" />
    <slot></slot>
  </v-form>
</template>