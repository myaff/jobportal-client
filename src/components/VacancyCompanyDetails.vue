<script setup lang="ts">
import Organization from '@/models/organization.model';
import DadataService from '@/services/dadata.service';
import { DaDataApi } from 'dadata-api';
import { ref, PropType, onMounted } from 'vue';

const props = defineProps({
  company: {
    type: Object as PropType<Organization>,
    required: true,
  },
})
const extraInfo = ref<DaDataApi.Suggestion<DaDataApi.Party> | null>(null);
const isLoading = ref(false);
const dadataService = new DadataService();
function fetchExtraInfo(inn: string) {
  isLoading.value = true;
  return dadataService
    .getCompanyInfo(inn)
    .then(data => extraInfo.value = data?.suggestions?.at(0) ?? null)
    .finally(() => isLoading.value = false);
}
onMounted(async () => {
  if (props.company?.inn) await fetchExtraInfo(props.company.inn);
})
</script>

<template>
  <v-card class="vacancy-company-details" variant="flat" :loading="isLoading">
    <template #prepend>
      <v-avatar v-if="company?.logoUrl" :image="company.logoUrl" size="64" class="mr-2" />
    </template>
    <template #title>
      <h4 class="text-h5 font-weight-bold">
        {{ extraInfo?.value ?? company.name }}
      </h4>
    </template>
    <template v-if="company?.websiteUrl" #subtitle>
      <a :href="company.websiteUrl" target="_blank" class="text-body-1 text-blue-darken-4">
        {{ company.websiteUrlShort }}
      </a>
    </template>
    <template #text>
      <p v-if="company?.description" class="text-body-1">
        {{ company.description }}
      </p>
    </template>
    <v-card-text v-if="extraInfo?.data?.address?.value">
      <div class="d-flex ga-2 align-content-center">
        <v-icon icon="mdi-map-marker" />
        <p class="text-body-1">
          {{ extraInfo.data.address.value }}
        </p>
      </div>
    </v-card-text>
  </v-card>
</template>