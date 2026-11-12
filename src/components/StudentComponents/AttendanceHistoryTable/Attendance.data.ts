
import type { AttendanceStatus, StudentAttendanceRecord } from "./Attendance.types";

// --------------------------------------------------
// Local Date Helper
// --------------------------------------------------

const getLocalDateString = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
};

// --------------------------------------------------
// Create Attendance Records
// --------------------------------------------------

const createAttendanceRecords = (): StudentAttendanceRecord[] => {
    const records: StudentAttendanceRecord[] = [];

    const statuses: AttendanceStatus[] = [
        "present",
        "absent",
        "late",
        "present",
        "absent",
        "late",
        "present",
        "present",
        "late",
        "present",
    ];

    const today = new Date();

    for (let i = 0; i < 90; i++) {
        const date = new Date(today);

        date.setDate(today.getDate() - i);

        // Sunday is a weekly holiday
        if (date.getDay() === 0) {
            continue;
        }

        records.push({
            id: i + 1,
            date: getLocalDateString(date),
            day: date.toLocaleDateString("en-US", {
                weekday: "long",
            }),
            status: statuses[i % statuses.length],
        });
    }

    return records;
};

// --------------------------------------------------
// Export Attendance Data
// --------------------------------------------------

export const attendanceRecords = createAttendanceRecords();
