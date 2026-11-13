import "./WelcomeBanner.css";

import { useEffect, useState } from "react";

import welcomeBannerImg from "../../../assets/images/welcome-banner-img.png";

import {
    Bell,
    BookOpen,
    Sparkle,
} from "lucide-react";

import { Link } from "react-router-dom";

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

interface StudentWelcomeBannerProps {
    // Signed-in student's name and class (null = not known yet)
    name: string | null;
    className: string | null;
}

const StudentWelcomeBanner = ({ name, className }: StudentWelcomeBannerProps) => {

    const today = useToday();

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
                    Assalamu Alaikum{name ? `, ${name}` : ""}
                </h1>

                {/* Student Class */}
                <p className="student-banner-subtitle">
                    Welcome back!{className && <> <span>{className}</span></>}
                </p>

                {/* Description */}
                <p className="student-banner-description">
                    {formatBannerDate(today)} — Continue your Quran learning journey.
                </p>

                {/* Banner Actions */}
                <div className="student-welcome-actions">

                    <Link
                        to="/hifz"
                        className="student-welcome-btn student-welcome-btn-primary"
                    >
                        <BookOpen size={16} strokeWidth={2.3} />
                        Continue Hifz
                    </Link>

                    <Link
                        to="/notices"
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
