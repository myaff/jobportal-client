<script setup lang="ts">
import { reactive } from 'vue';
import { useI18n } from 'vue-i18n';

const emits = defineEmits(['submit']);
const formData = reactive({
  title: '',
  salaryFrom: '',
  salaryTo: '',
  type: '',
  description: '',
})
const { t, n } = useI18n();
const submit = () => {
  emits('submit');
}
</script>

<template>
  <v-form @submit.prevent="submit">
    <v-text-field
      v-model="formData.title"
      :label="t('vacancy.title')" />
    <v-label class="mb-3">{{ t('vacancy.salary') }}</v-label>
    <v-row>
      <v-col size="12" sm="6">
        <v-text-field
          v-model.number="formData.salaryFrom"
          type="number"
          :suffix="t('currencySymbol')">
          <template #prepend>
            <span class="text-label">{{ t('from') }}</span>
          </template>
        </v-text-field>
      </v-col>
      <v-col size="12" sm="6">
        <v-text-field
          v-model.number="formData.salaryTo"
          type="number"
          :suffix="t('currencySymbol')">
          <template #prepend>
            <span class="text-label">{{ t('to') }}</span>
          </template>
        </v-text-field>
      </v-col>
    </v-row>
  </v-form>
</template>