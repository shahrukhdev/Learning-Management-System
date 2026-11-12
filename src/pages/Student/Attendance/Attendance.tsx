
import { useMemo, useState } from "react";

import AttendanceStats from "../../../components/StudentComponents/AttendanceStats/AttendanceStats";
import AttendanceHistoryTable from "../../../components/StudentComponents/AttendanceHistoryTable/AttendanceHistoryTable";

import { attendanceRecords } from "../../../components/StudentComponents/AttendanceHistoryTable/Attendance.data";

import type { AttendancePeriod } from "../../../components/StudentComponents/AttendanceHistoryTable/Attendance.types";

import "./Attendance.css";
import "../../../components/Table/Table.css";
import SEO from "../../../components/Seo/SEO";

// --------------------------------------------------
// Student Attendance Component
// --------------------------------------------------

const Attendance = () => {

    const [period, setPeriod] = useState<AttendancePeriod>("7days");

    // ----------------------------------------------
    // Filter Attendance Records
    // ----------------------------------------------

    const filteredRecords = useMemo(() => {
        const today = new Date();

        today.setHours(23, 59, 59, 999);

        const startDate = new Date(today);

        if (period === "7days") {
            startDate.setDate(today.getDate() - 6);
        } else if (period === "30days") {
            startDate.setDate(today.getDate() - 29);
        } else {
            startDate.setMonth(today.getMonth() - 3);
        }

        startDate.setHours(0, 0, 0, 0);

        return attendanceRecords.filter((record) => {
            const recordDate = new Date(`${record.date}T00:00:00`);

            return recordDate >= startDate && recordDate <= today;
        });
    }, [period]);

    // ----------------------------------------------
    // Attendance Statistics
    // ----------------------------------------------

    const totalClasses = filteredRecords.length;

    const presentCount = filteredRecords.filter(
        (record) => record.status === "present"
    ).length;

    const lateCount = filteredRecords.filter(
        (record) => record.status === "late"
    ).length;

    const absentCount = filteredRecords.filter(
        (record) => record.status === "absent"
    ).length;

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
                    records={filteredRecords}
                    period={period}
                    onPeriodChange={setPeriod}
                />

            </div>

        </>
    );
};

export default Attendance;
