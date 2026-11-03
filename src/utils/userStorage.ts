import type { AuthUser } from "../types/auth.types";

// Persists the signed-in user's basic info so it survives a page refresh.
// Token storage stays in tokenStorage.ts; this file only handles user info.

const USER_KEY = "auth_user";

// Validates a parsed value and returns a clean AuthUser, or null if invalid
const toAuthUser = (value: unknown): AuthUser | null => {
    if (typeof value !== "object" || value === null) return null;

    const user = value as Record<string, unknown>;

    const isValid =
        typeof user.id === "number" &&
        typeof user.name === "string" &&
        typeof user.email === "string" &&
        typeof user.role === "string" &&
        // Missing phone_no is allowed (records saved before it was added)
        (typeof user.phone_no === "string" ||
            user.phone_no === null ||
            user.phone_no === undefined);

    if (!isValid) return null;

    return {
        id: user.id as number,
        name: user.name as string,
        email: user.email as string,
        phone_no: (user.phone_no as string | null | undefined) ?? null,
        role: user.role as string,
    };
};

export const getStoredUser = (): AuthUser | null => {
    const raw = localStorage.getItem(USER_KEY);

    if (!raw) return null;

    try {
        return toAuthUser(JSON.parse(raw));
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
