// GET /v1/dashboard/summary[?attendance_period=7days|30days|3months]
// Values are shown as returned; null = missing from the response.

export type AttendancePeriod = "7days" | "30days" | "3months";

export interface DashboardStatistics {
    total_students: number | null;
    students_added_this_month: number | null;
    total_teachers: number | null;
    teachers_added_this_month: number | null;
    hifz_sessions_today: number | null;
    sessions_vs_yesterday: number | null;
    attendance_rate: number | null;
    attendance_change: number | null;
}

// Max 4 students (limited by the backend)
export interface DashboardHifzStudent {
    student_id: number;
    name: string;
    initials: string;
    memorised_surahs: number | null;
    total_surahs: number | null;
    progress: number | null;
    last_session_date: string | null;
}

export interface DashboardAttendancePoint {
    day: string;
    attendance: number;
}

export interface DashboardAttendanceOverview {
    period: AttendancePeriod | string;
    data: DashboardAttendancePoint[];
}

export type QuranProgressStatus = "on-track" | "needs-attention";

export interface DashboardQuranProgress {
    id: number;
    title: string;
    student_count: number | null;
    progress: number | null;
    status: QuranProgressStatus | null;
}

// Max 3 announcements (limited by the backend)
export interface DashboardAnnouncement {
    id: number;
    title: string;
    message: string;
    created_at: string | null;
}

export interface DashboardSummary {
    statistics: DashboardStatistics;
    hifz_overview: DashboardHifzStudent[];
    attendance_overview: DashboardAttendanceOverview;
    quran_progress_overview: DashboardQuranProgress[];
    announcements: DashboardAnnouncement[];
}

export interface DashboardSummaryResponse {
    success: boolean;
    message: string;
    data?: unknown;
}
