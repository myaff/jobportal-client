import { ApiService } from "./api.service";
import { TagDto } from "@/models/tag.model";


export default class TagService extends ApiService {
  resource = 'v1/tag';

  getAll() {
    return TagService.api
      .get<TagDto[]>(`${this.resource}`)
      .then(res => {
        return {
          content: res.data ?? [],
        }
      });
  }
}