import "./WelcomeBanner.css"
import welcomeBannerImg from "../../assets/images/welcome-banner-img.png";
import { Bell, Sparkle, SquareCheckBig } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";

// "Tuesday, 28 July 2026" (weekday, day, full month, year) in local time
const formatBannerDate = (date: Date) =>
    `${date.toLocaleDateString("en-GB", { weekday: "long" })}, ${date.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
    })}`;

// Today's local date; re-renders just after midnight so it never goes stale
const useToday = () => {
    const [today, setToday] = useState(() => new Date());

    useEffect(() => {
        const nextMidnight = new Date(today);
        nextMidnight.setHours(24, 0, 0, 0);

        const timer = window.setTimeout(() => setToday(new Date()), nextMidnight.getTime() - Date.now() + 1000);

        return () => window.clearTimeout(timer);
    }, [today]);

    return today;
};

const WelcomeBanner = () => {

    // Signed-in user's name from AuthContext
    const { user } = useAuth();

    const today = useToday();

    return (
        <div className="col-12">
            <div className="welcome-banner">
                <div className="welcome-banner-content">
                    <span className="welcome-banner-badge">
                        <Sparkle color="#42451C" size={12} strokeWidth={2.2} />
                        Dashboard Overview
                    </span>
                    <h1 className="banner-title">
                        Assalamu Alaikum{user?.name ? `, ${user.name}` : ""}
                    </h1>
                    <p className="welcome-banner-text mb-0">
                        {formatBannerDate(today)}
                    </p>
                    <div className="welcome-banner-actions">

                        <Link to="/attendance" className="welcome-banner-btn">
                            <SquareCheckBig color="#0E5A3D" size={16} strokeWidth={2.5} />
                            Mark Attendance
                        </Link>

                        <Link to="/notices" className="welcome-banner-btn">
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