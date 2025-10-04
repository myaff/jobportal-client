<script setup lang="ts">
import { reactive } from 'vue';
import { useI18n } from 'vue-i18n';

const emits = defineEmits(['submit']);
defineExpose({ reset });
const { t } = useI18n();
const formData = reactive({
  email: '',
  password: '',
});
function submit() {
  emits('submit', formData);
}
function reset() {
  formData.email = '';
  formData.password = '';
}
</script>

<template>
  <v-form @submit.prevent="submit">
    <slot name="prepend"></slot>
    <v-text-field
      v-model="formData.email"
      type="email"
      :label="t('user.email')" />
    <v-text-field
      v-model="formData.password"
      type="password"
      :label="t('user.password')"
      class="mt-2" />
    <v-btn
      :text="t('actions.signin')"
      color="primary"
      size="x-large"
      block
      class="mt-3"
      @click="submit" />
    <slot></slot>
  </v-form>
</template>