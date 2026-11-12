import "./WelcomeBanner.css";

import welcomeBannerImg from "../../../assets/images/welcome-banner-img.png";

import {
    Bell,
    BookOpen,
    Sparkle,
} from "lucide-react";

import { Link } from "react-router-dom";

const StudentWelcomeBanner = () => {
    return (
        <div className="student-welcome-banner">
            <div className="student-welcome-content">

                {/* Dashboard Badge */}
                <span className="student-welcome-badge">
                    <Sparkle size={12} strokeWidth={2.2} />
                    Student Dashboard
                </span>

                {/* Welcome Heading */}
                <h1 className="student-banner-title">
                    Assalamu Alaikum, Ahmad
                </h1>

                {/* Student Class */}
                <p className="student-banner-subtitle">
                    Welcome back! <span>Hifz Class 1</span>
                </p>

                {/* Description */}
                <p className="student-banner-description">
                    Tuesday, 28 July 2026 — Continue your Quran learning journey.
                </p>

                {/* Banner Actions */}
                <div className="student-welcome-actions">

                    <Link
                        to="/student/dashboard/hifz"
                        className="student-welcome-btn student-welcome-btn-primary"
                    >
                        <BookOpen size={16} strokeWidth={2.3} />
                        Continue Hifz
                    </Link>

                    <Link
                        to="/student/dashboard/notices"
                        className="student-welcome-btn student-welcome-btn-secondary"
                    >
                        <Bell size={16} strokeWidth={2.3} />
                        View Notices
                    </Link>

                </div>

                {/* Mosque Illustration */}
                <img
                    className="welcome-banner-img"
                    src={welcomeBannerImg}
                    alt=""
                    aria-hidden="true"
                />

            </div>
        </div>
    );
};

export default StudentWelcomeBanner;