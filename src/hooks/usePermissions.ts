import { useCallback, useMemo } from "react";

import { useAuth } from "./useAuth";
import {
    hasAllPermissions as checkAll,
    hasAnyPermission as checkAny,
    hasPermission as checkOne,
} from "../utils/permissions";

const NO_PERMISSIONS: string[] = [];

// Permission checks for components, based on the signed-in user's stored
// permissions (AuthContext). Re-renders whenever those permissions change.
export const usePermissions = () => {

    const { user, isSyncingUser } = useAuth();

    const permissions = user?.permissions ?? NO_PERMISSIONS;

    const hasPermission = useCallback((permission: string) => checkOne(permissions, permission), [permissions]);

    const hasAnyPermission = useCallback((names: readonly string[]) => checkAny(permissions, names), [permissions]);

    const hasAllPermissions = useCallback((names: readonly string[]) => checkAll(permissions, names), [permissions]);

    return useMemo(
        () => ({ permissions, hasPermission, hasAnyPermission, hasAllPermissions, isSyncingUser }),
        [permissions, hasPermission, hasAnyPermission, hasAllPermissions, isSyncingUser]
    );
};
