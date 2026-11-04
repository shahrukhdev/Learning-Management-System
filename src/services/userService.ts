import api from "../api/api";
import type {
    CreateUserRequest,
    CreateUserResponse,
    UsersListParams,
    UsersListResponse,
} from "../types/user.types";

// POST /v1/users
export const createUser = async (payload: CreateUserRequest): Promise<CreateUserResponse> => {
    const response = await api.post<CreateUserResponse>("/v1/users", payload);
    return response.data;
};

// GET /v1/users. Pass an AbortSignal so superseded requests can be cancelled.
export const getUsers = async (
    params: UsersListParams,
    signal?: AbortSignal
): Promise<UsersListResponse> => {

    // Drop empty values so they are not sent as e.g. `search=`
    const query: UsersListParams = {};

    if (params.search) query.search = params.search;
    if (params.sort_direction) query.sort_direction = params.sort_direction;
    if (params.is_active !== undefined) query.is_active = params.is_active;
    if (params.role_id !== undefined) query.role_id = params.role_id;
    if (params.per_page !== undefined) query.per_page = params.per_page;
    if (params.page !== undefined) query.page = params.page;

    const response = await api.get<UsersListResponse>("/v1/users", {
        params: query,
        signal,
    });

    return response.data;
};
