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
const emits = defineEmits(['update:model-value', 'clear', 'submit']);
const { t } = useI18n();
const { groupped } = useTags(props.tags);
const tags = ref(props.modelValue);
watch(() => props.modelValue, value => {
  tags.value = value;
})
function submit() {
  emits('submit', tags.value);
}
function clear() {
  tags.value = [];
  emits('update:model-value', tags.value);
  emits('clear', tags.value);
}
</script>

<template>
  <div class="list-filters">
    <div class="list-filters__groups px-2">
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
    <div class="list-filters__actions position-sticky bottom-0 pa-2 d-flex ga-2 align-center">
      <v-btn
        color="primary"
        class="flex-1-1"
        size="large"
        @click="submit">
        {{ t('actions.apply') }}
      </v-btn>
      <v-btn
        variant="outlined"
        icon="mdi-trash-can"
        rounded="lg"
        class="flex-0-0"
        @click="clear" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.list-filters {
  &__actions {
    background: inherit;
  }
}
</style>