import api from "../api/api";
import type { UserRoleSummary } from "../types/user.types";
import type { RolesListParams, RolesListResponse } from "../types/role.types";

// GET /v1/roles (Roles Management listing). Pass an AbortSignal so
// superseded requests can be cancelled.
export const getRoles = async (
    params: RolesListParams,
    signal?: AbortSignal
): Promise<RolesListResponse> => {

    // Drop empty values so they are not sent as e.g. `search=`
    const query: RolesListParams = {};

    if (params.search) query.search = params.search;
    if (params.page !== undefined) query.page = params.page;
    if (params.per_page !== undefined) query.per_page = params.per_page;

    const response = await api.get<RolesListResponse>("/v1/roles", {
        params: query,
        signal,
    });

    return response.data;
};

const isRole = (value: unknown): value is UserRoleSummary => {
    if (typeof value !== "object" || value === null) return false;

    const role = value as Record<string, unknown>;

    return typeof role.id === "number" && typeof role.name === "string";
};

// GET /v1/roles, read-only, used for the User Management role tabs.
// The response shape of this endpoint has not been confirmed, so the payload
// is validated at runtime and only entries with a numeric `id` and a string
// `name` are returned. Anything unexpected results in an empty list.
export const getRoleOptions = async (signal?: AbortSignal): Promise<UserRoleSummary[]> => {
    const response = await api.get<unknown>("/v1/roles", { signal });

    const body = response.data;
    const list =
        typeof body === "object" && body !== null && "data" in body
            ? (body as { data: unknown }).data
            : null;

    return Array.isArray(list) ? list.filter(isRole) : [];
};
