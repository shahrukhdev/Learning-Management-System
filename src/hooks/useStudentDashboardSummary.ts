import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";

import { getStudentDashboardSummary } from "../services/studentDashboardService";
import { parseApiError } from "../utils/apiError";
import type { AttendancePeriod, StudentDashboardSummary } from "../types/studentDashboard.types";

// Student dashboard: one request on load and one per attendance period
// change (same pattern as useDashboardSummary). Older requests are cancelled
// and results are tagged with their period, so a slow response cannot
// replace a newer one.

interface SummaryResult {
    requestKey: string;
    summary: StudentDashboardSummary | null;
    error: string | null;
}

export const useStudentDashboardSummary = (attendancePeriod: AttendancePeriod) => {

    const [reloadToken, setReloadToken] = useState(0);

    const [result, setResult] = useState<SummaryResult | null>(null);

    // Last successful summary (stays visible while another period loads)
    const [lastSummary, setLastSummary] = useState<StudentDashboardSummary | null>(null);

    const requestKey = `${attendancePeriod}|${reloadToken}`;

    useEffect(() => {
        const controller = new AbortController();

        getStudentDashboardSummary(attendancePeriod, controller.signal)
            .then((summary) => {
                if (controller.signal.aborted) return;

                setResult({ requestKey, summary, error: null });
                setLastSummary(summary);
            })
            .catch((error: unknown) => {
                if (controller.signal.aborted) return;

                const { status, message } = parseApiError(error);

                // 401 is handled by the api.ts interceptor (sign-out)
                if (status !== 401) {
                    toast.error(message, { toastId: "student-dashboard-error" });
                }

                setResult({ requestKey, summary: null, error: message });
            });

        return () => controller.abort();
    }, [attendancePeriod, requestKey]);

    const retry = useCallback(() => setReloadToken((token) => token + 1), []);

    const isCurrent = result?.requestKey === requestKey;

    return {
        summary: isCurrent && result.summary ? result.summary : lastSummary,
        error: isCurrent ? result.error : null,
        isLoading: !isCurrent,
        retry,
    };
};
