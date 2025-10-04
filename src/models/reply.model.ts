import User, { UserDto } from "./user.model";
import Vacancy, { VacancyDto } from "./vacancy.model";

export interface ReplyDto {
  id: string;
  author: UserDto;
  content: string;
  date: string;
  status: string;
  vacancy?: VacancyDto;
  vacancyId: string;
}

export type ReplyCreate = Pick<Reply, 'content'>;

export default class Reply {
  id: string;
  author: User;
  content: string;
  date: Date;
  status: string;
  vacancy: Vacancy | null;
  vacancyId: string;

  constructor(data: ReplyDto) {
    this.id = data.id;
    this.author = new User(data.author);
    this.content = data?.content ?? '';
    this.date = new Date(data.date);
    this.status = data.status;
    this.vacancyId = data.vacancyId ?? data.vacancy?.id ?? '';
    this.vacancy = data?.vacancy ? new Vacancy(data.vacancy) : null;
  }

  toString() {
    return this.content;
  }

  toJSON() {
    return JSON.stringify({
      id: this.id,
      author: this.author.toJSON(),
      content: this.content,
      date: this.date.toISOString(),
      status: this.status,
      ...(this?.vacancy && { vacancy: this.vacancy.toJSON() }),
    })
  }
}

