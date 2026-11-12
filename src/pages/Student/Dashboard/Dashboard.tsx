import Announcements from "../../../components/Announcements/Announcements";
import SEO from "../../../components/Seo/SEO";
import DashboardStats from "../../../components/StudentComponents/DashboardStatistics/DashbaordStatistics";
import StudentWelcomeBanner from "../../../components/StudentComponents/WelcomeBanner/WelcomeBanner";
import StudentAttendanceOverview from "../../../components/StudentComponents/MyAttendanceOverview/MyAttendanceOverview";
import "./Dashboard.css";

const Dashboard = () => (
    <>
        <SEO title="Student Dashboard | Noor Ul Imaan Masjid" description="View your learning progress and attendance." />

        <section className="student-dashboard-section">

            <div className="container-fluid">
                <div className="row">

                    <div className="col-12">
                        <StudentWelcomeBanner />
                    </div>

                    <div className="col-12">
                        <DashboardStats />
                    </div>

                    <div className="col-12 col-lg-8">
                        <StudentAttendanceOverview studentId={1} />
                    </div>

                    <div className="col-12 col-lg-4">
                        <Announcements showAddButton={false} limit={6} />
                    </div>
                </div>
            </div>

        </section>
    </>
);

export default Dashboard;
