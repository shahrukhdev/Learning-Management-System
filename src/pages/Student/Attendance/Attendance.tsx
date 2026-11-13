
import { useState } from "react";

import AttendanceStats from "../../../components/StudentComponents/AttendanceStats/AttendanceStats";
import AttendanceHistoryTable from "../../../components/StudentComponents/AttendanceHistoryTable/AttendanceHistoryTable";

import type { AttendancePeriod, StudentAttendanceRecord } from "../../../components/StudentComponents/AttendanceHistoryTable/Attendance.types";

import { useMyAttendance } from "../../../hooks/useMyAttendance";

import "./Attendance.css";
import "../../../components/Table/Table.css";
import SEO from "../../../components/Seo/SEO";

// --------------------------------------------------
// Student Attendance Component
// (GET /v1/attendances/my-attendance; separate from the Admin / Teacher
// class attendance, same /attendance URL)
// --------------------------------------------------

const Attendance = () => {

    const [period, setPeriod] = useState<AttendancePeriod>("7days");

    // One request on load + one per period change
    const { attendance, isLoading, error, retry } = useMyAttendance(period);

    // ----------------------------------------------
    // Attendance Records (newest first, from the API)
    // ----------------------------------------------

    const records: StudentAttendanceRecord[] = (attendance?.records ?? []).map((record) => ({
        id: record.id,
        date: record.date,
        day: record.day,
        status: record.status,
    }));

    // ----------------------------------------------
    // Attendance Statistics (backend summary for the period)
    // ----------------------------------------------

    const summary = attendance?.summary;

    const totalClasses = summary?.total_classes ?? 0;

    const presentCount = summary?.present ?? 0;

    const lateCount = summary?.late ?? 0;

    const absentCount = summary?.absent ?? 0;

    // ----------------------------------------------
    // Render
    // ----------------------------------------------

    return (

        <>

            <SEO
                title="My Attendance | Noor Ul Imaan Masjid"
                description="View your attendance records and track your attendance history."
            />
        
            <div className="student-attendance-page">

                {/* Page Heading */}

                <div className="student-attendance-page-header">
                    <h2 className="section-title">
                        My Attendance
                    </h2>

                    <p className="notices-desc m-0">
                        View your attendance records and track your attendance history.
                    </p>
                </div>

                {/* Attendance Statistics */}

                <AttendanceStats
                    totalClasses={totalClasses}
                    presentCount={presentCount}
                    lateCount={lateCount}
                    absentCount={absentCount}
                    period={period}
                />

                {/* Attendance History Table */}

                <AttendanceHistoryTable
                    records={records}
                    period={period}
                    onPeriodChange={setPeriod}
                    isLoading={isLoading}
                    error={error}
                    onRetry={retry}
                />

            </div>

        </>
    );
};

export default Attendance;
