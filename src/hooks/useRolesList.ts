import { useCallback, useEffect, useState } from "react";

import { getRoles } from "../services/roleService";
import { parseApiError } from "../utils/apiError";
import type { PaginationMeta } from "../types/api.types";
import type { RoleListItem } from "../types/role.types";

// Same request pattern as useUsersList: one request per distinct query,
// older requests cancelled, results tagged with the query they belong to.

export interface RolesQuery {
    search: string;
    page: number;
    perPage: number;
}

interface RolesResult {
    key: string; // the query this result belongs to
    roles: RoleListItem[];
    pagination: PaginationMeta | null;
    error: string | null;
}

export const useRolesList = ({ search, page, perPage }: RolesQuery) => {

    const [reloadToken, setReloadToken] = useState(0);

    const [result, setResult] = useState<RolesResult | null>(null);

    const requestKey = JSON.stringify({ search, page, perPage, reloadToken });

    useEffect(() => {
        // Cancels this request if the query changes (or on unmount), so an
        // older response can never overwrite newer results
        const controller = new AbortController();

        getRoles(
            {
                search: search || undefined,
                page,
                per_page: perPage,
            },
            controller.signal
        )
            .then((response) => {
                if (controller.signal.aborted) return;

                setResult({
                    key: requestKey,
                    roles: response.data,
                    pagination: response.pagination,
                    error: null,
                });
            })
            .catch((error: unknown) => {
                if (controller.signal.aborted) return;

                const { message } = parseApiError(error);

                // Rows are replaced by the error state; the last known
                // pagination is kept so the footer stays stable
                setResult((previous) => ({
                    key: requestKey,
                    roles: [],
                    pagination: previous?.pagination ?? null,
                    error: message,
                }));
            });

        return () => controller.abort();
    }, [search, page, perPage, requestKey]);

    const retry = useCallback(() => setReloadToken((token) => token + 1), []);

    const isCurrent = result?.key === requestKey;

    return {
        // While a new page/search loads, the previous rows stay visible
        roles: result?.roles ?? [],
        pagination: result?.pagination ?? null,
        error: isCurrent ? result.error : null,
        isLoading: !isCurrent,
        hasLoaded: result !== null,
        retry,
    };
};
