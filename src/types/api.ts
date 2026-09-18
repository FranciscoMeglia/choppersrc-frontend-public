
export interface ApiFieldError {
  field: string;
  message: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiSuccessEnvelope<T> {
  success: true;
  statusCode: number;
  message: string;
  data: T;
  meta: { pagination: Pagination } | null;
  timestamp: string;
}

export interface ApiErrorEnvelope {
  success: false;
  statusCode: number;
  message: string;
  errors: ApiFieldError[] | null;
  timestamp: string;
}
