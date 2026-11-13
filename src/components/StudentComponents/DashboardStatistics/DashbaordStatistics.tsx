
import "./DashbaordStatistics.css";

import {
    CalendarCheck,
    BookOpen,
    Repeat,
    TrendingUp,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import type { StudentDashboardSummary } from "../../../types/studentDashboard.types";
import { formatProgressDate } from "../../../utils/studentProgress";

type ChangeType = "positive" | "neutral" | "negative";

interface StatCard {
    id: number;
    title: string;
    value: string;
    icon: LucideIcon;
    iconClass: string;
    change: string;
    changeType: ChangeType;
}

interface DashboardStatsProps {
    // From GET /v1/dashboard/student-summary (null = not loaded yet)
    summary: StudentDashboardSummary | null;
    isLoading: boolean;
}

const STATUS_LABELS = {
    present: "Present",
    late: "Late",
    absent: "Absent",
} as const;

const STATUS_CHANGE_TYPES: Record<keyof typeof STATUS_LABELS, ChangeType> = {
    present: "positive",
    late: "neutral",
    absent: "negative",
};

// Local today (Y-m-d), to say "Assigned today"
const todayYmd = () => new Date().toLocaleDateString("en-CA");

const assignedText = (date: string | null) => {
    if (!date) return "";
    if (date === todayYmd()) return "Assigned today";

    const formatted = formatProgressDate(date);
    return formatted ? `Assigned ${formatted}` : "";
};

const buildStatistics = (summary: StudentDashboardSummary | null, isLoading: boolean): StatCard[] => {

    // Placeholder while the first response is on its way
    const pending = isLoading && summary === null;

    const empty = pending ? "…" : "—";

    const today = summary?.today_attendance ?? null;
    const sabaq = summary?.new_sabaq ?? null;
    const manzil = summary?.manzil ?? null;
    const hifz = summary?.hifz_progress ?? null;

    return [
        {
            id: 1,
            title: "Today",
            value: today?.status ? STATUS_LABELS[today.status] : pending ? empty : "Not marked",
            icon: CalendarCheck,
            iconClass: "attendance",
            change: today?.status
                ? today.marked_at ? `Marked at ${today.marked_at}` : "Marked"
                : pending ? "" : "Not marked yet",
            changeType: today?.status ? STATUS_CHANGE_TYPES[today.status] : "neutral",
        },
        {
            id: 2,
            title: "New Sabaq",
            value: sabaq?.label ?? empty,
            icon: BookOpen,
            iconClass: "students",
            change: sabaq ? assignedText(sabaq.assigned_date) : pending ? "" : "No sabaq yet",
            changeType: "neutral",
        },
        {
            id: 3,
            title: "Manzil",
            value: manzil?.label ?? empty,
            icon: Repeat,
            iconClass: "sessions",
            change: manzil
                ? manzil.status === "needs-revision" ? "Needs revision" : manzil.status === "on-track" ? "On track" : ""
                : pending ? "" : "No manzil yet",
            changeType: manzil?.status === "needs-revision" ? "negative" : manzil?.status === "on-track" ? "positive" : "neutral",
        },
        {
            id: 4,
            title: "Pages Memorised",
            value: hifz ? `${hifz.memorised_pages} / ${hifz.total_pages}` : empty,
            icon: TrendingUp,
            iconClass: "teachers",
            // Percentage exactly as returned (one decimal place)
            change: hifz ? `${hifz.percentage}% of the Quran` : "",
            changeType: "positive",
        },
    ];
};


const DashboardStats = ({ summary, isLoading }: DashboardStatsProps) => {

    const statistics = buildStatistics(summary, isLoading);

    return (
        <div className="dashboard-stats">
            <div className="row">
                {statistics.map((stat) => {

                    const Icon = stat.icon;

                    return (
                        <div className="col-12 col-sm-6 col-lg-3" key={stat.id}>
                            <div className="dash-stat-card">

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

                                        {stat.change && (
                                            <span className={`stat-change ${stat.changeType}`}>
                                                {stat.change}
                                            </span>
                                        )}
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
