<script setup lang="ts">
import { ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useDisplay } from 'vuetify';

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
const { xs, smAndUp } = useDisplay();
</script>

<template>
  <v-sheet class="list-search py-5">
    <v-container>
      <v-form @submit.prevent="submit">
        <v-text-field
          v-model="search"
          prepend-inner-icon="mdi-magnify"
          clearable
          hide-details="auto"
          variant="solo-filled"
          @update:model-value="value => emits('update:model-value', value)"
          @click:clear="clear">
          <template v-if="smAndUp" #append>
            <v-btn color="yellow" size="x-large" @click="submit">
              {{ t('actions.search') }}
            </v-btn>
          </template>
        </v-text-field>
        <v-btn v-if="xs" color="yellow" size="large" block class="mt-4" @click="submit">
          {{ t('actions.search') }}
        </v-btn>
      </v-form>
    </v-container>
  </v-sheet>
</template>