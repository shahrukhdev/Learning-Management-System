import api from "../api/api";
import type {
    AttendancePeriod,
    DashboardAnnouncement,
    DashboardHifzStudent,
    DashboardQuranProgress,
    DashboardSummary,
    DashboardSummaryResponse,
} from "../types/dashboard.types";

// Dashboard summary. The Bearer token is attached by the api.ts request
// interceptor. Missing values become null (never invented).

const isObject = (value: unknown): value is Record<string, unknown> =>
    typeof value === "object" && value !== null;

const toNumber = (value: unknown): number | null => {
    if (typeof value === "number" && Number.isFinite(value)) return value;
    if (typeof value === "string" && value.trim() !== "" && Number.isFinite(Number(value))) return Number(value);
    return null;
};

const toText = (value: unknown): string | null =>
    typeof value === "string" && value.trim() !== "" ? value : null;

const toList = <T,>(value: unknown, map: (item: Record<string, unknown>) => T | null): T[] =>
    (Array.isArray(value) ? value : [])
        .filter(isObject)
        .map(map)
        .filter((item): item is T => item !== null);

const toHifzStudent = (item: Record<string, unknown>): DashboardHifzStudent | null => {
    const id = toNumber(item.student_id);

    if (id === null) return null;

    return {
        student_id: id,
        name: toText(item.name) ?? "",
        initials: toText(item.initials) ?? "",
        memorised_surahs: toNumber(item.memorised_surahs),
        total_surahs: toNumber(item.total_surahs),
        progress: toNumber(item.progress),
        last_session_date: toText(item.last_session_date),
    };
};

const toQuranProgress = (item: Record<string, unknown>): DashboardQuranProgress | null => {
    const id = toNumber(item.id);

    if (id === null) return null;

    return {
        id,
        title: toText(item.title) ?? "",
        student_count: toNumber(item.student_count),
        progress: toNumber(item.progress),
        status: item.status === "on-track" || item.status === "needs-attention" ? item.status : null,
    };
};

const toAnnouncement = (item: Record<string, unknown>): DashboardAnnouncement | null => {
    const id = toNumber(item.id);

    if (id === null) return null;

    return {
        id,
        title: toText(item.title) ?? "",
        message: toText(item.message) ?? "",
        created_at: toText(item.created_at),
    };
};

// GET /v1/dashboard/summary?attendance_period=...
export const getDashboardSummary = async (
    attendancePeriod: AttendancePeriod,
    signal?: AbortSignal
): Promise<DashboardSummary> => {
    const response = await api.get<DashboardSummaryResponse>("/v1/dashboard/summary", {
        params: { attendance_period: attendancePeriod },
        signal,
    });

    const data = isObject(response.data.data) ? response.data.data : {};

    const statistics = isObject(data.statistics) ? data.statistics : {};

    const attendance = isObject(data.attendance_overview) ? data.attendance_overview : {};

    return {
        statistics: {
            total_students: toNumber(statistics.total_students),
            students_added_this_month: toNumber(statistics.students_added_this_month),
            total_teachers: toNumber(statistics.total_teachers),
            teachers_added_this_month: toNumber(statistics.teachers_added_this_month),
            hifz_sessions_today: toNumber(statistics.hifz_sessions_today),
            sessions_vs_yesterday: toNumber(statistics.sessions_vs_yesterday),
            attendance_rate: toNumber(statistics.attendance_rate),
            attendance_change: toNumber(statistics.attendance_change),
        },
        hifz_overview: toList(data.hifz_overview, toHifzStudent),
        attendance_overview: {
            period: toText(attendance.period) ?? attendancePeriod,
            data: toList(attendance.data, (item) => {
                const value = toNumber(item.attendance);
                const day = toText(item.day);
                return value !== null && day !== null ? { day, attendance: value } : null;
            }),
        },
        quran_progress_overview: toList(data.quran_progress_overview, toQuranProgress),
        announcements: toList(data.announcements, toAnnouncement),
    };
};
