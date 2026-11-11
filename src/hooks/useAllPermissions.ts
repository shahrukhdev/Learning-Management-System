import { useCallback, useEffect, useState } from "react";

import { loadAllPermissions } from "../services/permissionService";
import { parseApiError } from "../utils/apiError";
import type { PermissionListItem } from "../types/permission.types";

// Every permission (all pages), for the role permission matrix. Shared via
// loadAllPermissions, so Create Role and Edit Role do not refetch it.
export const useAllPermissions = () => {

    const [reloadToken, setReloadToken] = useState(0);

    const [state, setState] = useState<{
        token: number;
        permissions: PermissionListItem[];
        error: string | null;
    } | null>(null);

    useEffect(() => {
        let isActive = true;

        loadAllPermissions()
            .then((permissions) => {
                if (isActive) setState({ token: reloadToken, permissions, error: null });
            })
            .catch((error: unknown) => {
                if (!isActive) return;

                const { message } = parseApiError(error);

                setState({ token: reloadToken, permissions: [], error: message });
            });

        return () => {
            isActive = false;
        };
    }, [reloadToken]);

    const retry = useCallback(() => setReloadToken((token) => token + 1), []);

    const isCurrent = state?.token === reloadToken;

    return {
        permissions: isCurrent ? state.permissions : [],
        isLoading: !isCurrent,
        error: isCurrent ? state.error : null,
        retry,
    };
};
