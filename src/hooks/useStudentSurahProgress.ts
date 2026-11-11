import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";

import { getStudentSurahProgress } from "../services/surahProgressService";
import { parseApiError } from "../utils/apiError";
import type { SurahProgressRecord } from "../types/surahProgress.types";

// Surah progress of the selected student. Every result is tagged with the
// student it belongs to, older requests are cancelled, and records of another
// student are never returned, so switching students never shows stale data.

interface ProgressResult {
    studentId: number;
    requestKey: string;
    records: SurahProgressRecord[];
    error: string | null;
}

export const useStudentSurahProgress = (studentId: number | null) => {

    const [reloadToken, setReloadToken] = useState(0);

    const [result, setResult] = useState<ProgressResult | null>(null);

    const requestKey = studentId !== null ? `${studentId}|${reloadToken}` : null;

    useEffect(() => {
        if (studentId === null || requestKey === null) return;

        const controller = new AbortController();

        getStudentSurahProgress(studentId, controller.signal)
            .then((records) => {
                if (controller.signal.aborted) return;

                setResult({ studentId, requestKey, records, error: null });
            })
            .catch((error: unknown) => {
                if (controller.signal.aborted) return;

                const { status, message } = parseApiError(error);

                if (status !== 401) {
                    toast.error(message, { toastId: "surah-progress-error" });
                }

                setResult({ studentId, requestKey, records: [], error: message });
            });

        return () => controller.abort();
    }, [studentId, requestKey]);

    const reload = useCallback(() => setReloadToken((token) => token + 1), []);

    // Local updates after a successful create/update/delete. Ignored if the
    // tracker has moved on to another student in the meantime.
    const updateRecords = useCallback(
        (forStudentId: number, update: (records: SurahProgressRecord[]) => SurahProgressRecord[]) => {
            setResult((previous) =>
                previous && previous.studentId === forStudentId
                    ? { ...previous, records: update(previous.records) }
                    : previous
            );
        },
        []
    );

    const isSameStudent = studentId !== null && result?.studentId === studentId;

    const isCurrent = requestKey !== null && result?.requestKey === requestKey;

    return {
        records: isSameStudent ? result.records : [],
        error: isCurrent ? result.error : null,
        isLoading: studentId !== null && !isCurrent,
        hasLoaded: isSameStudent && result.error === null,
        reload,
        updateRecords,
    };
};
