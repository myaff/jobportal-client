import { Paginatable } from "@/models/common.model";
import { computed, ref } from "vue";
import { LocationQuery } from "vue-router";
import { getQueryParamValue } from "./useUrlHelper";
import { isNaN } from "lodash-es";

interface UsePaginationConfig {
  base: number;
  limit: number;
  query: LocationQuery;
}

export default function usePagination(config: UsePaginationConfig = { base: 0, limit: 10, query: {} }) {
  const page = ref(getPageFromQuery(config.query));
  const limit = ref(config.limit);
  const totalPages = ref(0);
  const totalElements = ref(0);

  const paginationParams = computed(() => ({
    page: Math.max(page.value - config.base, 0),
    limit: limit.value,
  }))

  function setPage(n: number) {
    page.value = n;
  }

  function setLimit(n: number) {
    limit.value = n;
  }

  function setPagination(params: Paginatable) {
    totalPages.value = params.totalPages;
    totalElements.value = params.totalElements;
    page.value = Math.min(params.page, params.totalPages - 1) + config.base;
  }

  function getPageFromQuery(query: LocationQuery) {
    const qPage = parseInt(getQueryParamValue(query?.page ?? ''));
    return isNaN(qPage) ? config.base : qPage;
  }

  return {
    page,
    totalPages,
    totalElements,
    paginationParams,
    setPage,
    setLimit,
    setPagination,
  }
}