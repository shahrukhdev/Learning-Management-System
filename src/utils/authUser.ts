import type { AuthUser } from "../types/auth.types";

// Any API user shape (login or profile) that carries the AuthContext fields
interface UserSource {
    id: number;
    name: string;
    email: string;
    role: string;
    phone_no?: string | null;
    image?: string | null;
}

// Picks only the fields AuthContext keeps, normalizing missing values to null
export const toAuthUser = (user: UserSource): AuthUser => ({
    id: user.id,
    name: user.name,
    email: user.email,
    phone_no: user.phone_no ?? null,
    role: user.role,
    image: user.image ?? null,
});
