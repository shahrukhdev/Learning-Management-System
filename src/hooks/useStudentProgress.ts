import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";

import {
    getMyProgressDetails,
    getMyProgressRecords,
    getProgressStudents,
    getStudentProgressDetails,
    getStudentProgressRecords,
    type MyProgressDetails,
} from "../services/studentProgressService";
import { parseApiError } from "../utils/apiError";
import type {
    PaginatedResult,
    ProgressStudentItem,
    StudentProgressDetails,
    StudentProgressRecord,
} from "../types/studentProgress.types";

// Same request pattern as the other lists: one request per distinct query
// (re-renders alone never refetch), older requests cancelled, and results
// tagged with the query they belong to so a stale response is never shown.

interface KeyedResult<T> {
    key: string;
    data: T | null;
    error: string | null;
    status: number | null;
}

const useKeyedRequest = <T>(
    query: unknown,
    load: ((signal: AbortSignal) => Promise<T>) | null,
    toastId: string
) => {
    const [reloadToken, setReloadToken] = useState(0);

    const [result, setResult] = useState<KeyedResult<T> | null>(null);

    const requestKey = JSON.stringify({ query, reloadToken });

    useEffect(() => {
        if (!load) return;

        const controller = new AbortController();

        load(controller.signal)
            .then((data) => {
                if (controller.signal.aborted) return;
                setResult({ key: requestKey, data, error: null, status: null });
            })
            .catch((error: unknown) => {
                if (controller.signal.aborted) return;

                const { status, message } = parseApiError(error);

                // 401 is handled globally; 404 is shown on the page. The fixed
                // id keeps a retry from stacking duplicate toasts.
                if (status !== 401 && status !== 404) {
                    toast.error(message, { toastId });
                }

                setResult((previous) => ({
                    key: requestKey,
                    data: previous?.data ?? null,
                    error: message,
                    status,
                }));
            });

        return () => controller.abort();
        // `load` is rebuilt every render; the request key decides refetches
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [requestKey, load === null]);

    const retry = useCallback(() => setReloadToken((token) => token + 1), []);

    const isCurrent = result?.key === requestKey;

    return {
        // While a new query loads, the previous data stays visible
        data: result?.data ?? null,
        error: isCurrent ? result.error : null,
        errorStatus: isCurrent ? result.status : null,
        isLoading: load !== null && !isCurrent,
        hasLoaded: result !== null,
        retry,
    };
};

// GET /v1/student-progress
export const useProgressStudents = ({ page, perPage }: { page: number; perPage: number }) => {
    const request = useKeyedRequest<PaginatedResult<ProgressStudentItem>>(
        { page, perPage },
        (signal) => getProgressStudents({ page, per_page: perPage }, signal),
        "progress-students-error"
    );

    return {
        students: request.data?.data ?? [],
        pagination: request.data?.pagination ?? null,
        error: request.error,
        isLoading: request.isLoading,
        hasLoaded: request.hasLoaded,
        retry: request.retry,
    };
};

// GET /v1/student-progress/{studentId}. Pass null to skip.
export const useStudentProgressDetails = (studentId: number | null) => {
    const request = useKeyedRequest<StudentProgressDetails & { studentId: number }>(
        { studentId },
        studentId === null
            ? null
            : (signal) =>
                getStudentProgressDetails(studentId, signal).then((details) => ({ ...details, studentId })),
        "student-progress-details-error"
    );

    // Never show another student's details
    const details = request.data && request.data.studentId === studentId ? request.data : null;

    return {
        details,
        error: request.error,
        isNotFound: request.errorStatus === 404,
        isLoading: request.isLoading,
        retry: request.retry,
    };
};

// GET /v1/student-progress/{studentId}/records. Pass null to skip.
export const useStudentProgressRecords = ({
    studentId,
    courseId,
    page,
    perPage,
}: {
    studentId: number | null;
    courseId: number | null;
    page: number;
    perPage: number;
}) => {
    const request = useKeyedRequest<PaginatedResult<StudentProgressRecord> & { studentId: number }>(
        { studentId, courseId, page, perPage },
        studentId === null
            ? null
            : (signal) =>
                getStudentProgressRecords(
                    studentId,
                    { course_id: courseId ?? undefined, page, per_page: perPage },
                    signal
                ).then((result) => ({ ...result, studentId })),
        "student-progress-records-error"
    );

    const data = request.data && request.data.studentId === studentId ? request.data : null;

    return {
        records: data?.data ?? [],
        pagination: data?.pagination ?? null,
        error: request.error,
        isLoading: request.isLoading,
        hasLoaded: data !== null,
        retry: request.retry,
    };
};

/* ================================
   My Progress (signed-in student, read only)
================================ */

// GET /v1/student-progress/my
export const useMyProgressDetails = () => {
    const request = useKeyedRequest<MyProgressDetails>(
        "my-progress",
        (signal) => getMyProgressDetails(signal),
        "my-progress-error"
    );

    return {
        details: request.data,
        error: request.error,
        isLoading: request.isLoading,
        retry: request.retry,
    };
};

// GET /v1/student-progress/my/records
export const useMyProgressRecords = ({
    courseId,
    page,
    perPage,
}: {
    courseId: number | null;
    page: number;
    perPage: number;
}) => {
    const request = useKeyedRequest<PaginatedResult<StudentProgressRecord>>(
        { courseId, page, perPage },
        (signal) => getMyProgressRecords({ course_id: courseId ?? undefined, page, per_page: perPage }, signal),
        "my-progress-records-error"
    );

    return {
        records: request.data?.data ?? [],
        pagination: request.data?.pagination ?? null,
        error: request.error,
        isLoading: request.isLoading,
        hasLoaded: request.hasLoaded,
        retry: request.retry,
    };
};
