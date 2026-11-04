import type { PaginationMeta } from "./api.types";

// Role as embedded in each user (GET /v1/users -> data[].roles[])
export interface UserRoleSummary {
    id: number;
    name: string;
    guard_name?: string;
    permissions?: unknown[];
    created_at?: string;
}

// A user row in User Management (GET /v1/users)
export interface ManagedUser {
    id: number;
    name: string;
    email: string;
    phone_no: string | null;
    image: string | null;
    is_active: boolean | number;
    roles: UserRoleSummary[];
    created_at: string;
}

export interface UsersListResponse {
    success: boolean;
    message: string;
    data: ManagedUser[];
    pagination: PaginationMeta;
}

// Backend sorts by `name`
export type SortDirection = "asc" | "desc";

export interface UsersListParams {
    search?: string;
    sort_direction?: SortDirection;
    is_active?: boolean;
    role_id?: number;
    per_page?: number;
    page?: number;
}
