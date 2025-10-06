<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import ListFilters from '@/components/ListFilters.vue';
import ListSearch from '@/components/ListSearch.vue';
import VacancyService from '@/services/vacancies.service';
import usePagination from '@/composables/usePagnation';
import { Vacancy, VacancySearchParams } from '@/models/vacancy.model';
import { Tag } from '@/models/tag.model';
import TagService from '@/services/tags.service';
import { useRouter, useRoute } from 'vue-router';
import { isNumber } from 'lodash-es';
import { PageName } from '@/router';

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
const breakcrumbs = computed(() => [
  {
    title: t('app.pages.home'),
    to: { name: 'home' },
  },
  {
    title: t('app.pages.vacancies'),
    to: { name: 'vacancies' },
  },
]);

const search = ref('');
const tagsFilter = ref<string[]>([]);

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
  }
}

function setRouteQuery(params: Partial<VacancySearchParams>) {
  const routeQuery = { ...route.query, ...params };
  if (routeQuery?.limit) delete routeQuery.limit;
  if (isNumber(routeQuery?.page) && routeQuery.page <= PAGIN_BASE) delete routeQuery.page;
  router.replace({ ...route, query: routeQuery });
}

function updateTags() {
  return tagService.getAll().then(data => {
    tags.value = data.content;
  })
}
onMounted(() => {
  updateTags();
  updateList();
})
</script>

<template>
  <div class="page">
    <v-container>
      <div class="search-box">
        <list-search v-model="search" @submit="updateList" />
      </div>
      <v-breadcrumbs :items="breakcrumbs" />
      <v-row>
        <v-col cols="4">
          <list-filters :tags="tags" v-model="tagsFilter" class="filters pa-3" @submit="updateList" />
        </v-col>
        <v-col cols="8">
          <div class="d-flex flex-column ga-4">
            <v-card
              v-for="item in list"
              :key="item.id"
              variant="flat"
              :to="{ name: PageName.VACANCY, params: { id: item.id } }"
              hover
              color="white"
              rounded="lg"
              :prepend-avatar="item?.organization?.logoUrl"
              :title="item.title"
              :subtitle="item?.organization?.name"
              class="py-3 px-2">
              <v-chip-group v-if="item.tags?.length">
                <v-chip v-for="tag in item.tags" :key="tag.name">
                  {{ tag.localizedName }}
                </v-chip>
              </v-chip-group>
              <v-card-actions>
                <v-btn variant="flat" color="primary">
                  {{ t('actions.reply') }}
                </v-btn>
              </v-card-actions>
            </v-card>
          </div>
          <v-pagination
            v-if="totalPages > 1"
            v-model="page"
            :length="totalPages"
            class="mt-3"
            @update:model-value="setPage" />
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>