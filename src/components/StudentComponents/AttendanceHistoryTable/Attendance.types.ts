export type AttendanceStatus = "present" | "late" | "absent";

export type AttendancePeriod = "7days" | "30days" | "3months";

export interface StudentAttendanceRecord {
    id: number;
    date: string;
    day: string;
    status: AttendanceStatus;
}

export interface AttendanceStatsProps {
    totalClasses: number;
    presentCount: number;
    lateCount: number;
    absentCount: number;
    period: AttendancePeriod;
}

export interface AttendanceHistoryTableProps {
    records: StudentAttendanceRecord[];
    period: AttendancePeriod;
    onPeriodChange: (period: AttendancePeriod) => void;
}
