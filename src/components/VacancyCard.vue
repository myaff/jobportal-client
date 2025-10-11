<script setup lang="ts">
import { Vacancy, VacancySalaryStatus, VacancyStatus } from '@/models/vacancy.model';
import { useI18n } from 'vue-i18n';
import { PageName } from '@/router';
import { computed } from 'vue';
import { isNaN, isNull } from 'lodash-es';

const props = defineProps({
  vacancy: {
    type: Vacancy,
    required: true,
  },
  status: {
    type: VacancyStatus,
    required: true,
  },
})
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
  <v-card
    variant="flat"
    :to="{ name: PageName.VACANCY, params: { id: vacancy.id } }"
    hover
    color="white"
    rounded="lg"
    class="py-3 px-2">
    <v-card-item>
      <div class="d-flex flex-wrap ga-3 align-center">
        <v-avatar v-if="vacancy?.organization?.logoUrl" color="info" size="40" :image="vacancy.organization.logoUrl" />
        <div class="content">
          <div class="text-h6 font-weight-bold">
            {{ vacancy.title }}
          </div>
          <div v-if="vacancy?.organization?.name" class="text-subtitle-2 text-grey">
            {{ vacancy.organization.name }}
          </div>
        </div>
        <div v-if="status" class="status w-100 w-sm-auto ml-sm-auto">
          <v-chip :color="status.color">
            {{ status.localizedName }}
          </v-chip>
        </div>
      </div>
    </v-card-item>
    <v-card-text>
      <p v-if="vacancy?.salary" class="text-body-1 mb-3">
        {{ t('vacancy.salary') }}:
        <span class="font-weight-bold">
          {{ salaryFormatted }}
        </span>
      </p>
      <v-chip-group column>
        <v-chip>
          {{ vacancy.type.localizedName }}
        </v-chip>
        <v-chip v-for="tag in vacancy.tags" :key="tag.name">
          {{ tag.localizedName }}
        </v-chip>
      </v-chip-group>
    </v-card-text>
  </v-card>
</template>