<script lang="ts" setup>
import { CommonStatus } from '@/models/common.model';
import { PropType } from 'vue';

const props = defineProps({
  list: {
    type: Map as PropType<Map<string, CommonStatus>>,
    required: true,
  },
  title: {
    type: String,
  },
  modelValue: {
    type: Array as PropType<string[]>,
    default: () => [],
  },
})
const emits = defineEmits(['update:model-value']);
</script>

<template>
  <div class="status-filter">
    <div v-if="title" class="text-subtitle-1 text-medium-emphasis mb-2">
      {{ title }}
    </div>
    <v-chip-group
      :model-value="modelValue"
      column
      multiple
      variant="outlined"
      selected-class="v-chip--selected v-chip--variant-tonal"
      @update:model-value="v => emits('update:model-value', v)">
      <v-chip
        v-for="[key, item] in list"
        :color="item.color"
        :base-color="item.color"
        :value="item.name"
        filter>
        {{ item.localizedName }}
      </v-chip>
    </v-chip-group>
  </div>
</template>