
import "./MyAttendanceOverview.css";
import { useState } from "react";

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    ResponsiveContainer,
    Cell,
    Tooltip,
} from "recharts";

type AttendancePeriod = "7days" | "30days" | "3months";

type AttendanceStatus = "present" | "absent" | "late";

interface DailyAttendance {
    day: string;
    status: AttendanceStatus;
}

interface AttendanceData {
    day: string;
    attendance: number;
    status: AttendanceStatus;
}

interface StudentAttendanceRecord {
    studentId: number;
    records: Record<AttendancePeriod, DailyAttendance[]>;
}

// Dummy attendance data for individual students
const studentAttendanceRecords: StudentAttendanceRecord[] = [
    {
        studentId: 1,
        records: {
            "7days": [
                { day: "MON", status: "present" },
                { day: "TUE", status: "present" },
                { day: "WED", status: "present" },
                { day: "THU", status: "absent" },
                { day: "FRI", status: "late" },
                { day: "SAT", status: "present" },
                { day: "SUN", status: "absent" },
            ],
            "30days": [
                { day: "01", status: "present" },
                { day: "05", status: "present" },
                { day: "10", status: "absent" },
                { day: "15", status: "late" },
                { day: "20", status: "present" },
                { day: "25", status: "absent" },
                { day: "30", status: "present" },
            ],
            "3months": [
                { day: "JUN", status: "present" },
                { day: "JUL", status: "late" },
                { day: "AUG", status: "absent" },
            ],
        },
    },
    {
        studentId: 2,
        records: {
            "7days": [
                { day: "MON", status: "absent" },
                { day: "TUE", status: "present" },
                { day: "WED", status: "present" },
                { day: "THU", status: "present" },
                { day: "FRI", status: "late" },
                { day: "SAT", status: "present" },
                { day: "SUN", status: "absent" },
            ],
            "30days": [
                { day: "01", status: "absent" },
                { day: "05", status: "present" },
                { day: "10", status: "present" },
                { day: "15", status: "late" },
                { day: "20", status: "present" },
                { day: "25", status: "absent" },
                { day: "30", status: "present" },
            ],
            "3months": [
                { day: "JUN", status: "absent" },
                { day: "JUL", status: "present" },
                { day: "AUG", status: "late" },
            ],
        },
    },
];

const attendancePeriods: {
    value: AttendancePeriod;
    label: string;
}[] = [
    {
        value: "7days",
        label: "Last 7 Days",
    },
    {
        value: "30days",
        label: "Last 30 Days",
    },
    {
        value: "3months",
        label: "Last 3 Months",
    },
];

// Attendance bar colors
const getBarColor = (status: AttendanceStatus): string => {
    switch (status) {
        case "present":
            return "#555D1D";

        case "late":
            return "#A5A58D";

        case "absent":
            return "#C7C6B5";

        default:
            return "#C7C6B5";
    }
};

// Calculate individual attendance
const calculateAttendance = (
    records: DailyAttendance[]
): AttendanceData[] => {
    return records.map((record) => ({
        day: record.day,
        status: record.status,
        attendance: record.status === "absent" ? 0 : 100,
    }));
};

interface StudentAttendanceOverviewProps {
    studentId: number;
}

const StudentAttendanceOverview = ({
    studentId,
}: StudentAttendanceOverviewProps) => {
    const [period, setPeriod] = useState<AttendancePeriod>("7days");

    const student = studentAttendanceRecords.find(
        (item) => item.studentId === studentId
    );

    if (!student) {
        return (
            <div className="student-attendance-overview dashboard-box">
                No attendance records found.
            </div>
        );
    }

    const currentData = calculateAttendance(
        student.records[period]
    );

    return (
        <div className="student-attendance-overview dashboard-box">

            {/* Header */}
            <div className="dash-box-top">

                <h2 className="dash-box-title">
                    My Attendance Overview
                </h2>

                <select
                    className="form-select attendance-period"
                    aria-label="Attendance period"
                    value={period}
                    onChange={(e) =>
                        setPeriod(e.target.value as AttendancePeriod)
                    }
                >
                    {attendancePeriods.map((item) => (
                        <option
                            key={item.value}
                            value={item.value}
                        >
                            {item.label}
                        </option>
                    ))}
                </select>

            </div>

            {/* Attendance Chart */}
            <div className="attendance-chart">

                <ResponsiveContainer width="100%" height={350}>

                    <BarChart
                        data={currentData}
                        margin={{
                            top: 20,
                            right: 10,
                            left: 10,
                            bottom: 10,
                        }}
                    >

                        <CartesianGrid
                            horizontal={true}
                            vertical={false}
                            stroke="#E9E7DD"
                        />

                        <YAxis
                            domain={[0, 100]}
                            hide
                        />

                        <XAxis
                            dataKey="day"
                            axisLine={false}
                            tickLine={false}
                            tick={{
                                fill: "#62665E",
                                fontSize: 10,
                            }}
                            dy={15}
                        />

                        <Tooltip
                            cursor={false}
                            contentStyle={{
                                border: "none",
                                borderRadius: "8px",
                                fontSize: "12px",
                                fontWeight: "500",
                                color: "#3f4350",
                                boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
                                backgroundColor: "#D9D6B6",
                            }}
                            formatter={(_value, _name, props) => [
                                props.payload.status.charAt(0).toUpperCase() +
                                    props.payload.status.slice(1),
                                "Status",
                            ]}
                        />

                        <Bar
                            dataKey="attendance"
                            barSize={30}
                            radius={[
                                7,
                                7,
                                0,
                                0,
                            ]}
                        >
                            {currentData.map((item) => (
                                <Cell
                                    key={item.day}
                                    fill={getBarColor(item.status)}
                                />
                            ))}
                        </Bar>

                    </BarChart>

                </ResponsiveContainer>

            </div>

        </div>
    );
};

export default StudentAttendanceOverview;
