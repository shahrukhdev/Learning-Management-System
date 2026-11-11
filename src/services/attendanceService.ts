import api from "../api/api";
import type {
    AttendanceOverviewParams,
    AttendanceOverviewRecord,
    AttendanceOverviewResponse,
    AttendanceStatus,
    ClassAttendanceParams,
    ClassAttendanceRecord,
    ClassAttendanceResponse,
    SaveAttendanceRequest,
    SaveAttendanceResponse,
    WeekdayKey,
} from "../types/attendance.types";

// Attendance API. The Bearer token is attached by the api.ts request interceptor.

const STATUSES: AttendanceStatus[] = ["present", "absent", "late", "not-marked"];

export const WEEKDAY_KEYS: WeekdayKey[] = ["mon", "tue", "wed", "thu", "fri"];

// Anything unexpected (null, missing, unknown) is treated as not marked
const toStatus = (value: unknown): AttendanceStatus =>
    STATUSES.includes(value as AttendanceStatus) ? (value as AttendanceStatus) : "not-marked";

const isObject = (value: unknown): value is Record<string, unknown> =>
    typeof value === "object" && value !== null;

const toClassAttendanceRecords = (data: unknown): ClassAttendanceRecord[] =>
    (Array.isArray(data) ? data : [])
        .filter((item): item is Record<string, unknown> => isObject(item) && typeof item.student_id === "number")
        .map((item) => ({
            student_id: item.student_id as number,
            admission_number: typeof item.admission_number === "string" ? item.admission_number : null,
            name: typeof item.name === "string" ? item.name : "",
            image: typeof item.image === "string" ? item.image : null,
            attendance_id: typeof item.attendance_id === "number" ? item.attendance_id : null,
            status: toStatus(item.status),
        }));

// GET /v1/attendances (students of a class with their status on a date)
export const getClassAttendance = async (
    params: ClassAttendanceParams,
    signal?: AbortSignal
): Promise<ClassAttendanceRecord[]> => {
    const response = await api.get<ClassAttendanceResponse>("/v1/attendances", { params, signal });
    return toClassAttendanceRecords(response.data.data);
};

// POST /v1/attendances (marks or updates attendance as a batch). `records` is
// the returned list when it has the same shape as GET, otherwise null (the
// caller then reloads).
export const saveAttendance = async (
    payload: SaveAttendanceRequest
): Promise<{ message: string; records: ClassAttendanceRecord[] | null }> => {
    const response = await api.post<SaveAttendanceResponse>("/v1/attendances", payload);

    const { data, message } = response.data;

    const records = toClassAttendanceRecords(data);

    const looksLikeClassList =
        Array.isArray(data) &&
        records.length === data.length &&
        records.length > 0 &&
        data.every((item) => isObject(item) && "name" in item);

    return { message, records: looksLikeClassList ? records : null };
};

// GET /v1/attendances/overview (Mon-Fri of the week containing week_start)
export const getAttendanceOverview = async (
    params: AttendanceOverviewParams,
    signal?: AbortSignal
): Promise<AttendanceOverviewRecord[]> => {
    const response = await api.get<AttendanceOverviewResponse>("/v1/attendances/overview", { params, signal });

    return (Array.isArray(response.data.data) ? response.data.data : [])
        .filter((item) => isObject(item) && typeof item.student_id === "number")
        .map((item) => {
            const attendance = isObject(item.attendance) ? item.attendance : {};

            return {
                student_id: item.student_id,
                student_name: typeof item.student_name === "string" ? item.student_name : "",
                student_image: typeof item.student_image === "string" ? item.student_image : null,
                attendance: Object.fromEntries(
                    WEEKDAY_KEYS.map((day) => [day, toStatus((attendance as Record<string, unknown>)[day])])
                ) as Record<WeekdayKey, AttendanceStatus>,
                // Shown as returned (never recalculated)
                rate: typeof item.rate === "number" ? item.rate : null,
            };
        });
};
