<script setup lang="ts">
import { FormError } from '@/models/common.model';
import { useUserStore } from '@/store/user';
import { reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';

const emits = defineEmits(['signin']);
defineExpose({ reset });
const { t } = useI18n();
const formData = reactive({
  email: '',
  password: '',
});
function reset() {
  formData.email = '';
  formData.password = '';
}
const isSending = ref(false);
const userStore = useUserStore();
const errors = ref<Map<string, string>>(new Map());

function submit() {
  isSending.value = true;
  userStore.login(formData)
    .then(() => {
      reset();
      errors.value.clear();
      emits('signin');
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
      :loading="isSending"
      @click="submit" />
    <slot></slot>
  </v-form>
</template>