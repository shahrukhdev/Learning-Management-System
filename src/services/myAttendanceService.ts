import api from "../api/api";
import type {
    MyAttendance,
    MyAttendancePeriod,
    MyAttendanceRecord,
    MyAttendanceStatus,
} from "../types/myAttendance.types";

// Student's own attendance (GET /v1/attendances/my-attendance). The Bearer
// token is attached by the api.ts request interceptor.

type RawObject = Record<string, unknown>;

const isObject = (value: unknown): value is RawObject =>
    typeof value === "object" && value !== null && !Array.isArray(value);

const toNumber = (value: unknown): number | null => {
    if (typeof value === "number" && Number.isFinite(value)) return value;
    if (typeof value === "string" && value.trim() !== "" && Number.isFinite(Number(value))) return Number(value);
    return null;
};

const toText = (value: unknown): string | null =>
    typeof value === "string" && value.trim() !== "" ? value : null;

const STATUSES: MyAttendanceStatus[] = ["present", "late", "absent"];

const toStatus = (value: unknown): MyAttendanceStatus | null => {
    const text = toText(value)?.toLowerCase();
    return STATUSES.find((status) => status === text) ?? null;
};

// Rows without an id, date or known status are skipped (never invented)
const toRecord = (item: RawObject): MyAttendanceRecord | null => {
    const id = toNumber(item.id);
    const date = toText(item.date);
    const status = toStatus(item.status);

    if (id === null || !date || !status) return null;

    return {
        id,
        date,
        day: toText(item.day) ?? "",
        status,
        class_name: toText(item.class_name),
        marked_at: toText(item.marked_at),
    };
};

// GET /v1/attendances/my-attendance
export const getMyAttendance = async (
    period: MyAttendancePeriod,
    signal?: AbortSignal
): Promise<MyAttendance> => {

    const response = await api.get<RawObject>("/v1/attendances/my-attendance", {
        params: { period },
        signal,
    });

    const data = isObject(response.data?.data) ? response.data.data : {};

    const summary = isObject(data.summary) ? data.summary : {};

    const records = (Array.isArray(data.records) ? data.records : [])
        .filter(isObject)
        .map(toRecord)
        .filter((record): record is MyAttendanceRecord => record !== null);

    return {
        period: toText(data.period) ?? period,
        start_date: toText(data.start_date),
        end_date: toText(data.end_date),
        summary: {
            total_classes: toNumber(summary.total_classes) ?? 0,
            present: toNumber(summary.present) ?? 0,
            late: toNumber(summary.late) ?? 0,
            absent: toNumber(summary.absent) ?? 0,
            attendance_rate: toNumber(summary.attendance_rate) ?? 0,
        },
        records,
    };
};
