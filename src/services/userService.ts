import api from "../api/api";
import type {
    CreateUserRequest,
    CreateUserResponse,
    DeleteUserResponse,
    UpdateUserRequest,
    UpdateUserResponse,
    UserDetailResponse,
    UsersListParams,
    UsersListResponse,
} from "../types/user.types";

// GET /v1/users/{id}
export const getUser = async (id: number, signal?: AbortSignal): Promise<UserDetailResponse> => {
    const response = await api.get<UserDetailResponse>(`/v1/users/${id}`, { signal });
    return response.data;
};

// PUT /v1/users/{id} (the backend route only accepts PUT, not PATCH)
export const updateUser = async (id: number, payload: UpdateUserRequest): Promise<UpdateUserResponse> => {
    const response = await api.put<UpdateUserResponse>(`/v1/users/${id}`, payload);
    return response.data;
};

// DELETE /v1/users/{id}
export const deleteUser = async (id: number): Promise<DeleteUserResponse> => {
    const response = await api.delete<DeleteUserResponse>(`/v1/users/${id}`);
    return response.data;
};

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
