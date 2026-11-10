import { useCallback, useEffect, useState } from "react";

import { clearCourseOptionsCache, loadCourseOptions } from "../services/courseService";
import { parseApiError } from "../utils/apiError";
import type { ClassCourseSummary } from "../types/academicClass.types";

// Course options for the class form. Uses the shared cached request, so
// Create/Edit pages (or re-mounts) do not refetch.
export const useCourseOptions = () => {

    const [reloadToken, setReloadToken] = useState(0);

    const [state, setState] = useState<{
        token: number;
        courses: ClassCourseSummary[];
        error: string | null;
    } | null>(null);

    useEffect(() => {
        let ignore = false;

        loadCourseOptions()
            .then((courses) => {
                if (!ignore) setState({ token: reloadToken, courses, error: null });
            })
            .catch((error: unknown) => {
                if (ignore) return;

                const { message } = parseApiError(error);

                setState({ token: reloadToken, courses: [], error: message });
            });

        return () => {
            ignore = true;
        };
    }, [reloadToken]);

    const retry = useCallback(() => {
        clearCourseOptionsCache();
        setReloadToken((token) => token + 1);
    }, []);

    const isCurrent = state?.token === reloadToken;

    return {
        courses: state?.courses ?? [],
        isLoading: !isCurrent,
        error: isCurrent ? state.error : null,
        retry,
    };
};
