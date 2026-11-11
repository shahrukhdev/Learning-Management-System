import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";

import { getHifzStatistics } from "../services/hifzStatisticsService";
import { parseApiError } from "../utils/apiError";
import type { HifzStatistics } from "../types/hifzStatistics.types";

// Hifz statistics of the selected student. Results are tagged with the
// student they belong to and older requests are cancelled, so another
// student's numbers are never shown.

interface StatisticsResult {
    studentId: number;
    requestKey: string;
    statistics: HifzStatistics | null;
    error: string | null;
}

export const useHifzStatistics = (studentId: number | null) => {

    const [reloadToken, setReloadToken] = useState(0);

    const [result, setResult] = useState<StatisticsResult | null>(null);

    const requestKey = studentId !== null ? `${studentId}|${reloadToken}` : null;

    useEffect(() => {
        if (studentId === null || requestKey === null) return;

        const controller = new AbortController();

        getHifzStatistics(studentId, controller.signal)
            .then((statistics) => {
                if (controller.signal.aborted) return;

                setResult({ studentId, requestKey, statistics, error: null });
            })
            .catch((error: unknown) => {
                if (controller.signal.aborted) return;

                const { status, message } = parseApiError(error);

                if (status !== 401) {
                    toast.error(message, { toastId: "hifz-statistics-error" });
                }

                setResult({ studentId, requestKey, statistics: null, error: message });
            });

        return () => controller.abort();
    }, [studentId, requestKey]);

    // Called after a Surah progress change
    const reload = useCallback(() => setReloadToken((token) => token + 1), []);

    const isSameStudent = studentId !== null && result?.studentId === studentId;

    const isCurrent = requestKey !== null && result?.requestKey === requestKey;

    return {
        // A refresh keeps the same student's numbers until the new ones arrive
        statistics: isSameStudent ? result.statistics : null,
        error: isCurrent ? result.error : null,
        isLoading: studentId !== null && !isCurrent,
        reload,
    };
};
