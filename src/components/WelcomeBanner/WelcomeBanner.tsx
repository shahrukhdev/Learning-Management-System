import "./WelcomeBanner.css"
import welcomeBannerImg from "../../assets/images/welcome-banner-img.png";
import { Bell, Sparkle, SquareCheckBig } from "lucide-react";
import { Link } from "react-router-dom";


const WelcomeBanner = () => {
    return (
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

                        <Link to="/dashboard/attendance" className="welcome-banner-btn">
                            <SquareCheckBig color="#0E5A3D" size={16} strokeWidth={2.5} />
                            Mark Attendance
                        </Link>

                        <Link to="/dashboard/notice" className="welcome-banner-btn">
                            <Bell color="#0E5A3D" size={16} strokeWidth={2.5} />
                            View Notices
                        </Link>

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
    );
};

export default WelcomeBanner;