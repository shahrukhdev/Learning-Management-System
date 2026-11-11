import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";

import { getHifzSessions } from "../services/hifzSessionService";
import { parseApiError } from "../utils/apiError";
import type { HifzSession } from "../types/hifzSession.types";

// Sessions of the selected student, optionally for one date. Results are
// tagged with the student + date they belong to and older requests are
// cancelled, so a slow response never shows under another student or date.

interface SessionsResult {
    selectionKey: string; // student + date
    requestKey: string; // student + date + reload
    sessions: HifzSession[];
    error: string | null;
}

export const useHifzSessions = (studentId: number | null, date: string | null) => {

    const [reloadToken, setReloadToken] = useState(0);

    const [result, setResult] = useState<SessionsResult | null>(null);

    const selectionKey = studentId !== null ? `${studentId}|${date ?? "all"}` : null;

    const requestKey = selectionKey !== null ? `${selectionKey}|${reloadToken}` : null;

    useEffect(() => {
        if (studentId === null || selectionKey === null || requestKey === null) return;

        const controller = new AbortController();

        getHifzSessions(studentId, date, controller.signal)
            .then((sessions) => {
                if (controller.signal.aborted) return;

                setResult({ selectionKey, requestKey, sessions, error: null });
            })
            .catch((error: unknown) => {
                if (controller.signal.aborted) return;

                const { status, message } = parseApiError(error);

                if (status !== 401) {
                    toast.error(message, { toastId: "hifz-sessions-error" });
                }

                setResult({ selectionKey, requestKey, sessions: [], error: message });
            });

        return () => controller.abort();
    }, [studentId, date, selectionKey, requestKey]);

    const reload = useCallback(() => setReloadToken((token) => token + 1), []);

    // Removes a deleted session right away (only for the list it came from)
    const removeSession = useCallback((forStudentId: number, sessionId: number) => {
        setResult((previous) =>
            previous && previous.selectionKey.startsWith(`${forStudentId}|`)
                ? { ...previous, sessions: previous.sessions.filter((session) => session.id !== sessionId) }
                : previous
        );
    }, []);

    const isSameSelection = selectionKey !== null && result?.selectionKey === selectionKey;

    const isCurrent = requestKey !== null && result?.requestKey === requestKey;

    return {
        sessions: isSameSelection ? result.sessions : [],
        error: isCurrent ? result.error : null,
        isLoading: selectionKey !== null && !isCurrent,
        reload,
        removeSession,
    };
};
