import type { ApiSuccessResponse } from "./api.types";

export interface LoginRequest {
    email: string;
    password: string;
}

export interface AuthenticatedUser {
    id: number;
    name: string;
    email: string;
    is_active: number;
    image: string | null;
    role: string;
}

export interface LoginResponseData {
    user: AuthenticatedUser;
    token: string;
}

export type LoginResponse = ApiSuccessResponse<LoginResponseData>;

export interface LogoutResponse {
    status: boolean;
    message: string;
}

export type LoginFormErrors = Partial<Record<keyof LoginRequest, string>>;
