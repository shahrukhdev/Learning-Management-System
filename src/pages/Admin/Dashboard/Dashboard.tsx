import { useState } from "react";
import SEO from "../../../components/Seo/SEO";
import DashboardStats from "../../../components/DashboardStatistics/DashbaordStatistics";
import HifzOverview from "../../../components/HifzOverView/HifzOverview";
import WelcomeBanner from "../../../components/WelcomeBanner/WelcomeBanner";
import StudentAttendanceOverview from "../../../components/StudentsAttendanceOverview/StudentsAttendanceOverviewChart";
import Announcements from "../../../components/Announcements/Announcements";
// Teachers Online is hidden for now (uncomment here and below to restore)
// import TeachersOnline from "../../../components/TeachersOnline/TeachersOnline";
import QuranProgressOverview from "../../../components/QuranProgressOverview/QuranProgressOverview";
import { useDashboardSummary } from "../../../hooks/useDashboardSummary";
import { useAuth } from "../../../hooks/useAuth";
import type { AttendancePeriod } from "../../../types/dashboard.types";

const Dashboard = () => {

    const { user } = useAuth();

    const isTeacher = user?.role === "Teacher"; 

    // Attendance chart period (`attendance_period`; API default 7days)
    const [attendancePeriod, setAttendancePeriod] = useState<AttendancePeriod>("7days");

    // One request on load + one per period change (GET /v1/dashboard/summary)
    const { summary, isLoading, error, retry } = useDashboardSummary(attendancePeriod);

    console.log("User:", user);
console.log("User role:", user?.role);
console.log("Is Teacher:", isTeacher);
console.log("Dashboard summary:", summary);
console.log("Assigned classes:", summary?.assigned_classes);

    // Errors are shown per section only when it has nothing to show
    const sectionProps = { isLoading, error, onRetry: retry };

    return (
        <>
            <SEO
                title="Dashboard - Noor Ul Imaan Masjid"
                description="Manage your Noor Ul Imaan Masjid Madrassah Portal dashboard."
            />

            <section className="dashboard-section">
                <div className="container-fluid">
                    <div className="row">

                        {/* Welcome Banner */}
                        <WelcomeBanner />

                        {/* Statistics */}
                        <div className="col-12">
                            <DashboardStats
                                statistics={summary?.statistics ?? null}
                                assignedClasses={summary?.assigned_classes ?? 0}
                                isTeacher={true}
                                isLoading={isLoading}
                            />
                        </div>

                        <div className="col-12">
                            <div className="">
                                <div className="row">
                                    <div className="col-12 col-lg-8">

                                        {/* Hifz Overview */}
                                        <HifzOverview students={summary?.hifz_overview ?? []} {...sectionProps} />

                                        {/* Attendance */}
                                        <StudentAttendanceOverview
                                            data={summary?.attendance_overview.data ?? []}
                                            period={attendancePeriod}
                                            onPeriodChange={setAttendancePeriod}
                                            {...sectionProps}
                                        />

                                    </div>

                                    <div className="col-12 col-lg-4">

                                        {/* Announcements */}
                                        <Announcements announcements={summary?.announcements ?? []} {...sectionProps} />

                                        {/* Teachers Online */}
                                        {/* <TeachersOnline /> */}

                                        {/* Quran Progress */}
                                        <QuranProgressOverview items={summary?.quran_progress_overview ?? []} {...sectionProps} />

                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

        </>
    );
};

export default Dashboard;