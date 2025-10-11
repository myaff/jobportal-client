<script setup lang="ts">
import { Vacancy, VacancyStatus } from '@/models/vacancy.model';
import VacancyService from '@/services/vacancies.service';
import { useUserStore } from '@/store/user';
import { computed, onMounted, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import VacancyCard from '@/components/VacancyCard.vue';
import { useAppStore } from '@/store/app';
import VacancyForm from '@/components/VacancyForm.vue';
import StatusFilter from '@/components/StatusFilter.vue';
import { useDisplay } from 'vuetify';

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
const choosenVacancyStatuses = ref<string[]>([]);
const choosenVacancyStatusesSet = computed(() => {
  if (!choosenVacancyStatuses.value.length
    || choosenVacancyStatuses.value.length === vacancyStatuses.value.size) return new Set();
  return new Set(choosenVacancyStatuses.value);
})
const filteredList = computed(() => {
  if (!choosenVacancyStatusesSet.value.size) return list.value;
  return list.value.filter(item => {
    if (choosenVacancyStatusesSet.value.size && !choosenVacancyStatusesSet.value.has(item.status)) return false;
    return true;
  })
})
const { lgAndUp } = useDisplay();
const showMobileFilters = ref(false);
watch(lgAndUp, value => {
  if (value) showMobileFilters.value = false;
})
</script>

<template>
  <div class="page">
    <v-container>
      <div class="page__content d-flex flex-column ga-3 py-4">
        <v-progress-circular v-if="isLoading" indeterminate class="mx-auto my-10" />
        <v-row v-else-if="!isLoading && list?.length">
          <v-col v-if="lgAndUp" cols="4">
            <div class="page__filter position-sticky">
              <status-filter
                :title="t('vacancy.statusFilter')"
                :list="vacancyStatuses"
                v-model="choosenVacancyStatuses"
                class="mt-6" />
            </div>
          </v-col>
          <v-col cols="12" lg="8">
            <vacancy-card
              v-for="item in filteredList"
              :key="item.id"
              :vacancy="item"
              :status="getStatus(item)" />
          </v-col>
        </v-row>
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

      <v-fab
        v-if="!lgAndUp"
        icon
        location="right bottom"
        app
        @click="showMobileFilters = true">
          <v-badge v-if="choosenVacancyStatuses.length" color="blue" dot>
            <v-icon icon="mdi-tune-variant" />
          </v-badge>
          <v-icon v-else icon="mdi-tune-variant" />
      </v-fab>
    </v-container>
    <v-bottom-sheet v-model="showMobileFilters">
      <v-sheet class="px-3 py-4">
        <status-filter
          :title="t('vacancy.statusFilter')"
          :list="vacancyStatuses"
          v-model="choosenVacancyStatuses"
          class="mt-6" />
        <v-btn
          variant="plain"
          icon="mdi-close"
          class="position-absolute top-0 right-0"
          @click="showMobileFilters = false" />
      </v-sheet>
    </v-bottom-sheet>
  </div>
</template>

<style lang="scss" scoped>
.page {
  &__filter {
    top: calc(var(--v-layout-top) + 32px);
  }
}
</style>