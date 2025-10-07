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
  <v-sheet class="list-search px-6 py-5" rounded="xl">
    <v-form @submit.prevent="submit">
      <v-text-field
        v-model="search"
        prepend-inner-icon="mdi-magnify"
        clearable
        hide-details="auto"
        @update:model-value="value => emits('update:model-value', value)"
        @click:clear="clear">
        <template #append>
          <v-btn color="primary" size="x-large" class="d-none d-sm-flex" @click="submit">
            {{ t('actions.search') }}
          </v-btn>
        </template>
      </v-text-field>
      <v-btn color="primary" size="large" block class="d-sm-none mt-4" @click="submit">
        {{ t('actions.search') }}
      </v-btn>
    </v-form>
  </v-sheet>
</template>