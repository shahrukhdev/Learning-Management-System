import type { PaginationMeta } from "./api.types";

// A row in Permissions Management (GET /v1/permissions)
export interface PermissionListItem {
    id: number;
    name: string;
    description: string | null;
    guard_name: string;
    created_at: string;
}

export interface PermissionsListResponse {
    success: boolean;
    message: string;
    data: PermissionListItem[];
    pagination: PaginationMeta;
}

// POST /v1/permissions. Only `name` is sent (description is not submitted).
export interface CreatePermissionRequest {
    name: string;
}

// The created resource is under `data` whether the controller uses the app's
// { success, message, data } envelope or a plain Laravel resource
export interface CreatePermissionResponse {
    success?: boolean;
    message?: string;
    data: PermissionListItem;
}

export interface PermissionsListParams {
    page?: number;
    per_page?: number;
}
