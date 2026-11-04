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

export interface PermissionsListParams {
    page?: number;
    per_page?: number;
}
