import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";

import { getClassAttendance } from "../services/attendanceService";
import { parseApiError } from "../utils/apiError";
import type { ClassAttendanceRecord } from "../types/attendance.types";

// Students + statuses for one class on one date. Same request pattern as the
// list hooks: older requests are cancelled and every result is tagged with the
// selection it belongs to, so a slow response never overwrites a newer one.
// No request is made until a class is selected.

interface ClassAttendanceResult {
    selectionKey: string; // class + date
    requestKey: string; // class + date + reload
    records: ClassAttendanceRecord[];
    error: string | null;
}

export const getAttendanceSelectionKey = (classId: number, date: string) => `${classId}|${date}`;

export const useClassAttendance = (classId: number | null, date: string) => {

    const [reloadToken, setReloadToken] = useState(0);

    const [result, setResult] = useState<ClassAttendanceResult | null>(null);

    const selectionKey = classId !== null ? getAttendanceSelectionKey(classId, date) : null;

    const requestKey = selectionKey !== null ? `${selectionKey}|${reloadToken}` : null;

    useEffect(() => {
        if (classId === null || selectionKey === null || requestKey === null) return;

        const controller = new AbortController();

        getClassAttendance({ academic_class_id: classId, attendance_date: date }, controller.signal)
            .then((records) => {
                if (controller.signal.aborted) return;

                setResult({ selectionKey, requestKey, records, error: null });
            })
            .catch((error: unknown) => {
                if (controller.signal.aborted) return;

                const { status, message } = parseApiError(error);

                if (status !== 401) {
                    toast.error(message, { toastId: "class-attendance-error" });
                }

                setResult({ selectionKey, requestKey, records: [], error: message });
            });

        return () => controller.abort();
    }, [classId, date, selectionKey, requestKey]);

    const reload = useCallback(() => setReloadToken((token) => token + 1), []);

    // Show saved records straight away (only if that selection is still shown)
    const replaceRecords = useCallback((forSelectionKey: string, records: ClassAttendanceRecord[]) => {
        setResult((previous) =>
            previous && previous.selectionKey === forSelectionKey
                ? { ...previous, records, error: null }
                : previous
        );
    }, []);

    // Records of the current class/date (a reload keeps them visible, dimmed)
    const isSameSelection = selectionKey !== null && result?.selectionKey === selectionKey;

    const isCurrent = requestKey !== null && result?.requestKey === requestKey;

    return {
        records: isSameSelection ? result.records : [],
        error: isCurrent ? result.error : null,
        isLoading: selectionKey !== null && !isCurrent,
        hasLoaded: isSameSelection,
        selectionKey,
        reload,
        replaceRecords,
    };
};
