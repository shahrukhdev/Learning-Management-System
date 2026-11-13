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
    initials: string;
    email: string;
    phone_no: string | null;
    image: string | null;
    is_active: boolean | number;
    roles: UserRoleSummary[];
    created_at: string;
    // Already formatted by the backend ("Today, 03:45 PM", "-" if never)
    last_login?: string | null;
    // Student users: assigned academic class
    class_id?: number | null;
    // Student users: calendar year (e.g. 2026); null for other roles and
    // for students created before the field existed
    year: number | null;
    // Teacher users: assigned academic class IDs
    class_ids?: number[];
    class?: { id: number; name: string } | null;
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
    // Student role only: one academic class ID
    class_id?: number;
    // Student role only: calendar year (2000 to next year)
    year?: number;
    // Teacher role only: multiple academic class IDs
    class_ids?: number[];
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
    // Student role only: one academic class ID
    class_id?: number;
    // Student role only: calendar year (2000 to next year)
    year?: number;
    // Teacher role only: multiple academic class IDs
    class_ids?: number[];
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
