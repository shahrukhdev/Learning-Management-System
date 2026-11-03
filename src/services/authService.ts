import api from "../api/api";
import type { LoginRequest, LoginResponse, LogoutResponse } from "../types/auth.types";

export const login = async (payload: LoginRequest): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>("/v1/auth/login", payload);
    return response.data;
};

// Bearer token is attached automatically by the api.ts request interceptor
export const logout = async (): Promise<LogoutResponse> => {
    const response = await api.post<LogoutResponse>("/v1/auth/logout");
    return response.data;
};
