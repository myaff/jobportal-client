import { Paginatable } from "@/models/common.model";
import { computed, ref } from "vue";

interface UsePaginationConfig {
  base: number;
  limit: number;
}

export default function usePagination(config: UsePaginationConfig = { base: 0, limit: 10 }) {
  const page = ref(config.base);
  const limit = ref(config.limit);
  const totalPages = ref(0);
  const totalElements = ref(0);

  const paginationParams = computed(() => ({
    page: page.value - config.base,
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
    page.value = params.page + config.base;
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