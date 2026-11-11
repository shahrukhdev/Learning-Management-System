import { useCallback, useEffect, useState } from "react";

import { getAcademicClassOptions } from "../services/academicClassService";
import { parseApiError } from "../utils/apiError";
import type { CourseClassSummary } from "../types/course.types";

// Academic class options (Course form, Student class in Add/Edit User).
// One request per mount; with `enabled` false nothing is requested until it
// becomes true.
export const useAcademicClassOptions = (enabled = true) => {

    const [reloadToken, setReloadToken] = useState(0);

    const [state, setState] = useState<{
        token: number;
        classes: CourseClassSummary[];
        error: string | null;
    } | null>(null);

    useEffect(() => {
        if (!enabled) return;

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
    }, [reloadToken, enabled]);

    const retry = useCallback(() => setReloadToken((token) => token + 1), []);

    const isCurrent = state?.token === reloadToken;

    return {
        classes: state?.classes ?? [],
        isLoading: enabled && !isCurrent,
        error: isCurrent ? state.error : null,
        retry,
    };
};
