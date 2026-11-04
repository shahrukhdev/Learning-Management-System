import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";

import { getPermissions } from "../services/permissionService";
import { parseApiError } from "../utils/apiError";
import type { PaginationMeta } from "../types/api.types";
import type { PermissionListItem } from "../types/permission.types";

// Same request pattern as useRolesList: one request per distinct query,
// older requests cancelled, results tagged with the query they belong to.

export interface PermissionsQuery {
    page: number;
    perPage: number;
}

interface PermissionsResult {
    key: string; // the query this result belongs to
    permissions: PermissionListItem[];
    pagination: PaginationMeta | null;
    error: string | null;
}

export const usePermissionsList = ({ page, perPage }: PermissionsQuery) => {

    const [reloadToken, setReloadToken] = useState(0);

    const [result, setResult] = useState<PermissionsResult | null>(null);

    const requestKey = JSON.stringify({ page, perPage, reloadToken });

    useEffect(() => {
        // Cancels this request if the query changes (or on unmount), so an
        // older response can never overwrite newer results
        const controller = new AbortController();

        getPermissions({ page, per_page: perPage }, controller.signal)
            .then((response) => {
                if (controller.signal.aborted) return;

                setResult({
                    key: requestKey,
                    permissions: response.data,
                    pagination: response.pagination,
                    error: null,
                });
            })
            .catch((error: unknown) => {
                if (controller.signal.aborted) return;

                const { status, message } = parseApiError(error);

                // Toast for the failure (401 is handled globally). The fixed id
                // keeps a retry from stacking duplicate toasts.
                if (status !== 401) {
                    toast.error(message, { toastId: "permissions-list-error" });
                }

                // Rows are replaced by the error state; the last known
                // pagination is kept so the footer stays stable
                setResult((previous) => ({
                    key: requestKey,
                    permissions: [],
                    pagination: previous?.pagination ?? null,
                    error: message,
                }));
            });

        return () => controller.abort();
    }, [page, perPage, requestKey]);

    const retry = useCallback(() => setReloadToken((token) => token + 1), []);

    const isCurrent = result?.key === requestKey;

    return {
        // While a new page loads, the previous rows stay visible
        permissions: result?.permissions ?? [],
        pagination: result?.pagination ?? null,
        error: isCurrent ? result.error : null,
        isLoading: !isCurrent,
        hasLoaded: result !== null,
        retry,
    };
};
