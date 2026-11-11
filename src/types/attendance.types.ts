// Attendance API (Laravel). Dates are always sent as Y-m-d.

export type AttendanceStatus = "present" | "absent" | "late" | "not-marked";

// Statuses that can be submitted ("not-marked" is only an initial state)
export type MarkedAttendanceStatus = Exclude<AttendanceStatus, "not-marked">;

// GET /v1/attendances?academic_class_id=&attendance_date=
export interface ClassAttendanceParams {
    academic_class_id: number;
    attendance_date: string;
}

export interface ClassAttendanceRecord {
    student_id: number;
    admission_number: string | null;
    name: string;
    image: string | null;
    attendance_id: number | null;
    status: AttendanceStatus;
}

export interface ClassAttendanceResponse {
    success: boolean;
    message: string;
    data: ClassAttendanceRecord[];
}

// POST /v1/attendances (batch; the backend uses updateOrCreate)
export interface SaveAttendanceRequest {
    academic_class_id: number;
    attendance_date: string;
    attendances: { student_id: number; status: MarkedAttendanceStatus }[];
}

export interface SaveAttendanceResponse {
    success: boolean;
    message: string;
    data?: unknown;
}

// GET /v1/attendances/overview?academic_class_id=&week_start=
export interface AttendanceOverviewParams {
    academic_class_id: number;
    week_start: string;
}

export type WeekdayKey = "mon" | "tue" | "wed" | "thu" | "fri";

export interface AttendanceOverviewRecord {
    student_id: number;
    student_name: string;
    student_image: string | null;
    attendance: Record<WeekdayKey, AttendanceStatus>;
    rate: number | null;
}

export interface AttendanceOverviewResponse {
    success: boolean;
    message: string;
    data: AttendanceOverviewRecord[];
}
