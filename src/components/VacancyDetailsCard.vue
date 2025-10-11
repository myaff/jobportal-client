<script setup lang="ts">
import useTags from '@/composables/useTags';
import { Vacancy, VacancySalaryStatus, VacancyStatus } from '@/models/vacancy.model';
import { useAppStore } from '@/store/app';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

const props = defineProps({
  vacancy: {
    type: Vacancy,
    required: true,
  },
})
const appStore = useAppStore();
const vacancyStatuses = computed(() => appStore.vacancyStatus);
const status = computed(() => {
  return vacancyStatuses.value.get(props.vacancy.status)
    ?? new VacancyStatus({
      name: props.vacancy.status,
      localizedName: props.vacancy.status,
    });
})
const { groupped } = useTags(props.vacancy.tags);
const { t, n } = useI18n();
const salaryFormatted = computed(() => {
  const salaryStatus = props.vacancy.salaryStatus;
  if (salaryStatus === VacancySalaryStatus.UNKNOWN) {
    return t('vacancy.salaryUnknown');
  }
  if (salaryStatus === VacancySalaryStatus.UNPAID) {
    return t('vacancy.salaryUnpaid');
  }
  const { from, to } = props.vacancy.salary;
  const parts: string[] = [];
  if (from) parts.push(`${t('from')} ${n(from, 'currency')}`)
  if (to) parts.push(`${t('to')} ${n(to, 'currency')}`);
  return parts.join(' ').toLocaleLowerCase();
})
</script>

<template>
  <v-card variant="flat" class="py-3">
    <v-card-item>
      <div class="d-flex ga-2 flex-wrap align-item">
        <div class="content">
          <h1 class="text-h5 text-lg-h4 font-weight-medium">
            {{ vacancy.title }}
          </h1>
          <div class="text-subtitle-1 mt-2 text-grey">
            {{ vacancy.date.toLocaleString() }}
          </div>
        </div>
        <div v-if="status" class="w-100 w-sm-auto ml-sm-auto">
          <v-chip :color="status.color">
            {{ status.localizedName }}
          </v-chip>
        </div>
      </div>
    </v-card-item>
    <v-card-item>
      <p v-if="vacancy?.salary" class="text-body-1 mb-3">
        {{ t('vacancy.salary') }}:
        <span class="font-weight-bold">
          {{ salaryFormatted }}
        </span>
      </p>
      <div class="vacancy-tag-group d-flex align-center ga-2">
        <v-label>{{ t('vacancy.type') }}:</v-label>
        <v-chip>
          {{ vacancy.type.localizedName }}
        </v-chip>
      </div>
      <div v-for="[key, group] in groupped" :key="key" class="vacancy-tag-group d-flex align-center flex-wrap ga-2 mt-2">
        <v-label>{{ group.category.name }}:</v-label>
        <v-chip v-for="tag in group.list" :key="tag.name">
          {{ tag.localizedName }}
        </v-chip>
      </div>
    </v-card-item>
    <v-card-text class="mt-4">
      <div class="text-body-1" v-html="vacancy.description"></div>
    </v-card-text>
  </v-card>
</template>