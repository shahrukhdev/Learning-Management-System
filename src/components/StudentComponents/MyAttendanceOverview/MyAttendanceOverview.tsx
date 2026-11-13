
import "./MyAttendanceOverview.css";

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

import DashboardBoxStatus from "../../DashboardStatistics/DashboardBoxStatus";
import type {
    AttendancePeriod,
    StudentAttendanceOverview as AttendanceOverviewData,
    StudentAttendanceStatus,
} from "../../../types/studentDashboard.types";

// null = not marked that day
type AttendanceStatus = StudentAttendanceStatus | null;

interface AttendanceData {
    day: string;
    attendance: number;
    status: AttendanceStatus;
    // Tooltip text
    tooltip: string;
}

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

const STATUS_LABELS: Record<StudentAttendanceStatus, string> = {
    present: "Present",
    late: "Late",
    absent: "Absent",
};

// Bars from the API: one per day (present/late = full bar, absent / not
// marked = empty), or one per month sized by that month's attendance rate
const toChartData = (overview: AttendanceOverviewData | null): AttendanceData[] => {
    if (!overview) return [];

    if (overview.months.length > 0) {
        return overview.months.map((month) => ({
            day: month.label,
            attendance: month.attendance_rate,
            // Colour by the month's rate
            status: month.attendance_rate >= 80 ? "present" : month.attendance_rate >= 50 ? "late" : "absent",
            tooltip: `${month.attendance_rate}% (${month.present} present, ${month.late} late, ${month.absent} absent)`,
        }));
    }

    return overview.days.map((day) => ({
        day: day.label,
        status: day.status,
        attendance: day.status === "present" || day.status === "late" ? 100 : 0,
        tooltip: day.status ? STATUS_LABELS[day.status] : "Not marked",
    }));
};

interface StudentAttendanceOverviewProps {
    // From GET /v1/dashboard/student-summary `attendance_overview`
    overview: AttendanceOverviewData | null;
    period: AttendancePeriod;
    onPeriodChange: (period: AttendancePeriod) => void;
    isLoading: boolean;
    error: string | null;
    onRetry: () => void;
}

const StudentAttendanceOverview = ({
    overview,
    period,
    onPeriodChange,
    isLoading,
    error,
    onRetry,
}: StudentAttendanceOverviewProps) => {

    const currentData = toChartData(overview);

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
                        onPeriodChange(e.target.value as AttendancePeriod)
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

            <DashboardBoxStatus
                isLoading={isLoading && currentData.length === 0 && !error}
                error={currentData.length === 0 ? error : null}
                onRetry={onRetry}
                isEmpty={currentData.length === 0}
                emptyText="No attendance records found."
                loadingText="Loading attendance..."
            />

            {/* Attendance Chart */}
            {currentData.length > 0 && (
            <div className={`attendance-chart ${isLoading ? "dashboard-box-refreshing" : ""}`}>

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
                                props.payload.tooltip,
                                period === "3months" ? "Attendance" : "Status",
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
                            {currentData.map((item, index) => (
                                <Cell
                                    key={`${item.day}-${index}`}
                                    fill={getBarColor(item.status)}
                                />
                            ))}
                        </Bar>

                    </BarChart>

                </ResponsiveContainer>

            </div>
            )}

        </div>
    );
};

export default StudentAttendanceOverview;
