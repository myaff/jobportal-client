import { FetchListResponse, FilterParams, PaginationParams, SortParams } from "./common.model";
import Organization, { OrganizationDto } from "./organization.model";
import Tag, { TagDto } from "./tag.model";

export interface VacancyDto {
  id: string;
  title: string;
  description: string;
  date: string;
  tags: TagDto[];
  organization: OrganizationDto;
  status: string;
  type: VacancyTypeDto;
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
export interface VacancyTypeDto {
  name: string;
  description: string;
  localizedName: string;
}

export class VacancyType {
  name: string;
  description: string;
  localizedName: string;

  constructor(data: VacancyTypeDto) {
    this.name = data.name;
    this.description = data.description ?? '';
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

export default class Vacancy {
  id: string;
  title: string;
  description: string;
  date: Date;
  tags: Tag[];
  organization: Organization;
  status: string;
  type: VacancyType;

  constructor(data: VacancyDto) {
    this.id = data.id;
    this.title = data.title;
    this.description = data.description ?? '';
    this.date = new Date(data.date);
    this.tags = data?.tags.map(tag => new Tag(tag));
    this.organization = new Organization(data.organization);
    this.status = data.status;
    this.type = new VacancyType(data.type);
  }

  toString() {
    return this.title;
  }

  toJSON() {
    return JSON.stringify({
      id: this.id,
      title: this.title,
      description: this.description,
      date: this.date.toISOString(),
      tags: this.tags.map(item => item.toJSON()),
      organization: this.organization.toJSON(),
      status: this.status,
      type: this.type.toJSON(),
    })
  }
}