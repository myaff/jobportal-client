import { FetchListResponse, FilterParams, PaginationParams, SortParams } from "./common.model";
import Organization, { OrganizationDto } from "./organization.model";
import { Tag, TagDto } from "./tag.model";

export interface VacancyDto {
  id: string;
  title: string;
  description: string;
  date: string;
  tags: TagDto[];
  organization: OrganizationDto;
  status: keyof typeof VacancyStatuses;
  type: VacancyPropDto;
  salary: string;
}

export interface VacancySearchParams extends
  SortParams,
  PaginationParams,
  FilterParams {
    tags: string[];
    organization: string;
    status: string;
    type: string;
  }

export type VacancySearchResponse = FetchListResponse<VacancyDto>;
export interface VacancyPropDto<T = string> {
  name: T;
  description?: string;
  localizedName: string;
}

export class VacancyProp {
  name: string;
  description: string;
  localizedName: string;

  constructor(data: VacancyPropDto) {
    this.name = data.name;
    this.description = data?.description ?? '';
    this.localizedName = data.localizedName;
  }

  toString() {
    return this.localizedName;
  }

  toJSON() {
    return JSON.stringify({
      name: this.name,
      description: this.description,
      localizedName: this.localizedName,
    })
  }
}

export class Vacancy {
  id: string;
  title: string;
  description: string;
  date: Date;
  tags: Tag[];
  organization: Organization;
  status: keyof typeof VacancyStatuses;
  type: VacancyProp;
  salary: string;

  constructor(data: VacancyDto) {
    this.id = data.id;
    this.title = data.title;
    this.description = data.description ?? '';
    this.date = new Date(data.date);
    this.tags = data?.tags.map(tag => new Tag(tag));
    this.organization = new Organization(data.organization);
    this.status = data.status;
    this.type = new VacancyProp(data.type);
    this.salary = data?.salary ?? '';
  }

  toString() {
    return this.title;
  }

  toPlainObject() {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      date: this.date.toISOString(),
      tags: this.tags.map(item => item.toJSON()),
      organization: this.organization.toJSON(),
      status: this.status,
      type: this.type.toJSON(),
      salary: this.salary,
    }
  }

  toJSON() {
    return JSON.stringify(this.toPlainObject());
  }

  static isValid(data: VacancyDto): data is VacancyDto {
    return !!data?.id;
  }
}

export enum VacancyStatuses {
  OPEN = 'SEEN',
  CLOSED = 'REJECTED',
  SUSPENDED = 'SUSPENDED',
}

export enum VacancyStatusColor {
  OPEN = 'green',
  CLOSED = 'error',
  SUSPENDED = 'warning'
}

export class VacancyStatus {
  name: keyof typeof VacancyStatuses;
  localizedName: string;
  color: string;

  constructor(data: VacancyPropDto<keyof typeof VacancyStatuses>) {
    this.name = data.name;
    this.localizedName = data.localizedName ?? this.name;
    this.color = VacancyStatusColor[this.name] ?? 'default';
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