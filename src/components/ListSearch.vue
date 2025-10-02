<script setup lang="ts">
import { ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';

const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
});
const emits = defineEmits(['update:model-value', 'submit']);
const { t } = useI18n();
const search = ref(props.modelValue);
watch(() => props.modelValue, value => {
  if (value !== search.value) search.value = value;
});
function submit() {
  emits('submit', search.value);
}
</script>

<template>
  <div class="list-search">
    <v-text-field
      v-model="search"
      prepend-inner-icon="mdi-magnify"
      @update:model-value="value => emits('update:model-value', value)">
      <template #append>
        <v-btn color="primary" size="x-large" @click="submit">
          {{ t('actions.search') }}
        </v-btn>
      </template>
    </v-text-field>
  </div>
</template>