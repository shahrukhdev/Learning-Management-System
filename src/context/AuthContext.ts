import { createContext } from "react";

import type { AuthUser, AuthUserInput } from "../types/auth.types";

export interface AuthContextValue {
    user: AuthUser | null;
    // Save the signed-in user (state + persisted copy). Without
    // `permissions`, the current user's permissions are kept.
    setUser: (user: AuthUserInput) => void;
    // Clear the user (state + persisted copy)
    clearUser: () => void;
    // Re-read the signed-in user (GET /v1/profile), incl. permissions, e.g.
    // after their role or permissions changed. Never signs the user out
    // itself (a 401 is handled by the api.ts interceptor).
    refreshUser: () => Promise<void>;
    // True while the stored user is being refreshed after a page load
    isSyncingUser: boolean;
}

export const AuthContext = createContext<AuthContextValue | null>(null);
