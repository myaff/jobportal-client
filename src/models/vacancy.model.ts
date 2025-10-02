import { FetchListResponse, FilterParams, PaginationParams, SortParams } from "./common.model";
import { OrganizationDto } from "./organization.model";
import { TagDto } from "./tag.model";

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

export interface VacancyTypeDto {
  name: string;
  description: string;
  localizedName: string;
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