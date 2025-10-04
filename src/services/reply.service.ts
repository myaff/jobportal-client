import Reply, { ReplyCreate, ReplyDto } from "@/models/reply.model";
import { ApiService } from "./api.service";

export default class ReplyService extends ApiService {
  resource = 'v1/reply';

  getAllByVacancy(id: string) {
    return ReplyService.api
      .get<ReplyDto[]>(`${this.resource}/vacancy/${id}`)
      .then(res => res.data.map(reply => new Reply(reply)));
  }

  create(id: string, payload: ReplyCreate) {
    const formData = new FormData();
    formData.append('content', payload.content);
    return ReplyService.api
      .post(`${this.resource}/vacancy/${id}`, formData);
  }
}