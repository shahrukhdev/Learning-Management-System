import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";

import { getDashboardSummary } from "../services/dashboardService";
import { parseApiError } from "../utils/apiError";
import type { AttendancePeriod, DashboardSummary } from "../types/dashboard.types";

// Dashboard summary: one request on load and one per attendance period
// change (no polling). Older requests are cancelled and results are tagged
// with their period, so a slow response cannot replace a newer one.

interface SummaryResult {
    requestKey: string;
    summary: DashboardSummary | null;
    error: string | null;
}

export const useDashboardSummary = (attendancePeriod: AttendancePeriod) => {

    const [reloadToken, setReloadToken] = useState(0);

    const [result, setResult] = useState<SummaryResult | null>(null);

    // Last successful summary (stays visible while another period loads)
    const [lastSummary, setLastSummary] = useState<DashboardSummary | null>(null);

    const requestKey = `${attendancePeriod}|${reloadToken}`;

    useEffect(() => {
        const controller = new AbortController();

        getDashboardSummary(attendancePeriod, controller.signal)
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
                    toast.error(message, { toastId: "dashboard-summary-error" });
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
