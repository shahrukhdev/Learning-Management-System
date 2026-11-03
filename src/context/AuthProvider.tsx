import { useCallback, useMemo, useState } from "react";
import type { ReactNode } from "react";

import { AuthContext } from "./AuthContext";
import type { AuthContextValue } from "./AuthContext";
import type { AuthUser } from "../types/auth.types";
import { getToken } from "../utils/tokenStorage";
import { getStoredUser, removeStoredUser, setStoredUser } from "../utils/userStorage";

// Restore the user on app start, but only while a token still exists, so a
// leftover user record can never show without a session.
const getInitialUser = (): AuthUser | null => {
    if (!getToken()) {
        removeStoredUser();
        return null;
    }

    return getStoredUser();
};

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {

    const [user, setUserState] = useState<AuthUser | null>(getInitialUser);

    const setUser = useCallback((nextUser: AuthUser) => {
        setStoredUser(nextUser);
        setUserState(nextUser);
    }, []);

    const clearUser = useCallback(() => {
        removeStoredUser();
        setUserState(null);
    }, []);

    const value = useMemo<AuthContextValue>(
        () => ({ user, setUser, clearUser }),
        [user, setUser, clearUser]
    );

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
