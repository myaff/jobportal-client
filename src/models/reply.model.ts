import { CommonStatus, Nullable } from "./common.model";
import { User, UserDto } from "./user.model";
import { Vacancy, VacancyDto } from "./vacancy.model";

export interface ReplyDto<V = Nullable<VacancyDto>, U = Nullable<UserDto>> {
  id: string;
  author: U;
  content: string;
  date: string;
  status: keyof typeof ReplyStatuses;
  vacancy: V;
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

export type VacancyReplyDto = ReplyDto<Nullable<VacancyDto>, UserDto>;
export class VacancyReply extends Reply {
  author: User;

  constructor(data: VacancyReplyDto) {
    super(data);
    this.author = new User(data.author);
  }

  static isValid(data: ReplyDto): data is VacancyReplyDto {
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

export type UserReplyDto = ReplyDto<VacancyDto, Nullable<UserDto>>;
export class UserReply extends Reply {
  vacancy: Vacancy;

  constructor(data: UserReplyDto) {
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

  static isValid(data: ReplyDto): data is UserReplyDto {
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

export class ReplyStatus implements CommonStatus {
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

export class FullReply extends Reply {
  author: User;
  vacancy: Vacancy;

  constructor(data: ReplyDto<VacancyDto, UserDto>) {
    super(data);
    this.author = new User(data.author);
    this.vacancy = new Vacancy(data.vacancy);
  }

  static isValid(data: ReplyDto): data is ReplyDto<VacancyDto, UserDto> {
    return !!data?.id
      && !!data?.vacancy
      && Vacancy.isValid(data.vacancy)
      && !!data.author
      && User.isValid(data.author);
  }

  toPlainObject() {
    return {
      ...super.toPlainObject(),
      author: this.author.toJSON(),
      vacancy: this.vacancy.toJSON(),
    };
  }

  toJSON() {
    return JSON.stringify(this.toPlainObject());
  }
}