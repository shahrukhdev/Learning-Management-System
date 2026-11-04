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

// POST /v1/users
export interface CreateUserRequest {
    name: string;
    email: string;
    password: string;
    phone_no: string | null;
    is_active?: boolean;
    roles: number[];
}

// The created UserResource is under `data` both for the app's usual
// { success, message, data } envelope and for a plain Laravel resource
// response ({ data }), so `success`/`message` are optional here.
export interface CreateUserResponse {
    success?: boolean;
    message?: string;
    data: ManagedUser;
}

// GET /v1/users/{id}
export interface UserDetailResponse {
    success: boolean;
    message: string;
    data: ManagedUser;
}

// PUT /v1/users/{id}. `password` is only sent when changing it.
export interface UpdateUserRequest {
    name: string;
    email: string;
    password?: string;
    phone_no: string | null;
    is_active: boolean;
    roles: number[];
}

export interface UpdateUserResponse {
    success: boolean;
    message: string;
    data: ManagedUser;
}

// DELETE /v1/users/{id}
export interface DeleteUserResponse {
    success: boolean;
    message: string;
    data: null;
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
