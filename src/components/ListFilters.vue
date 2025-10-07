<script setup lang="ts">
import useTags from '@/composables/useTags';
import { Tag } from '@/models/tag.model';
import { PropType, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';

const props = defineProps({
  tags: {
    type: Array as PropType<Tag[]>,
    default: [],
  },
  modelValue: {
    type: Array as PropType<string[]>,
    default: () => [],
  },
})
const emits = defineEmits(['update:model-value', 'reset', 'submit']);
const { t } = useI18n();
const { groupped } = useTags(props.tags);
const tags = ref(props.modelValue);
watch(() => props.modelValue, value => {
  tags.value = value;
})
function submit() {
  emits('submit', tags.value);
}
function reset() {
  tags.value = [];
  emits('reset', tags.value);
}
</script>

<template>
  <div class="list-filters">
    <div class="list-filters__groups">
      <v-list
        v-for="[key, group] in groupped"
        :key="key"
        v-model:selected="tags"
        select-strategy="leaf"
        variant="plain"
        bg-color="transparent"
        @update:selected="val => emits('update:model-value', val)">
        <v-list-subheader>
          {{ group.category.name }}
        </v-list-subheader>
        <v-list-item
          v-for="tag in group.list"
          :key="tag.name"
          :value="tag.name"
          :title="tag.localizedName">
          <template v-slot:prepend="{ isSelected, select }">
            <v-list-item-action start>
              <v-checkbox-btn :model-value="isSelected" @update:model-value="select"></v-checkbox-btn>
            </v-list-item-action>
          </template>
        </v-list-item>
      </v-list>
    </div>
    <div class="d-flex ga-2">
      <v-btn color="primary" @click="submit">
        {{ t('actions.apply') }}
      </v-btn>
      <v-btn variant="outlined" icon="mdi-trash-can" density="comfortable" rounded="lg" @click="reset" />
    </div>
  </div>
</template>