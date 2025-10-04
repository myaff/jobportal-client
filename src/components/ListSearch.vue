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
function clear() {
  search.value = '';
  if (props.modelValue) submit();
}
</script>

<template>
  <v-sheet class="list-search px-4 py-3">
    <v-form @submit.prevent="submit">
      <v-text-field
        v-model="search"
        prepend-inner-icon="mdi-magnify"
        clearable
        @update:model-value="value => emits('update:model-value', value)"
        @click:clear="clear">
        <template #append>
          <v-btn color="primary" size="x-large" @click="submit">
            {{ t('actions.search') }}
          </v-btn>
        </template>
      </v-text-field>
    </v-form>
  </v-sheet>
</template>