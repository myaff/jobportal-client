import { User, UserDto } from "./user.model";
import { Vacancy, VacancyDto } from "./vacancy.model";

export interface ReplyDto {
  id: string;
  author: UserDto | null;
  content: string;
  date: string;
  status: keyof typeof ReplyStatuses;
  vacancy?: VacancyDto | null;
  vacancyId: string;
  cv?: string;
}

export type ReplyCreate = Pick<Reply, 'content'>;

export class Reply {
  id: string;
  content: string;
  date: Date;
  status: keyof typeof ReplyStatuses;
  vacancy: Vacancy | null;
  vacancyId: string;
  cv: string;
  isMine: boolean;
  fullStatus?: ReplyStatus;

  constructor(data: ReplyDto) {
    this.id = data.id;
    this.content = data?.content ?? '';
    this.date = new Date(data.date);
    this.status = data.status;
    this.vacancyId = data.vacancyId ?? data.vacancy?.id ?? '';
    this.vacancy = data?.vacancy ? new Vacancy(data.vacancy) : null;
    this.cv = data?.cv ?? '';
    this.isMine = false;
  }

  getCVLink() {
    return `${import.meta.env.VITE_BASE_API}/v1/reply/vacancy/${this.vacancyId}/cv/${this.cv}`;
  }

  toPlainObject() {
    return {
      id: this.id,
      content: this.content,
      date: this.date.toISOString(),
      status: this.status,
      cv: this.cv,
    }
  }

  toString() {
    return this.content;
  }

  toJSON() {
    return JSON.stringify(this.toPlainObject());
  }
}

export class VacancyReply extends Reply {
  author: User;

  constructor(data: ReplyDto & { author: UserDto }) {
    super(data);
    this.author = new User(data.author);
  }

  static isValid(data: ReplyDto): data is ReplyDto & { author: UserDto } {
    return !!data?.id && !!data?.author && User.isValid(data.author);
  }

  toPlainObject() {
    return {
      ...super.toPlainObject(),
      author: this.author.toJSON(),
    }
  }

  toJSON() {
    return JSON.stringify(this.toPlainObject());
  }
}

export class UserReply extends Reply {
  vacancy: Vacancy;

  constructor(data: ReplyDto & { vacancy: VacancyDto }) {
    super(data);
    this.vacancy = new Vacancy(data.vacancy);
  }

  toPlainObject() {
    return {
      ...super.toPlainObject(),
      vacancy: this.vacancy.toJSON(),
    }
  }

  toJSON() {
    return JSON.stringify(this.toPlainObject);
  }

  static isValid(data: ReplyDto): data is ReplyDto & { vacancy: VacancyDto } {
    return !!data?.id
      && !!data?.vacancy
      && Vacancy.isValid(data.vacancy);
  }
}

export enum ReplyStatuses {
  NEW = 'NEW',
  SEEN = 'SEEN',
  REJECTED = 'REJECTED',
  SUSPENDED = 'SUSPENDED',
}

export enum ReplyStatusColor {
  NEW = 'info',
  SEEN = 'default',
  REJECTED = 'error',
  SUSPENDED = 'warning'
}

export interface ReplyStatusDto {
  statusName: keyof typeof ReplyStatuses;
  localizedName: string;
}

export class ReplyStatus {
  name: keyof typeof ReplyStatuses;
  localizedName: string;
  color: string;

  constructor(data: ReplyStatusDto) {
    this.name = data.statusName;
    this.localizedName = data.localizedName ?? this.name;
    this.color = ReplyStatusColor[this.name];
  }

  toString() {
    return this.localizedName ?? this.name;
  }

  toPlainObject() {
    return {
      name: this.name,
      localizedName: this.localizedName,
    }
  }

  toJSON() {
    return JSON.stringify(this.toPlainObject());
  }
}