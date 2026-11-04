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

export interface RolesListParams {
    search?: string;
    page?: number;
    per_page?: number; // backend default 10, max 100
}
