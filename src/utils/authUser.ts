import type { AuthUserInput } from "../types/auth.types";

// Any API user shape (login or profile) that carries the AuthContext fields
interface UserSource {
    id: number;
    name: string;
    email: string;
    role: string;
    phone_no?: string | null;
    image?: string | null;
    permissions?: unknown;
}

// Permission names from an API response; null when the response has none
// (so AuthContext keeps the permissions it already has)
export const toPermissionNames = (value: unknown): string[] | null =>
    Array.isArray(value)
        ? [...new Set(value.filter((item): item is string => typeof item === "string"))]
        : null;

// Picks only the fields AuthContext keeps, normalizing missing values to null
export const toAuthUser = (user: UserSource): AuthUserInput => {
    const permissions = toPermissionNames(user.permissions);

    return {
        id: user.id,
        name: user.name,
        email: user.email,
        phone_no: user.phone_no ?? null,
        role: user.role,
        image: user.image ?? null,
        ...(permissions ? { permissions } : {}),
    };
};
