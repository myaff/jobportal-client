<script setup lang="ts">
import { reactive } from 'vue';
import { useI18n } from 'vue-i18n';

const emits = defineEmits(['submit']);
defineExpose({ reset });

const { t } = useI18n();
const formData = reactive({
  content: '',
})
function submit() {
  emits('submit', formData);
}
function reset() {
  formData.content = '';
}
</script>

<template>
  <v-sheet class="px-6 py-5">
    <v-form @submit.prevent="submit">
      <h4 class="text-h5 mb-5">
        {{ t('reply.formTitle') }}
      </h4>
      <v-textarea
        v-model="formData.content"
        :label="t('reply.yours')" />
      <v-btn :text="t('actions.send')" color="primary" size="large" @click="submit" />
    </v-form>
  </v-sheet>
</template>