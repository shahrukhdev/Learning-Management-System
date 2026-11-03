import { createContext } from "react";

import type { AuthUser } from "../types/auth.types";

export interface AuthContextValue {
    user: AuthUser | null;
    // Save the signed-in user (state + persisted copy)
    setUser: (user: AuthUser) => void;
    // Clear the user (state + persisted copy)
    clearUser: () => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);
