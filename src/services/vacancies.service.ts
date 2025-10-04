import { ApiService } from "./api.service";
import { VacancyDto, VacancySearchParams, VacancySearchResponse } from "@/models/vacancy.model";

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
          ...res.data,
          content: res.data?.content ?? [],
        }
      });
  }

  getById(id: string) {
    return VacancyService.api
      .get<VacancyDto>(`${this.resource}/${id}`)
      .then(res => res.data);
  }
}