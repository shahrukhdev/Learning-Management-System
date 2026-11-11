import "./DashbaordStatistics.css"
import "./DashboardBoxStatus.css";
import { BookOpen, Clock3, TrendingUp, Users } from "lucide-react";
import type { DashboardStatistics } from "../../types/dashboard.types";

interface DashboardStatsProps {
    // From GET /v1/dashboard/summary `statistics`; null until loaded
    statistics: DashboardStatistics | null;
    isLoading: boolean;
}

const PLACEHOLDER = "—";

// "▲ 3 this month" / "— no change" / "▼ 2% vs last period" (API deltas as-is)
const formatChange = (value: number | null, suffix: string, unit = "") => {
    if (value === null) return { text: "", type: "neutral" };

    if (value > 0) return { text: `▲ ${value}${unit} ${suffix}`, type: "positive" };

    if (value < 0) return { text: `▼ ${Math.abs(value)}${unit} ${suffix}`, type: "negative" };

    return { text: "— no change", type: "neutral" };
};

const show = (value: number | null | undefined, unit = "") =>
    value === null || value === undefined ? PLACEHOLDER : `${value}${unit}`;

const DashboardStats = ({ statistics, isLoading }: DashboardStatsProps) => {

    const items = [
        {
            id: "students",
            title: "Total Students",
            value: show(statistics?.total_students),
            icon: Users,
            iconClass: "students",
            change: formatChange(statistics?.students_added_this_month ?? null, "this month"),
        },
        {
            id: "teachers",
            title: "Teachers",
            value: show(statistics?.total_teachers),
            icon: BookOpen,
            iconClass: "teachers",
            change: formatChange(statistics?.teachers_added_this_month ?? null, "this month"),
        },
        {
            id: "sessions",
            title: "Hifz Sessions Today",
            value: show(statistics?.hifz_sessions_today),
            icon: Clock3,
            iconClass: "sessions",
            change: formatChange(statistics?.sessions_vs_yesterday ?? null, "vs yesterday"),
        },
        {
            id: "attendance",
            title: "Attendance Rate",
            value: show(statistics?.attendance_rate, "%"),
            icon: TrendingUp,
            iconClass: "attendance",
            change: formatChange(statistics?.attendance_change ?? null, "vs last period", "%"),
        },
    ];

    const isFirstLoad = isLoading && statistics === null;

    return (
        <div className="dashboard-stats" aria-busy={isLoading}>
            <div className="row">
                {items.map((stat) => {

                    const Icon = stat.icon;

                    return (
                        <div className="col-12 col-md-6 col-lg-3" key={stat.id}>
                            <div className={`dash-stat-card ${isFirstLoad ? "is-loading" : ""}`}>
                                <div className={`stat-icon ${stat.iconClass}`}>
                                    <Icon
                                        size={18}
                                        strokeWidth={2.2}
                                    />
                                </div>

                                <div className="stat-content">
                                    <h3 className="stat-value">
                                        {stat.value}
                                    </h3>
                                    <div className="stat-bottom d-flex justify-content-between align-items-center gap-2">
                                        <span className="stat-title">
                                            {stat.title}
                                        </span>
                                        <span className={`stat-change ${stat.change.type}`} >
                                            {stat.change.text}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default DashboardStats;
