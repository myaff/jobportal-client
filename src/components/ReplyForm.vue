<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

const emits = defineEmits(['submit']);
defineExpose({ reset });

const { t } = useI18n();
const message = ref('');
const cv = ref<File | null>(null);
function submit() {
  const formData = new FormData();
  formData.append('content', message.value);
  if (cv.value) formData.append('cv', cv.value);
  emits('submit', formData);
}
function reset() {
  message.value = '';
  cv.value = null;
}
</script>

<template>
  <v-sheet class="px-6 py-5">
    <v-form @submit.prevent="submit">
      <h4 class="text-h5 mb-5">
        {{ t('reply.formTitle') }}
      </h4>
      <v-textarea
        v-model="message"
        :label="t('reply.yourItem')" />
      <v-file-input v-model="cv" :label="t('reply.attachCV')" />
      <v-btn :text="t('actions.send')" color="primary" size="large" @click="submit" />
    </v-form>
  </v-sheet>
</template>