import api from "../api/api";
import type {
    CreatePermissionRequest,
    CreatePermissionResponse,
    DeletePermissionResponse,
    PermissionDetailResponse,
    PermissionListItem,
    PermissionsListParams,
    PermissionsListResponse,
    UpdatePermissionRequest,
    UpdatePermissionResponse,
} from "../types/permission.types";

// GET /v1/permissions/{id}
export const getPermission = async (
    id: number,
    signal?: AbortSignal
): Promise<PermissionDetailResponse> => {
    const response = await api.get<PermissionDetailResponse>(`/v1/permissions/${id}`, { signal });
    return response.data;
};

// PUT /v1/permissions/{id}
export const updatePermission = async (
    id: number,
    payload: UpdatePermissionRequest
): Promise<UpdatePermissionResponse> => {
    const response = await api.put<UpdatePermissionResponse>(`/v1/permissions/${id}`, payload);
    clearAllPermissionsCache();
    return response.data;
};

// DELETE /v1/permissions/{id}
export const deletePermission = async (id: number): Promise<DeletePermissionResponse> => {
    const response = await api.delete<DeletePermissionResponse>(`/v1/permissions/${id}`);
    clearAllPermissionsCache();
    return response.data;
};

// POST /v1/permissions
export const createPermission = async (
    payload: CreatePermissionRequest
): Promise<CreatePermissionResponse> => {
    const response = await api.post<CreatePermissionResponse>("/v1/permissions", payload);
    clearAllPermissionsCache();
    return response.data;
};

// GET /v1/permissions (Permissions Management listing). Pass an AbortSignal so
// superseded requests can be cancelled.
export const getPermissions = async (
    params: PermissionsListParams,
    signal?: AbortSignal
): Promise<PermissionsListResponse> => {

    const query: PermissionsListParams = {};

    if (params.page !== undefined) query.page = params.page;
    if (params.per_page !== undefined) query.per_page = params.per_page;

    const response = await api.get<PermissionsListResponse>("/v1/permissions", {
        params: query,
        signal,
    });

    return response.data;
};

// Largest page the backend allows (fewer requests for the full list)
const ALL_PERMISSIONS_PER_PAGE = 100;

const isPermission = (value: unknown): value is PermissionListItem =>
    typeof value === "object" &&
    value !== null &&
    typeof (value as Record<string, unknown>).id === "number" &&
    typeof (value as Record<string, unknown>).name === "string";

// Every permission (all pages of GET /v1/permissions), for the role
// permission matrix. Page 1 tells how many pages there are; the rest are
// requested together using the pagination metadata.
export const getAllPermissions = async (): Promise<PermissionListItem[]> => {
    const first = await getPermissions({ page: 1, per_page: ALL_PERMISSIONS_PER_PAGE });

    const lastPage = Math.max(first.pagination?.last_page ?? 1, 1);

    const rest = await Promise.all(
        Array.from({ length: lastPage - 1 }, (_, index) =>
            getPermissions({ page: index + 2, per_page: ALL_PERMISSIONS_PER_PAGE })
        )
    );

    // Unique by ID (pages can shift if permissions change meanwhile)
    const byId = new Map<number, PermissionListItem>();

    [first, ...rest].forEach((page) => {
        (Array.isArray(page.data) ? page.data : []).filter(isPermission).forEach((permission) => {
            byId.set(permission.id, permission);
        });
    });

    return [...byId.values()];
};

// Shared across Create Role / Edit Role (requested once). A failed request is
// not cached; creating, updating or deleting a permission clears the cache.
let allPermissionsRequest: Promise<PermissionListItem[]> | null = null;

export const loadAllPermissions = (): Promise<PermissionListItem[]> => {
    if (!allPermissionsRequest) {
        allPermissionsRequest = getAllPermissions().catch((error: unknown) => {
            allPermissionsRequest = null;
            throw error;
        });
    }

    return allPermissionsRequest;
};

export function clearAllPermissionsCache(): void {
    allPermissionsRequest = null;
}
