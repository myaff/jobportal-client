export interface PaginationParams {
  page: number;
  limit: number;
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

export interface ValidationError {
  property: string;
  error: { [key: string]: string };
}

export interface ResponseError {
  statusCode: number;
  message: string;
  errors?: ValidationError[];
}