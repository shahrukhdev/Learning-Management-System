import { useCallback, useEffect, useState } from "react";

import { getUsers } from "../services/userService";
import { getRoleOptions } from "../services/roleService";
import { parseApiError } from "../utils/apiError";
import type { PaginationMeta } from "../types/api.types";
import type { ManagedUser, SortDirection, UserRoleSummary } from "../types/user.types";

// Only these values trigger a request. Role tabs filter locally (see Users page).
export interface UsersQuery {
    search: string;
    // null = not sent (API default: newest first)
    sortDirection: SortDirection | null;
    page: number;
    perPage: number;
}

interface UsersResult {
    key: string; // the query this result belongs to
    users: ManagedUser[];
    pagination: PaginationMeta | null;
    error: string | null;
}

// Adds roles not seen before; returns the same array when nothing is new
const mergeRoles = (
    current: UserRoleSummary[],
    incoming: UserRoleSummary[]
): UserRoleSummary[] => {
    const roleMap = new Map<number, UserRoleSummary>();

    [...current, ...incoming].forEach((role) => {
        roleMap.set(role.id, role);
    });

    return Array.from(roleMap.values()).sort((a, b) => a.id - b.id);
};

const rolesFromUsers = (users: ManagedUser[]): UserRoleSummary[] =>
    users.flatMap((user) =>
        (user.roles ?? []).map(({ id, name }) => ({ id, name }))
    );

export const useUsersList = ({ search, sortDirection, page, perPage }: UsersQuery) => {

    const [reloadToken, setReloadToken] = useState(0);

    const [result, setResult] = useState<UsersResult | null>(null);

    // Every role with a real ID seen so far (from /v1/roles and users' roles)
    const [roles, setRoles] = useState<UserRoleSummary[]>([]);

    const requestKey = JSON.stringify({ search, sortDirection, page, perPage, reloadToken });

    useEffect(() => {
        // Cancels this request if the query changes (or on unmount), so an
        // older response can never overwrite newer results
        const controller = new AbortController();

        getUsers(
            {
                search: search || undefined,
                sort_direction: sortDirection ?? undefined,
                page,
                per_page: perPage,
            },
            controller.signal
        )
            .then((response) => {
                if (controller.signal.aborted) return;

                setResult({
                    key: requestKey,
                    users: response.data,
                    pagination: response.pagination,
                    error: null,
                });

                setRoles((current) => mergeRoles(current, rolesFromUsers(response.data)));
            })
            .catch((error: unknown) => {
                if (controller.signal.aborted) return;

                const { message } = parseApiError(error);

                // Rows are replaced by the error state; the last known
                // pagination is kept so the footer stays stable
                setResult((previous) => ({
                    key: requestKey,
                    users: [],
                    pagination: previous?.pagination ?? null,
                    error: message,
                }));
            });

        return () => controller.abort();
    }, [search, sortDirection, page, perPage, requestKey]);

    // Full role list for the tabs, if the endpoint returns the expected shape.
    // Failure is non-fatal: tabs still fill from the users' own roles.
    useEffect(() => {
        const controller = new AbortController();

        getRoleOptions(controller.signal)
            .then((list) => {
                if (!controller.signal.aborted) {
                    setRoles((current) => mergeRoles(current, list.map(({ id, name }) => ({ id, name }))));
                }
            })
            .catch(() => {
                // Ignored on purpose (see above)
            });

        return () => controller.abort();
    }, []);

    const retry = useCallback(() => setReloadToken((token) => token + 1), []);

    const isCurrent = result?.key === requestKey;

    return {
        // While a new page/search loads, the previous rows stay visible
        users: result?.users ?? [],
        pagination: result?.pagination ?? null,
        error: isCurrent ? result.error : null,
        isLoading: !isCurrent,
        hasLoaded: result !== null,
        roles,
        retry,
    };
};
