import api from "../api/api";
import type {
    CreatePermissionRequest,
    CreatePermissionResponse,
    DeletePermissionResponse,
    PermissionDetailResponse,
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
    return response.data;
};

// DELETE /v1/permissions/{id}
export const deletePermission = async (id: number): Promise<DeletePermissionResponse> => {
    const response = await api.delete<DeletePermissionResponse>(`/v1/permissions/${id}`);
    return response.data;
};

// POST /v1/permissions
export const createPermission = async (
    payload: CreatePermissionRequest
): Promise<CreatePermissionResponse> => {
    const response = await api.post<CreatePermissionResponse>("/v1/permissions", payload);
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
