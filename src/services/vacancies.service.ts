import { Paginatable, PaginatableApi } from "@/models/common.model";
import { ApiService } from "./api.service";
import { VacancySearchParams, VacancySearchResponse } from "@/models/vacancy.model";

export default class VacancyService extends ApiService {
  resource = 'v1/vacancy';

  search(params: Partial<VacancySearchParams>) {
    return VacancyService.api
      .get<VacancySearchResponse>(`${this.resource}/search`, {
        params,
        paramsSerializer: {
          indexes: null,
        },
      })
      .then(res => {
        return {
          content: res.data?.content ?? [],
          ...this.transformPagination(res.data),
        }
      });
  }

  transformPagination(params: PaginatableApi): Paginatable {
    return {
      totalPages: params.totalPages,
      totalElements: params.totalElements,
      page: params.number,
    }
  }
}