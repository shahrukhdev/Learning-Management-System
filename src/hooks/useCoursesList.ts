import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";

import { getCourses } from "../services/courseService";
import { parseApiError } from "../utils/apiError";
import type { PaginationMeta } from "../types/api.types";
import type { CourseItem } from "../types/course.types";

// Same request pattern as the other lists: one request per distinct query,
// older requests cancelled, results tagged with the query they belong to.

export interface CoursesQuery {
    search: string;
    isActive: boolean | null; // null = all
    page: number;
    perPage: number;
}

interface CoursesResult {
    key: string;
    courses: CourseItem[];
    pagination: PaginationMeta | null;
    error: string | null;
}

export const useCoursesList = ({ search, isActive, page, perPage }: CoursesQuery) => {

    const [reloadToken, setReloadToken] = useState(0);

    const [result, setResult] = useState<CoursesResult | null>(null);

    const requestKey = JSON.stringify({ search, isActive, page, perPage, reloadToken });

    useEffect(() => {
        const controller = new AbortController();

        getCourses(
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
                    courses: response.data,
                    pagination: response.pagination,
                    error: null,
                });
            })
            .catch((error: unknown) => {
                if (controller.signal.aborted) return;

                const { status, message } = parseApiError(error);

                if (status !== 401) {
                    toast.error(message, { toastId: "courses-list-error" });
                }

                setResult((previous) => ({
                    key: requestKey,
                    courses: [],
                    pagination: previous?.pagination ?? null,
                    error: message,
                }));
            });

        return () => controller.abort();
    }, [search, isActive, page, perPage, requestKey]);

    const retry = useCallback(() => setReloadToken((token) => token + 1), []);

    const isCurrent = result?.key === requestKey;

    return {
        courses: result?.courses ?? [],
        pagination: result?.pagination ?? null,
        error: isCurrent ? result.error : null,
        isLoading: !isCurrent,
        hasLoaded: result !== null,
        retry,
    };
};
