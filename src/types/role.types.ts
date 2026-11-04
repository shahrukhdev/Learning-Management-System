import type { PaginationMeta } from "./api.types";

// A row in Roles Management (GET /v1/roles)
export interface RoleListItem {
    id: number;
    name: string;
    description: string | null;
    guard_name: string;
    users_count: number;
    permissions: unknown[];
    created_at: string;
}

export interface RolesListResponse {
    success: boolean;
    message: string;
    data: RoleListItem[];
    pagination: PaginationMeta;
}

// POST /v1/roles (permissions are not sent yet)
export interface CreateRoleRequest {
    name: string;
    description?: string; // omitted when empty
}

// The created RoleResource is under `data` whether the controller uses the
// app's { success, message, data } envelope or a plain Laravel resource
export interface CreateRoleResponse {
    success?: boolean;
    message?: string;
    data: RoleListItem;
}

// GET /v1/roles/{id}
export interface RoleDetailResponse {
    success: boolean;
    message: string;
    data: RoleListItem;
}

// PUT /v1/roles/{id} (permissions are not sent yet). An empty description is
// sent as "" so a cleared description is saved (Laravel turns it into null).
export interface UpdateRoleRequest {
    name: string;
    description: string;
}

export interface UpdateRoleResponse {
    success: boolean;
    message: string;
    data: RoleListItem;
}

// DELETE /v1/roles/{id}
export interface DeleteRoleResponse {
    success: boolean;
    message: string;
    data: null;
}

export interface RolesListParams {
    search?: string;
    page?: number;
    per_page?: number; // backend default 10, max 100
}
