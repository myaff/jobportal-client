<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import ListTagsFilter from '@/components/ListTagsFilter.vue';
import ListSearch from '@/components/ListSearch.vue';
import VacancyService from '@/services/vacancies.service';
import usePagination from '@/composables/usePagnation';
import { SalaryRange, Vacancy, VacancySearchParams, VacancyStatus } from '@/models/vacancy.model';
import { Tag } from '@/models/tag.model';
import TagService from '@/services/tags.service';
import { useRouter, useRoute, LocationQuery } from 'vue-router';
import { isNaN, isNumber } from 'lodash-es';
import { PageName } from '@/router';
import { useAppStore } from '@/store/app';
import VacancyCard from '@/components/VacancyCard.vue';
import { useDisplay } from 'vuetify';
import { getQueryParamArray, getQueryParamValue } from '@/composables/useUrlHelper';
import ListSalaryFilter from '@/components/ListSalaryFIlter.vue';

const { t } = useI18n();
const router = useRouter();
const route = useRoute();
const vacanciesService = new VacancyService();
const tagService = new TagService();
const PAGIN_BASE = 1;
const PAGIN_LIMIT = 10;
const {
  page,
  totalPages,
  paginationParams,
  setPage: setPageInternal,
  setPagination,
} = usePagination({
  base: PAGIN_BASE,
  limit: PAGIN_LIMIT,
  query: route.query,
});

function setPage(n: number) {
  setPageInternal(n);
  updateList();
}

const list = ref<Vacancy[]>([]);
const tags = ref<Tag[]>([]);
const salaryRange = ref<SalaryRange | null>(null);
const salaryModel = ref<SalaryRange<number>>(getSalaryFromQuery(route.query));
const salaryParams = computed(() => {
  if (!salaryRange.value) return null;
  return {
    ...(salaryModel.value.from !== salaryRange.value.from && { salaryFrom: salaryModel.value.from }),
    ...(salaryModel.value.to !== salaryRange.value.to && { salaryTo: salaryModel.value.to }),
  };
})

const search = ref(getQueryParamValue(route.query?.query ?? ''));
const tagsFilter = ref<string[]>(getQueryParamArray(route.query?.tags) ?? []);


const appStore = useAppStore();
const vacancyStatuses = computed(() => appStore.vacancyStatus);
const getStatus = (vacancy: Vacancy) => {
  return vacancyStatuses.value.get(vacancy.status)
    ?? new VacancyStatus({
      name: vacancy.status,
      localizedName: vacancy.status,
    });
}

function updateList() {
  const params = getRequestParams();

  return vacanciesService
    .search(params)
    .then(data => {
      list.value = data.content;
      setPagination(data);
      setRouteQuery(params);
    });
}
function getRequestParams(): Partial<VacancySearchParams> {
  return {
    ...paginationParams.value,
    ...(search.value && { query: search.value }),
    ...(tagsFilter.value.length && { tags: tagsFilter.value }),
    ...(!!salaryParams.value && salaryParams.value),
  }
}
function getSalaryFromQuery(query: LocationQuery) {
  const from = parseInt(getQueryParamValue(query?.salaryFrom));
  const to = parseInt(getQueryParamValue(query?.salaryTo));
  return {
    from: !isNaN(from) ? from : 0,
    to: !isNaN(to) ? to : Number.MAX_VALUE,
  };
}

function setRouteQuery(params: Partial<VacancySearchParams>) {
  const routeQuery = { ...route.query, ...params };
  if (routeQuery?.limit) delete routeQuery.limit;
  if (isNumber(routeQuery?.page) && routeQuery.page <= PAGIN_BASE) {
    delete routeQuery.page;
  }
  if (routeQuery?.tags && !tagsFilter.value.length) {
    delete routeQuery.tags;
  }
  if (routeQuery?.query && !search.value) delete routeQuery.query;
  if (routeQuery?.salaryFrom && routeQuery.salaryFrom == salaryRange.value?.from) {
    delete routeQuery.salaryFrom;
  }
  if (routeQuery?.salaryTo && routeQuery.salaryTo == salaryRange.value?.to) {
    delete routeQuery.salaryTo;
  }
  router.replace({ ...route, query: routeQuery });
}

function updateTags() {
  return tagService.getAll().then(data => {
    tags.value = data.content;
  })
}
function updateSalaryRange() {
  return vacanciesService.getSalaryRange()
    .then(range => {
      salaryRange.value = range;
      const from = Math.max(range.from ?? Number.MIN_VALUE, salaryModel.value.from);
      const to = Math.max(from, Math.min(range.to ?? Number.MAX_VALUE, salaryModel.value.to));
      salaryModel.value = {
        from,
        to: to === Number.MAX_VALUE ? from : to,
      };
    });
}

onMounted(async () => {
  await updateSalaryRange();
  updateTags();
  updateList();
})
const { mdAndDown, lgAndUp } = useDisplay();
const showMobileFilters = ref(false);
</script>

<template>
  <div class="page">
    <list-search v-model="search" class="bg-blue mb-4" @submit="updateList" />
    <v-container>
      <v-row>
        <v-col v-if="lgAndUp" cols="12" lg="4">
          <list-salary-filter
            v-if="salaryRange && salaryRange.from !== salaryRange.to"
            v-model="salaryModel"
            :min="salaryRange.from ?? 0"
            :max="salaryRange.to ?? 0" />
          <list-tags-filter
            v-if="tags.length"
            :tags="tags"
            v-model="tagsFilter"
            class="filters bg-grey-lighten-3"
            @submit="updateList"
            @clear="updateList" />
        </v-col>
        <v-col cols="12" lg="8">
          <div class="d-flex flex-column ga-4">
            <vacancy-card
              v-for="item in list"
              :key="item.id"
              :vacancy="item"
              :status="getStatus(item)"
              :to="{ name: PageName.VACANCY, params: { id: item.id } }" />
          </div>
          <v-pagination
            v-if="totalPages > 1"
            v-model="page"
            :length="totalPages"
            class="mt-3"
            @update:model-value="setPage" />
        </v-col>
      </v-row>
      <v-bottom-sheet v-if="mdAndDown && tags.length" v-model="showMobileFilters">
        <v-btn icon="mdi-close" variant="plain" color="white" class="position-absolute top-0 right-0 mt-n11" @click="showMobileFilters = false" />
        <v-sheet>
          <list-salary-filter
            v-if="salaryRange && salaryRange.from !== salaryRange.to"
            v-model="salaryModel"
            :min="salaryRange.from ?? 0"
            :max="salaryRange.to ?? 0" />
          <list-tags-filter
            :tags="tags"
            v-model="tagsFilter"
            class="filters bg-white"
            @submit="updateList" />
        </v-sheet>
      </v-bottom-sheet>
      <v-fab
        v-if="mdAndDown"
        icon="mdi-tune-variant"
        location="right bottom"
        app
        @click="showMobileFilters = true" />
    </v-container>
  </div>
</template>