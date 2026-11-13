import api from "../api/api";
import type {
    AttendancePeriod,
    StudentAttendanceCounts,
    StudentAttendanceDay,
    StudentAttendanceMonth,
    StudentAttendanceStatus,
    StudentDashboardSummary,
    StudentManzilStatus,
} from "../types/studentDashboard.types";

// Student dashboard (GET /v1/dashboard/student-summary). The Bearer token is
// attached by the api.ts request interceptor. Missing sections become null;
// values are never invented.

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

const ATTENDANCE_STATUSES: StudentAttendanceStatus[] = ["present", "late", "absent"];

const toStatus = (value: unknown): StudentAttendanceStatus | null => {
    const text = toText(value)?.toLowerCase();
    return ATTENDANCE_STATUSES.find((status) => status === text) ?? null;
};

const toManzilStatus = (value: unknown): StudentManzilStatus | null =>
    value === "on-track" || value === "needs-revision" ? value : null;

const toCounts = (value: unknown): StudentAttendanceCounts | null => {
    if (!isObject(value)) return null;

    return {
        present: toNumber(value.present) ?? 0,
        late: toNumber(value.late) ?? 0,
        absent: toNumber(value.absent) ?? 0,
        attendance_rate: toNumber(value.attendance_rate) ?? 0,
    };
};

const toSummary = (data: RawObject): StudentDashboardSummary => {

    const student = isObject(data.student) ? data.student : null;
    const today = isObject(data.today_attendance) ? data.today_attendance : null;
    const sabaq = isObject(data.new_sabaq) ? data.new_sabaq : null;
    const manzil = isObject(data.manzil) ? data.manzil : null;
    const hifz = isObject(data.hifz_progress) ? data.hifz_progress : null;
    const overview = isObject(data.attendance_overview) ? data.attendance_overview : {};

    const items = (Array.isArray(overview.data) ? overview.data : []).filter(isObject);

    const period = toText(overview.period) ?? "7days";

    // Daily items carry `date`; monthly items carry `month` + counts
    const days: StudentAttendanceDay[] = items
        .filter((item) => item.month === undefined)
        .map((item) => ({
            label: toText(item.label) ?? "",
            date: toText(item.date) ?? "",
            status: toStatus(item.status),
        }));

    const months: StudentAttendanceMonth[] = items
        .filter((item) => item.month !== undefined)
        .map((item) => ({
            label: toText(item.label) ?? "",
            month: toText(item.month) ?? "",
            ...(toCounts(item) as StudentAttendanceCounts),
        }));

    return {
        student: student
            ? {
                name: toText(student.name) ?? "",
                initials: toText(student.initials) ?? "",
                class_name: toText(student.class_name),
                admission_number: toText(student.admission_number),
                image: toText(student.image),
            }
            : null,
        today_attendance: today
            ? { status: toStatus(today.status), marked_at: toText(today.marked_at) }
            : null,
        new_sabaq: sabaq && toText(sabaq.label)
            ? { label: toText(sabaq.label) ?? "", assigned_date: toText(sabaq.assigned_date) }
            : null,
        manzil: manzil && toText(manzil.label)
            ? {
                label: toText(manzil.label) ?? "",
                status: toManzilStatus(manzil.status),
                assigned_date: toText(manzil.assigned_date),
            }
            : null,
        hifz_progress: hifz
            ? {
                memorised_pages: toNumber(hifz.memorised_pages) ?? 0,
                total_pages: toNumber(hifz.total_pages) ?? 0,
                memorised_surahs: toNumber(hifz.memorised_surahs) ?? 0,
                total_surahs: toNumber(hifz.total_surahs) ?? 0,
                percentage: toNumber(hifz.percentage) ?? 0,
                surah_percentage: toNumber(hifz.surah_percentage),
            }
            : null,
        attendance_overview: {
            period,
            days,
            months,
            summary: toCounts(overview.summary),
        },
    };
};

// GET /v1/dashboard/student-summary
export const getStudentDashboardSummary = async (
    attendancePeriod: AttendancePeriod,
    signal?: AbortSignal
): Promise<StudentDashboardSummary> => {

    const response = await api.get<RawObject>("/v1/dashboard/student-summary", {
        params: { attendance_period: attendancePeriod },
        signal,
    });

    return toSummary(isObject(response.data?.data) ? response.data.data : {});
};
