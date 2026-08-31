export type AttendanceStatus = "present" | "absent" | "late";

export interface StudentsAttendanceOverview {
    studentId: number;
    studentName: string;
    studentImage: string;

    attendance: {
        mon: AttendanceStatus;
        tue: AttendanceStatus;
        wed: AttendanceStatus;
        thu: AttendanceStatus;
        fri: AttendanceStatus;
    };

    rate: number;
}



