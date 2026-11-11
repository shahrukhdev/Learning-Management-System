import type { ApiSuccessResponse } from "./api.types";

export interface LoginRequest {
    email: string;
    password: string;
}

export interface AuthenticatedUser {
    id: number;
    name: string;
    email: string;
    phone_no: string | null;
    is_active: number;
    image: string | null;
    role: string;
}

// The subset of user info kept in AuthContext (and persisted for refresh)
export type AuthUser = Pick<AuthenticatedUser, "id" | "name" | "email" | "phone_no" | "role" | "image">;

export interface LoginResponseData {
    user: AuthenticatedUser;
    token: string;
}

export type LoginResponse = ApiSuccessResponse<LoginResponseData>;

export interface LogoutResponse {
    status: boolean;
    message: string;
}

// POST /v1/auth/forgot-password
export interface ForgotPasswordRequest {
    email: string;
}

export interface ForgotPasswordResponse {
    success: boolean;
    message: string;
}

export type ForgotPasswordFormErrors = Partial<Record<keyof ForgotPasswordRequest, string>>;

export type LoginFormErrors = Partial<Record<keyof LoginRequest, string>>;

// POST /v1/auth/reset-password (email + token come from the reset link)
export interface ResetPasswordRequest {
    email: string;
    token: string;
    password: string;
    password_confirmation: string;
}

export interface ResetPasswordResponse {
    success: boolean;
    message: string;
}

export type ResetPasswordFormErrors = Partial<Record<"password" | "password_confirmation", string>>;
