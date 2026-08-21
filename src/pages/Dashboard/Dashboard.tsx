import SEO from "../../components/seo/SEO";
import DashboardStats from "../../components/DashbaordStatistics";

import welcomeBannerImg from "../../assets/images/welcome-banner-img.png";
import { Bell, MoveRight, Plus, Sparkle, SquareCheckBig } from "lucide-react";
import { Link } from "react-router-dom";


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
                        <div className="col-12">
                            <div className="welcome-banner">
                                <div className="welcome-banner-content">
                                    <span className="welcome-banner-badge">
                                        <Sparkle color="#42451C" size={12} strokeWidth={2.2} />
                                        Dashboard Overview
                                    </span>
                                    <h1 className="banner-title">
                                        Assalamu Alaikum, Admin
                                    </h1>
                                    <p className="welcome-banner-text mb-0">
                                        Tuesday, 28 July 2026 — madrassah ki mojooda soorat-e-haal yeh hai
                                    </p>
                                    <div className="welcome-banner-actions">

                                        <button type="button" className="welcome-banner-btn"> 
                                            <SquareCheckBig color="#0E5A3D" size={16} strokeWidth={2.5} />
                                            Mark Attendance
                                        </button>
                                        <button type="button" className="welcome-banner-btn">
                                            <Bell color="#0E5A3D" size={16} strokeWidth={2.5} />
                                            View Notices
                                        </button>

                                    </div>
                                    {/* Decorative Mosque Image */}
                                    <img
                                        className="welcome-banner-img"
                                        src={welcomeBannerImg}
                                        alt=""
                                        aria-hidden="true"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Statistics */}
                        <div className="col-12">
                            <DashboardStats />
                        </div>

                        <div className="col-12">
                            <div className="">
                                <div className="row">
                                    <div className="col-12 col-lg-8">

                                        {/* Hifz Overview */}
                                        <div className="hifz-overview dashboard-box">
                                            <div className="dash-box-top">
                                                <h2 className="dash-box-title">
                                                    Hifz Overview
                                                </h2>
                                                <Link className="view-details-btn" to="/hifz-overview">
                                                    View All
                                                    <MoveRight color="#0F7A47" size={12} strokeWidth={2.2} />
                                                </Link>
                                            </div>
                                        </div>

                                        {/* Attendance */}
                                        <div className="student-attendance-overview dashboard-box">
                                            <div className="dash-box-top">
                                                <h2 className="dash-box-title">
                                                    Student Attendance Overview
                                                </h2>
                                            </div>
                                        </div>

                                    </div>

                                    <div className="col-12 col-lg-4">

                                        {/* Announcements */}
                                        <div className="announcement dashboard-box">
                                            <div className="dash-box-top">
                                                <h2 className="dash-box-title">
                                                    Announcements
                                                </h2>
                                                <button type="button" className="add-btn">
                                                    <Plus color="#33423C" size={20} strokeWidth={2.5} />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Teachers Online */}
                                        <div className="teachers-online dashboard-box">
                                            <div className="dash-box-top">
                                                <h2 className="dash-box-title">
                                                    Teachers Online
                                                </h2>
                                            </div>
                                        </div>

                                        {/* Quran Progress */}
                                        <div className="quran-progress-overview dashboard-box">
                                            <div className="dash-box-top">
                                                <h2 className="dash-box-title">
                                                    Quran Progress Overview
                                                </h2>
                                            </div>
                                        </div>

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