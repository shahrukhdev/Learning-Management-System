import axios from "axios";
import type { AxiosError, InternalAxiosRequestConfig } from "axios";

import { getToken, removeToken } from "../utils/tokenStorage";
import { emitUnauthorized } from "../utils/authEvents";
import type { ApiErrorResponse } from "../types/api.types";

export const API_BASE_URL = "https://testportal.alternatesites.com";

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
});

// Attach the Bearer token to every request when one exists
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const token = getToken();

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

// Common error handling. Toasts are NOT shown here (see utils/apiError.ts)
// so callers can decide how to present errors without duplicates.
api.interceptors.response.use(
    (response) => response,
    (error: AxiosError<ApiErrorResponse>) => {
        // A 401 on an authenticated request means the stored token is
        // invalid/expired: drop it and redirect to login (via UnauthorizedRedirect).
        // A 401 from login (no token sent) is just invalid credentials and is
        // left to the caller.
        // The getToken() check makes this fire once even if several requests
        // fail together: only the first one still finds a token to remove.
        if (
            error.response?.status === 401 &&
            error.config?.headers?.Authorization &&
            getToken()
        ) {
            removeToken();
            emitUnauthorized();
        }

        return Promise.reject(error);
    }
);

export default api;
