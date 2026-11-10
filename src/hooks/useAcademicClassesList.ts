import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";

import { getAcademicClasses } from "../services/academicClassService";
import { parseApiError } from "../utils/apiError";
import type { PaginationMeta } from "../types/api.types";
import type { AcademicClassItem } from "../types/academicClass.types";

// Same request pattern as the other lists: one request per distinct query,
// older requests cancelled, results tagged with the query they belong to.

export interface AcademicClassesQuery {
    search: string;
    isActive: boolean | null; // null = all
    page: number;
    perPage: number;
}

interface AcademicClassesResult {
    key: string;
    classes: AcademicClassItem[];
    pagination: PaginationMeta | null;
    error: string | null;
}

export const useAcademicClassesList = ({ search, isActive, page, perPage }: AcademicClassesQuery) => {

    const [reloadToken, setReloadToken] = useState(0);

    const [result, setResult] = useState<AcademicClassesResult | null>(null);

    const requestKey = JSON.stringify({ search, isActive, page, perPage, reloadToken });

    useEffect(() => {
        const controller = new AbortController();

        getAcademicClasses(
            {
                search: search || undefined,
                is_active: isActive ?? undefined,
                page,
                per_page: perPage,
            },
            controller.signal
        )
            .then((response) => {
                if (controller.signal.aborted) return;

                setResult({
                    key: requestKey,
                    classes: response.data,
                    pagination: response.pagination,
                    error: null,
                });
            })
            .catch((error: unknown) => {
                if (controller.signal.aborted) return;

                const { status, message } = parseApiError(error);

                if (status !== 401) {
                    toast.error(message, { toastId: "academic-classes-list-error" });
                }

                setResult((previous) => ({
                    key: requestKey,
                    classes: [],
                    pagination: previous?.pagination ?? null,
                    error: message,
                }));
            });

        return () => controller.abort();
    }, [search, isActive, page, perPage, requestKey]);

    const retry = useCallback(() => setReloadToken((token) => token + 1), []);

    const isCurrent = result?.key === requestKey;

    return {
        classes: result?.classes ?? [],
        pagination: result?.pagination ?? null,
        error: isCurrent ? result.error : null,
        isLoading: !isCurrent,
        hasLoaded: result !== null,
        retry,
    };
};
