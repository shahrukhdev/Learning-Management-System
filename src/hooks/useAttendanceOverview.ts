import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";

import { getAttendanceOverview } from "../services/attendanceService";
import { parseApiError } from "../utils/apiError";
import type { AttendanceOverviewRecord } from "../types/attendance.types";

// Weekly (Mon-Fri) overview for one class. Only requests while `enabled`
// (the Overview tab is open); a result for the same class/week is reused, and
// `invalidate()` (after saving attendance) forces a fresh request.

interface OverviewResult {
    classId: number;
    requestKey: string;
    records: AttendanceOverviewRecord[];
    error: string | null;
}

export const useAttendanceOverview = (classId: number | null, weekStart: string, enabled: boolean) => {

    const [reloadToken, setReloadToken] = useState(0);

    const [result, setResult] = useState<OverviewResult | null>(null);

    const requestKey = classId !== null ? `${classId}|${weekStart}|${reloadToken}` : null;

    const shouldFetch = enabled && requestKey !== null && result?.requestKey !== requestKey;

    useEffect(() => {
        if (!shouldFetch || classId === null || requestKey === null) return;

        const controller = new AbortController();

        getAttendanceOverview({ academic_class_id: classId, week_start: weekStart }, controller.signal)
            .then((records) => {
                if (controller.signal.aborted) return;

                setResult({ classId, requestKey, records, error: null });
            })
            .catch((error: unknown) => {
                if (controller.signal.aborted) return;

                const { status, message } = parseApiError(error);

                if (status !== 401) {
                    toast.error(message, { toastId: "attendance-overview-error" });
                }

                setResult({ classId, requestKey, records: [], error: message });
            });

        return () => controller.abort();
    }, [shouldFetch, classId, weekStart, requestKey]);

    const invalidate = useCallback(() => setReloadToken((token) => token + 1), []);

    const isCurrent = requestKey !== null && result?.requestKey === requestKey;

    // Rows of the same class stay visible (dimmed) while another week loads
    const isSameClass = classId !== null && result?.classId === classId;

    return {
        records: isSameClass ? result.records : [],
        error: isCurrent ? result.error : null,
        isLoading: classId !== null && !isCurrent,
        retry: invalidate,
        invalidate,
    };
};
