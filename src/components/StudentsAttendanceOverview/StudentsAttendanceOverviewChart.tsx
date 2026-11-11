import "./StudentsAttendanceOverviewChart.css";
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

import DashboardBoxStatus from "../DashboardStatistics/DashboardBoxStatus";
import type { AttendancePeriod, DashboardAttendancePoint } from "../../types/dashboard.types";

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

interface StudentAttendanceOverviewProps {
    // From GET /v1/dashboard/summary `attendance_overview.data`
    data: DashboardAttendancePoint[];
    // Selected period (sent as `attendance_period`)
    period: AttendancePeriod;
    onPeriodChange: (period: AttendancePeriod) => void;
    isLoading: boolean;
    error: string | null;
    onRetry: () => void;
}

const StudentAttendanceOverview = ({
    data,
    period,
    onPeriodChange,
    isLoading,
    error,
    onRetry,
}: StudentAttendanceOverviewProps) => {

    const currentData = data;

    return (
        <div className="student-attendance-overview dashboard-box">

            {/* Header */}
            <div className="dash-box-top">

                <h2 className="dash-box-title">
                    Student Attendance Overview
                </h2>

                <select className="form-select attendance-period" aria-label="Default select example" value={period} 
                    onChange={(e) => {
                        const next = e.target.value as AttendancePeriod;
                        // Only a different period triggers a new request
                        if (next !== period) onPeriodChange(next);
                    }}
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
            <DashboardBoxStatus
                isLoading={isLoading && currentData.length === 0 && !error}
                error={currentData.length === 0 ? error : null}
                onRetry={onRetry}
                isEmpty={currentData.length === 0}
                emptyText="No attendance data for this period."
                loadingText="Loading attendance..."
            />

            {currentData.length > 0 && (
            <div className={`attendance-chart ${isLoading ? "dashboard-box-refreshing" : ""}`} aria-busy={isLoading}>

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
                                (item, index) => (
                                    <Cell
                                        key={`${item.day}-${index}`}
                                        fill={getBarColor(item.attendance)}
                                    />
                                )
                            )}
                        </Bar>

                    </BarChart>
                </ResponsiveContainer>

            </div>
            )}

        </div>
    );
};

export default StudentAttendanceOverview;