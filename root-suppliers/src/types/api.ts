/**
 * Standard API response metadata for paginated resources
 */
export interface PaginationMetadata {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

/**
 * Basic standard API response structure
 */
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

/**
 * Standard paginated API response structure
 */
export interface PaginatedResponse<T> extends ApiResponse {
  results: T[];
  pagination: PaginationMetadata;
}

/**
 * Internal helper for success responses used by standardize helpers
 */
export interface SuccessResponseData<T = any> {
  [key: string]: T | any;
}
