import api from "../api/api";
import type {
    ForgotPasswordRequest,
    ForgotPasswordResponse,
    LoginRequest,
    LoginResponse,
    LogoutResponse,
} from "../types/auth.types";

export const login = async (payload: LoginRequest): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>("/v1/auth/login", payload);
    return response.data;
};

// Bearer token is attached automatically by the api.ts request interceptor
export const logout = async (): Promise<LogoutResponse> => {
    const response = await api.post<LogoutResponse>("/v1/auth/logout");
    return response.data;
};

// POST /v1/auth/forgot-password (sends a password reset link)
export const forgotPassword = async (
    payload: ForgotPasswordRequest
): Promise<ForgotPasswordResponse> => {
    const response = await api.post<ForgotPasswordResponse>("/v1/auth/forgot-password", payload);
    return response.data;
};
