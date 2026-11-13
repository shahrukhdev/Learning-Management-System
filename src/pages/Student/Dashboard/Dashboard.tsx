import { useState } from "react";

import Announcements from "../../../components/Announcements/Announcements";
import SEO from "../../../components/Seo/SEO";
import DashboardStats from "../../../components/StudentComponents/DashboardStatistics/DashbaordStatistics";
import StudentWelcomeBanner from "../../../components/StudentComponents/WelcomeBanner/WelcomeBanner";
import StudentAttendanceOverview from "../../../components/StudentComponents/MyAttendanceOverview/MyAttendanceOverview";
import { useAuth } from "../../../hooks/useAuth";
import { useNoticesList } from "../../../hooks/useNoticesList";
import { useStudentDashboardSummary } from "../../../hooks/useStudentDashboardSummary";
import type { AttendancePeriod } from "../../../types/studentDashboard.types";
import "./Dashboard.css";

// Latest notices shown on the dashboard (same count as Admin / Teacher)
const ANNOUNCEMENTS_LIMIT = 3;

// Student dashboard: its own API (GET /v1/dashboard/student-summary), separate
// from the Admin / Teacher summary. Announcements use GET /v1/notices.
const Dashboard = () => {

    const { user } = useAuth();

    // Attendance chart period (`attendance_period`; API default 7days)
    const [attendancePeriod, setAttendancePeriod] = useState<AttendancePeriod>("7days");

    // One request on load + one per period change
    const { summary, isLoading, error, retry } = useStudentDashboardSummary(attendancePeriod);

    // GET /v1/notices (first page, latest 3)
    const notices = useNoticesList({ page: 1, perPage: ANNOUNCEMENTS_LIMIT });

    const announcements = notices.notices.slice(0, ANNOUNCEMENTS_LIMIT).map((notice) => ({
        id: notice.id,
        title: notice.title,
        message: notice.message,
        created_at: notice.created_at,
    }));

    return (
    <>
        <SEO title="Student Dashboard | Noor Ul Imaan Masjid" description="View your learning progress and attendance." />

        <section className="student-dashboard-section">

            <div className="container-fluid">
                <div className="row">

                    <div className="col-12">
                        <StudentWelcomeBanner
                            // Signed-in user's name until the summary arrives
                            name={summary?.student?.name || user?.name || null}
                            className={summary?.student?.class_name ?? null}
                        />
                    </div>

                    <div className="col-12">
                        <DashboardStats summary={summary} isLoading={isLoading} />
                    </div>

                    <div className="col-12 col-lg-8">
                        <StudentAttendanceOverview
                            overview={summary?.attendance_overview ?? null}
                            period={attendancePeriod}
                            onPeriodChange={setAttendancePeriod}
                            isLoading={isLoading}
                            error={error}
                            onRetry={retry}
                        />
                    </div>

                    <div className="col-12 col-lg-4">
                        {/* View only: no "+" button for students */}
                        <Announcements
                            announcements={announcements}
                            isLoading={notices.isLoading}
                            error={notices.error}
                            onRetry={notices.retry}
                            showAddButton={false}
                        />
                    </div>
                </div>
            </div>

        </section>
    </>
    );
};

export default Dashboard;
