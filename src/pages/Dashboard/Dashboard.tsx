import SEO from "../../components/seo/SEO";
import welcomeBannerImg from "../../assets/images/welcome-banner-img.png";


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
                            <div className="border-wrapper">
                                <div className="content">
                                    <img className="welcome-banner-img" src={welcomeBannerImg} alt="" />
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

                {/* Statistics */}

                {/* Hifz Overview */}

                {/* Announcements */}

                {/* Attendance */}

                {/* Teachers Online */}

                {/* Quran Progress */}

            </section>

        </>
    );
};

export default Dashboard;