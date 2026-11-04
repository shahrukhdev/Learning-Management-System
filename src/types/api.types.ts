// Shared API response shapes (Laravel backend)

// Successful responses use `status: true`
export interface ApiSuccessResponse<T> {
    status: boolean;
    message: string;
    data: T;
}

// Pagination metadata returned by paginated list endpoints
export interface PaginationMeta {
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
    has_more_pages: boolean;
}

// Field name -> list of messages, e.g. { email: ["The email field is required."] }
export type ValidationErrors = Record<string, string[]>;

// Error responses use `success: false`
export interface ApiErrorResponse {
    success: false;
    message: string;
    // Laravel sends an object for 422, but an empty array `[]` for e.g. 401
    errors?: ValidationErrors | never[] | null;
}
