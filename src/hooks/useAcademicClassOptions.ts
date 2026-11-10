import { useCallback, useEffect, useState } from "react";

import { getAcademicClassOptions } from "../services/academicClassService";
import { parseApiError } from "../utils/apiError";
import type { CourseClassSummary } from "../types/course.types";

// Academic class options for the course form (one request per form mount)
export const useAcademicClassOptions = () => {

    const [reloadToken, setReloadToken] = useState(0);

    const [state, setState] = useState<{
        token: number;
        classes: CourseClassSummary[];
        error: string | null;
    } | null>(null);

    useEffect(() => {
        const controller = new AbortController();

        getAcademicClassOptions(controller.signal)
            .then((classes) => {
                if (!controller.signal.aborted) setState({ token: reloadToken, classes, error: null });
            })
            .catch((error: unknown) => {
                if (controller.signal.aborted) return;

                const { message } = parseApiError(error);

                setState({ token: reloadToken, classes: [], error: message });
            });

        return () => controller.abort();
    }, [reloadToken]);

    const retry = useCallback(() => setReloadToken((token) => token + 1), []);

    const isCurrent = state?.token === reloadToken;

    return {
        classes: state?.classes ?? [],
        isLoading: !isCurrent,
        error: isCurrent ? state.error : null,
        retry,
    };
};
