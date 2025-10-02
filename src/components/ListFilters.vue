<script setup lang="ts">
import { TagCategoryDto, TagDto } from '@/models/tag.model';
import { computed, PropType, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';

const props = defineProps({
  tags: {
    type: Array as PropType<TagDto[]>,
    default: [],
  },
  modelValue: {
    type: Array as PropType<string[]>,
    default: () => [],
  },
})
const emits = defineEmits(['update:model-value', 'reset', 'submit']);
const { t } = useI18n();
interface FilterGroup {
  category: TagCategoryDto;
  list: Omit<TagDto, 'tagCategory'>[];
}
const uncategorized = {
  id: 'uncategorised',
  name: 'Тэги'
}
const filters = computed(() => {
  return props.tags.reduce((acc, item) => {
    const category = item?.tagCategory ?? uncategorized;
    const group = getOrAddMapItem(acc,category.id, { category: category, list: [] });
    const tag = { ...item, tagCategory: undefined };
    group.list.push(tag);
    return acc;
  }, new Map<string, FilterGroup>());
})
function getOrAddMapItem<T>(map: Map<string, T>, key: string, initialValue: T): T {
  const item = map.get(key);
  if (item) return item;
  else {
    const newValue = { ...initialValue };
    map.set(key, newValue);
    return newValue;
  }
}
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
        v-for="[key, group] in filters"
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