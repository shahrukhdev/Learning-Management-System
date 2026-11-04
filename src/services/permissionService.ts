import api from "../api/api";
import type {
    CreatePermissionRequest,
    CreatePermissionResponse,
    PermissionsListParams,
    PermissionsListResponse,
} from "../types/permission.types";

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
