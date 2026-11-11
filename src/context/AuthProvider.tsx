import { useCallback, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";

import { AuthContext } from "./AuthContext";
import type { AuthContextValue } from "./AuthContext";
import type { AuthUser, AuthUserInput } from "../types/auth.types";
import { getProfile } from "../services/profileService";
import { toAuthUser } from "../utils/authUser";
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

// One profile request at a time (shared by every caller)
let profileRequest: Promise<AuthUserInput | null> | null = null;

const fetchProfileUser = (): Promise<AuthUserInput | null> => {
    if (!profileRequest) {
        profileRequest = getProfile()
            .then((response) => toAuthUser(response.data))
            .catch(() => null) // non-fatal: keep the current user
            .finally(() => {
                profileRequest = null;
            });
    }

    return profileRequest;
};

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {

    const [user, setUserState] = useState<AuthUser | null>(getInitialUser);

    // A restored user is refreshed once on load (permissions may have changed)
    const [isSyncingUser, setIsSyncingUser] = useState(() => user !== null);

    const setUser = useCallback((nextUser: AuthUserInput) => {
        setUserState((current) => {
            const merged: AuthUser = {
                ...nextUser,
                // Missing permissions: keep the same user's current ones
                permissions:
                    nextUser.permissions ??
                    (current && current.id === nextUser.id ? current.permissions : []),
            };

            setStoredUser(merged);

            return merged;
        });
    }, []);

    const clearUser = useCallback(() => {
        removeStoredUser();
        setUserState(null);
    }, []);

    const refreshUser = useCallback(async () => {
        if (!getToken()) return;

        const profileUser = await fetchProfileUser();

        // Signed out meanwhile: do not restore the user
        if (profileUser && getToken()) setUser(profileUser);
    }, [setUser]);

    // Bring the stored user (and permissions) up to date after a page load
    useEffect(() => {
        if (!isSyncingUser) return;

        let isActive = true;

        fetchProfileUser().then((profileUser) => {
            if (!isActive) return;

            // Signed out meanwhile: do not restore the user
            if (profileUser && getToken()) setUser(profileUser);

            setIsSyncingUser(false);
        });

        return () => {
            isActive = false;
        };
    }, [isSyncingUser, setUser]);

    const value = useMemo<AuthContextValue>(
        () => ({ user, setUser, clearUser, refreshUser, isSyncingUser }),
        [user, setUser, clearUser, refreshUser, isSyncingUser]
    );

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
