<script setup lang="ts">
import { Vacancy, VacancyStatus } from '@/models/vacancy.model';
import VacancyService from '@/services/vacancies.service';
import { useUserStore } from '@/store/user';
import { computed, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import VacancyCard from '@/components/VacancyCard.vue';
import { useAppStore } from '@/store/app';
import VacancyForm from '@/components/VacancyForm.vue';

const { t } = useI18n();
const userStore = useUserStore();
const token = computed(() => userStore.token);
const vacancyService = new VacancyService();
VacancyService.setAuthToken(token.value);

const list = ref<Vacancy[]>([]);
const isLoading = ref(false);
const creationOpen = ref(false);

function updateList() {
  isLoading.value = true;
  return vacancyService
    .getAll()
    .then(data => list.value = data)
    .finally(() => isLoading.value = false);
}
onMounted(() => {
  updateList();
})
const appStore = useAppStore();
const vacancyStatuses = computed(() => appStore.vacancyStatus);
const getStatus = (vacancy: Vacancy) => {
  return vacancyStatuses.value.get(vacancy.status)
    ?? new VacancyStatus({
      name: vacancy.status,
      localizedName: vacancy.status,
    });
}
</script>

<template>
  <div class="page">
    <v-container>
      <div class="page__content d-flex flex-column ga-3">
        <v-progress-circular v-if="isLoading" indeterminate class="mx-auto my-10" />
        <div v-else-if="!isLoading && list?.length" class="page__list d-flex ga-3 flex-wrap">
          <vacancy-card
            v-for="item in list"
            :key="item.id"
            :vacancy="item"
            :status="getStatus(item)" />
        </div>
        <v-empty-state
          v-else
          class="my-10"
          :headline="t('vacancy.empty.heading')"
          :title="t('vacancy.empty.title')"
          :text="t('vacancy.empty.text')">
          <template #actions>
            <v-btn
              color="blue"
              size="x-large"
              :text="t('actions.add')"
              class="mt-8"
              @click="creationOpen = true" />
          </template>
        </v-empty-state>
      </div>
      <v-dialog v-model="creationOpen" max-width="600">
        <v-card :title="t('vacancy.create')">
          <template #append>
            <v-btn
              icon="mdi-close"
              variant="plain"
              @click="creationOpen = false" />
          </template>
          <v-card-text>
            <vacancy-form />
          </v-card-text>
        </v-card>
      </v-dialog>
    </v-container>
  </div>
</template>