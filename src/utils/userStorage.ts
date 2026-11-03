import type { AuthUser } from "../types/auth.types";

// Persists the signed-in user's basic info so it survives a page refresh.
// Token storage stays in tokenStorage.ts; this file only handles user info.

const USER_KEY = "auth_user";

const isAuthUser = (value: unknown): value is AuthUser => {
    if (typeof value !== "object" || value === null) return false;

    const user = value as Record<string, unknown>;

    return (
        typeof user.id === "number" &&
        typeof user.name === "string" &&
        typeof user.email === "string" &&
        typeof user.role === "string"
    );
};

export const getStoredUser = (): AuthUser | null => {
    const raw = localStorage.getItem(USER_KEY);

    if (!raw) return null;

    try {
        const parsed: unknown = JSON.parse(raw);
        return isAuthUser(parsed) ? parsed : null;
    } catch {
        return null; // corrupted value
    }
};

export const setStoredUser = (user: AuthUser): void => {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const removeStoredUser = (): void => {
    localStorage.removeItem(USER_KEY);
};
