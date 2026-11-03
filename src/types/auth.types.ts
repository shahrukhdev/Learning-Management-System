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

// The subset of user info kept in AuthContext (and persisted for refresh)
export type AuthUser = Pick<AuthenticatedUser, "id" | "name" | "email" | "role">;

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
