import SEO from "../../components/Seo/SEO";
import DashboardStats from "../../components/DashboardStatistics/DashbaordStatistics";
import HifzOverview from "../../components/HifzOverView/HifzOverview";
import WelcomeBanner from "../../components/WelcomeBanner/WelcomeBanner";
import StudentAttendanceOverview from "../../components/StudentsAttendanceOverview/StudentsAttendanceOverviewChart";
import Announcements from "../../components/Announcements/Announcements";
import TeachersOnline from "../../components/TeachersOnline/TeachersOnline";
import QuranProgressOverview from "../../components/QuranProgressOverview/QuranProgressOverview";

const Dashboard = () => {
    return (
        <>
            <SEO
                title="Dashboard | Noor Ul Imaan Masjid"
                description="Manage your Noor Ul Imaan Masjid Madrassah Portal dashboard."
            />

            <section className="dashboard-section">
                <div className="container-fluid">
                    <div className="row">

                        {/* Welcome Banner */}
                        <WelcomeBanner />

                        {/* Statistics */}
                        <div className="col-12">
                            <DashboardStats />
                        </div>

                        <div className="col-12">
                            <div className="">
                                <div className="row">
                                    <div className="col-12 col-lg-8">

                                        {/* Hifz Overview */}
                                        <HifzOverview />

                                        {/* Attendance */}
                                        <StudentAttendanceOverview />

                                    </div>

                                    <div className="col-12 col-lg-4">

                                        {/* Announcements */}
                                        <Announcements />

                                        {/* Teachers Online */}
                                        <TeachersOnline />

                                        {/* Quran Progress */}
                                        <QuranProgressOverview />

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