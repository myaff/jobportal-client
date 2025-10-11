export interface PaginationParams {
  page: number;
  limit: number;
}

export interface Paginatable {
  totalPages: number;
  totalElements: number;
  page: number;
}

export interface FilterParams {
  query: string;
  [key: string]: string | number | (string | number)[];
}

export interface SortParams {
  sort: string;
  order: 'asc' | 'desc';
}

export type FetchListParams = Partial<PaginationParams & FilterParams & SortParams>;

export type FetchListResponse<T> = Paginatable & { content: T[] };

export interface ValidationError {
  property: string;
  error: { [key: string]: string };
}

export interface ResponseError {
  statusCode: number;
  message: string;
  errors?: ValidationError[];
}

export interface FieldErrorDto {
  code: string;
  field: string;
  message: string;
}

export class FieldError extends Error {
  code: string;
  field: string;
  message: string;

  constructor(data: FieldErrorDto) {
    super();
    this.code = data.code;
    this.field = data.field;
    this.message = data.message;
  }

  static isValid(data: Partial<FieldErrorDto>): data is FieldErrorDto {
    return !!data?.code && !!data?.field && !!data?.message;
  }
}

export class FormError {
  list: FieldError[];

  constructor(errors: FieldErrorDto[] = []) {
    this.list = errors
      .filter(e => FieldError.isValid(e))
      .map(e => new FieldError(e));
  }
}

export type Nullable<T> = T | null;

export interface CommonStatus {
  name: string;
  localizedName: string;
  color: string;
}