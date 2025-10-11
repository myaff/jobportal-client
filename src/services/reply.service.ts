import { ReplyDto, VacancyReply } from "@/models/reply.model";
import { ApiService } from "./api.service";

export default class ReplyService extends ApiService {
  resource = 'v1/reply';

  getAllByVacancy(id: string) {
    return ReplyService.api
      .get<ReplyDto[]>(`${this.resource}/vacancy/${id}`)
      .then(res => {
        return res.data
          .filter(reply => VacancyReply.isValid(reply))
          .map(reply => new VacancyReply(reply));
        });
  }

  getAll() {
    return ReplyService.api
      .get<ReplyDto[]>(`${this.resource}`)
      .then(res => {
        return res.data
          .filter(reply => VacancyReply.isValid(reply))
          .map(reply => new VacancyReply(reply));
        });
  }

  create(id: string, formData: FormData) {
    return ReplyService.api
      .postForm(`${this.resource}/vacancy/${id}`, formData);
  }

  update(id: string, formData: Partial<ReplyDto>) {
    return ReplyService.api
      .patch(`${this.resource}/${id}`, {}, {
        params: formData,
      });
  }
}