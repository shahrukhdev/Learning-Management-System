import api from "../api/api";
import type { PermissionsListParams, PermissionsListResponse } from "../types/permission.types";

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
