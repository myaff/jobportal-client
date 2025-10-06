<script setup lang="ts">
import { User } from '@/models/user.model';
import { reactive } from 'vue';
import { useI18n } from 'vue-i18n';

const props = defineProps({
  user: {
    type: User,
    required: true,
  },
})
const emits = defineEmits(['submit']);
defineExpose({ reset });
const { t } = useI18n();

const formData = reactive({
  firstName: props.user.firstName,
  middleName: props.user.middleName,
  lastName: props.user.lastName,
})

function submit() {
  emits('submit', formData);
}
function reset() {
  formData.firstName = props.user.firstName;
  formData.middleName = props.user.middleName;
  formData.lastName = props.user.lastName;
}
</script>

<template>
  <v-form @submit.prevent="submit">
    <v-text-field
      v-model="formData.firstName"
      :label="t('user.firstName')"
      name="firstName" />
    <v-text-field
      v-model="formData.middleName"
      :label="t('user.middleName')"
      name="middleName" />
    <v-text-field
      v-model="formData.lastName"
      :label="t('user.lastName')"
      name="lastName" />
    <v-btn
      color="primary"
      size="x-large"
      block
      class="mt-3"
      @click="submit">
      {{ t('actions.save') }}
    </v-btn>
  </v-form>
</template>
