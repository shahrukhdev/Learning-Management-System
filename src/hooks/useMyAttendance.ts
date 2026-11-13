import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";

import { getMyAttendance } from "../services/myAttendanceService";
import { parseApiError } from "../utils/apiError";
import type { MyAttendance, MyAttendancePeriod } from "../types/myAttendance.types";

// Student's own attendance: one request on load and one per period change.
// Older requests are cancelled and results are tagged with their period, so
// a slow response cannot replace a newer one.

interface AttendanceResult {
    requestKey: string;
    attendance: MyAttendance | null;
    error: string | null;
}

export const useMyAttendance = (period: MyAttendancePeriod) => {

    const [reloadToken, setReloadToken] = useState(0);

    const [result, setResult] = useState<AttendanceResult | null>(null);

    const requestKey = `${period}|${reloadToken}`;

    useEffect(() => {
        const controller = new AbortController();

        getMyAttendance(period, controller.signal)
            .then((attendance) => {
                if (controller.signal.aborted) return;
                setResult({ requestKey, attendance, error: null });
            })
            .catch((error: unknown) => {
                if (controller.signal.aborted) return;

                const { status, message } = parseApiError(error);

                // 401 is handled by the api.ts interceptor (sign-out)
                if (status !== 401) {
                    toast.error(message, { toastId: "my-attendance-error" });
                }

                setResult({ requestKey, attendance: null, error: message });
            });

        return () => controller.abort();
    }, [period, requestKey]);

    const retry = useCallback(() => setReloadToken((token) => token + 1), []);

    const isCurrent = result?.requestKey === requestKey;

    return {
        // Only data for the selected period (counts never mix periods)
        attendance: isCurrent ? result.attendance : null,
        error: isCurrent ? result.error : null,
        isLoading: !isCurrent,
        retry,
    };
};
