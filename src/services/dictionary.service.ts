import { VacancyProp, VacancyPropDto, VacancyStatus, VacancyStatuses } from "@/models/vacancy.model";
import { ApiService } from "./api.service";
import { ReplyStatus, ReplyStatusDto } from "@/models/reply.model";

export default class DictionaryService extends ApiService {
  resource = 'v1';

  getVacancyType() {
    return DictionaryService.api
      .get<VacancyPropDto[]>(`${this.resource}/vacancyType`)
      .then(res => res.data?.map(item => new VacancyProp(item)) ?? []);
  }

  getVacancyStatuses() {
    return DictionaryService.api
      .get<VacancyPropDto<keyof typeof VacancyStatuses>[]>(`${this.resource}/vacancyStatuses`)
      .then(res => res.data?.map(item => new VacancyStatus(item)) ?? []);
  }

  getReplyStatus() {
    return DictionaryService.api
      .get<ReplyStatusDto[]>(`${this.resource}/replyStatus`)
      .then(res => res.data?.map(item => new ReplyStatus(item)) ?? []);
  }
}