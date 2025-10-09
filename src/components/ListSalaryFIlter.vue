<script setup lang="ts">
import { SalaryRange } from '@/models/vacancy.model';
import { ref, PropType } from 'vue';
import { useI18n } from 'vue-i18n';

const props = defineProps({
  modelValue: {
    type: Object as PropType<SalaryRange<number>>,
    required: true,
  },
  min: {
    type: Number,
    default: 0,
  },
  max: {
    type: Number,
    default: 0,
  },
})
const emits = defineEmits(['update:model-value']);
const { t, n } = useI18n();
const rangeModel = ref([props.modelValue.from, props.modelValue.to]);
const update = () => {
  emits('update:model-value', {
    from: rangeModel.value[0],
    to: rangeModel.value[1],
  });
}
</script>

<template>
  <div class="list-salary-filter px-4">
    <div class="v-list-subheader ml-2">
      {{ t('vacancy.salary') }}
    </div>
    <v-range-slider
      v-model="rangeModel"
      strict
      :min="min"
      :max="max"
      step="1000"
      hide-details
      @update:model-value="update" />
    <div class="list-salary-filter__result d-flex justify-space-between px-2 mt-3">
      <div class="text-label">
        {{ `${t('from')}: ${n(rangeModel[0], 'currency')}` }}
      </div>
      <div class="text-label">
        {{ `${t('to')}: ${n(rangeModel[1], 'currency')}` }}
      </div>
    </div>
  </div>
</template>