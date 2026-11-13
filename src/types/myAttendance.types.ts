// GET /v1/attendances/my-attendance?period=7days|30days|3months
// Student role only; always the signed-in student's own attendance.
// Separate from the Admin / Teacher class attendance (attendance.types.ts).

export type MyAttendancePeriod = "7days" | "30days" | "3months";

export type MyAttendanceStatus = "present" | "late" | "absent";

export interface MyAttendanceSummary {
    total_classes: number;
    present: number;
    late: number;
    absent: number;
    attendance_rate: number;
}

// One row per marked day (newest first)
export interface MyAttendanceRecord {
    id: number;
    date: string; // Y-m-d
    day: string; // e.g. "Friday"
    status: MyAttendanceStatus;
    class_name: string | null;
    marked_at: string | null; // H:i
}

export interface MyAttendance {
    period: MyAttendancePeriod | string;
    start_date: string | null;
    end_date: string | null;
    summary: MyAttendanceSummary;
    records: MyAttendanceRecord[];
}
