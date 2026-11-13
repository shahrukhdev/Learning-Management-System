import { CalendarDays, CheckCircle2, Clock3, XCircle } from "lucide-react";

import type { AttendanceStatsProps, AttendancePeriod } from "../AttendanceHistoryTable/Attendance.types";

import "./AttendanceStats.css";

// --------------------------------------------------
// Period Label
// --------------------------------------------------

const getPeriodLabel = (period: AttendancePeriod): string => {
    switch (period) {
        case "7days":
            return "Last 7 Days";

        case "30days":
            return "Last 30 Days";

        case "3months":
            return "Last 3 Months";

        default:
            return "Last 30 Days";
    }
};

// --------------------------------------------------
// Attendance Stats Component
// --------------------------------------------------

const AttendanceStats = ({
    totalClasses,
    presentCount,
    lateCount,
    absentCount,
    period,
}: AttendanceStatsProps) => {
    return (
        <div className="dashboard-stats student-attendance-stats">
            <div className="row">

                {/* Total Classes */}

                <div className="col-12 col-sm-6 col-lg-3">
                    <div className="dash-stat-card">
                        <div className="stat-icon attendance">
                            <CalendarDays size={18} strokeWidth={2.2} />
                        </div>

                        <div className="stat-content">
                            <h3 className="stat-value">
                                {totalClasses}
                            </h3>

                            <div className="stat-bottom d-flex justify-content-between align-items-center gap-2">
                                <span className="stat-title">
                                    Total Classes
                                </span>

                                <span className="stat-change neutral">
                                    {getPeriodLabel(period)}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Present */}

                <div className="col-12 col-sm-6 col-lg-3">
                    <div className="dash-stat-card">
                        <div className="stat-icon students">
                            <CheckCircle2 size={18} strokeWidth={2.2} />
                        </div>

                        <div className="stat-content">
                            <h3 className="stat-value">
                                {presentCount}
                            </h3>

                            <div className="stat-bottom d-flex justify-content-between align-items-center gap-2">
                                <span className="stat-title">
                                    Present
                                </span>

                                <span className="stat-change positive">
                                    Attended
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Late */}

                <div className="col-12 col-sm-6 col-lg-3">
                    <div className="dash-stat-card">
                        <div className="stat-icon sessions">
                            <Clock3 size={18} strokeWidth={2.2} />
                        </div>

                        <div className="stat-content">
                            <h3 className="stat-value">
                                {lateCount}
                            </h3>

                            <div className="stat-bottom d-flex justify-content-between align-items-center gap-2">
                                <span className="stat-title">
                                    Late
                                </span>

                                <span className="stat-change neutral">
                                    Late arrivals
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Absent */}

                <div className="col-12 col-sm-6 col-lg-3">
                    <div className="dash-stat-card">
                        <div className="stat-icon teachers">
                            <XCircle size={18} strokeWidth={2.2} />
                        </div>

                        <div className="stat-content">
                            <h3 className="stat-value">
                                {absentCount}
                            </h3>

                            <div className="stat-bottom d-flex justify-content-between align-items-center gap-2">
                                <span className="stat-title">
                                    Absent
                                </span>

                                <span className="stat-change negative">
                                    Missed classes
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default AttendanceStats;
