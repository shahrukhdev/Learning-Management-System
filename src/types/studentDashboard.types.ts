import type { AttendancePeriod } from "./dashboard.types";

// GET /v1/dashboard/student-summary[?attendance_period=7days|30days|3months]
// Student role only; always the signed-in student's own data. Separate from
// the Admin / Teacher summary (dashboard.types.ts) so each can change alone.

export type { AttendancePeriod };

export type StudentAttendanceStatus = "present" | "late" | "absent";

export interface StudentDashboardProfile {
    name: string;
    initials: string;
    class_name: string | null;
    admission_number: string | null;
    image: string | null;
}

export interface StudentTodayAttendance {
    status: StudentAttendanceStatus | null; // null = not marked yet
    marked_at: string | null; // H:i
}

export interface StudentNewSabaq {
    label: string;
    assigned_date: string | null; // Y-m-d
}

export type StudentManzilStatus = "on-track" | "needs-revision";

export interface StudentManzil {
    label: string;
    status: StudentManzilStatus | null;
    assigned_date: string | null; // Y-m-d
}

export interface StudentHifzProgress {
    memorised_pages: number;
    total_pages: number;
    memorised_surahs: number;
    total_surahs: number;
    percentage: number; // pages-based
    surah_percentage: number | null;
}

export interface StudentAttendanceCounts {
    present: number;
    late: number;
    absent: number;
    attendance_rate: number;
}

// 7days / 30days: one item per day
export interface StudentAttendanceDay {
    label: string;
    date: string;
    status: StudentAttendanceStatus | null; // null = not marked
}

// 3months: one item per month with its counts
export interface StudentAttendanceMonth extends StudentAttendanceCounts {
    label: string;
    month: string; // Y-m
}

export interface StudentAttendanceOverview {
    period: AttendancePeriod | string;
    days: StudentAttendanceDay[];
    months: StudentAttendanceMonth[];
    summary: StudentAttendanceCounts | null;
}

export interface StudentDashboardSummary {
    student: StudentDashboardProfile | null;
    today_attendance: StudentTodayAttendance | null;
    new_sabaq: StudentNewSabaq | null;
    manzil: StudentManzil | null;
    hifz_progress: StudentHifzProgress | null;
    attendance_overview: StudentAttendanceOverview;
}
