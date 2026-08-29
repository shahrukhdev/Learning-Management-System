import "./StudentsAttendanceOverviewChart.css";
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

interface AttendanceData {
    day: string;
    attendance: number;
}

const attendanceData: Record<AttendancePeriod, AttendanceData[]> = {
    "7days": [
        { day: "MON", attendance: 68 },
        { day: "TUE", attendance: 82 },
        { day: "WED", attendance: 72 },
        { day: "THU", attendance: 90 },
        { day: "FRI", attendance: 78 },
        { day: "SAT", attendance: 60 },
        { day: "SUN", attendance: 65 },
    ],

    "30days": [
        { day: "01", attendance: 72 },
        { day: "05", attendance: 80 },
        { day: "10", attendance: 68 },
        { day: "15", attendance: 85 },
        { day: "20", attendance: 74 },
        { day: "25", attendance: 88 },
        { day: "30", attendance: 79 },
    ],

    "3months": [
        { day: "JUN", attendance: 76 },
        { day: "JUL", attendance: 82 },
        { day: "AUG", attendance: 79 },
    ],
};

const getBarColor = (attendance: number): string => {
    if (attendance >= 85) {
        return "#555D1D";
    }

    if (attendance >= 70) {
        return "#A5A58D";
    }

    return "#C7C6B5";
};

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

const StudentAttendanceOverview = () => {

    const [period, setPeriod] = useState<AttendancePeriod>("7days");
    const currentData = attendanceData[period];

    return (
        <div className="student-attendance-overview dashboard-box">

            {/* Header */}
            <div className="dash-box-top">

                <h2 className="dash-box-title">
                    Student Attendance Overview
                </h2>

                <select className="form-select attendance-period" aria-label="Default select example" value={period} 
                    onChange={(e) =>
                    setPeriod(e.target.value as AttendancePeriod)}
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

                <ResponsiveContainer width="100%" height={350} >
                    <BarChart data={currentData}
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
                                backgroundColor: "#D9D6B6"
                            }}
                            formatter={(value) => [
                                `${value}%`,
                                "Attendance",
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
                            {currentData.map(
                                (item) => (
                                    <Cell
                                        key={item.day}
                                        fill={getBarColor(item.attendance)}
                                    />
                                )
                            )}
                        </Bar>

                    </BarChart>
                </ResponsiveContainer>

            </div>

        </div>
    );
};

export default StudentAttendanceOverview;