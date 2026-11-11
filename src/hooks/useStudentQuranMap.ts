import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";

import { getStudentQuranMap } from "../services/quranMapService";
import { parseApiError } from "../utils/apiError";
import type { StudentQuranMap } from "../types/quranMap.types";

// Quran map + statistics of the selected student (read-only). Tagged with
// the student it belongs to; older requests are cancelled.

interface QuranMapResult {
    studentId: number;
    requestKey: string;
    map: StudentQuranMap | null;
    error: string | null;
}

export const useStudentQuranMap = (studentId: number | null) => {

    const [reloadToken, setReloadToken] = useState(0);

    const [result, setResult] = useState<QuranMapResult | null>(null);

    const requestKey = studentId !== null ? `${studentId}|${reloadToken}` : null;

    useEffect(() => {
        if (studentId === null || requestKey === null) return;

        const controller = new AbortController();

        getStudentQuranMap(studentId, controller.signal)
            .then((map) => {
                if (controller.signal.aborted) return;

                setResult({ studentId, requestKey, map, error: null });
            })
            .catch((error: unknown) => {
                if (controller.signal.aborted) return;

                const { status, message } = parseApiError(error);

                if (status !== 401) {
                    toast.error(message, { toastId: "quran-map-error" });
                }

                setResult({ studentId, requestKey, map: null, error: message });
            });

        return () => controller.abort();
    }, [studentId, requestKey]);

    // Called after a Surah progress change so statuses + statistics stay in sync
    const reload = useCallback(() => setReloadToken((token) => token + 1), []);

    const isSameStudent = studentId !== null && result?.studentId === studentId;

    const isCurrent = requestKey !== null && result?.requestKey === requestKey;

    return {
        // A refresh keeps the same student's map visible until the new one arrives
        map: isSameStudent ? result.map : null,
        error: isCurrent ? result.error : null,
        isLoading: studentId !== null && !isCurrent,
        reload,
    };
};
