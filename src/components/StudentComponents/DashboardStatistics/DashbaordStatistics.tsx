
import "./DashbaordStatistics.css";

import {
    CalendarCheck,
    BookOpen,
    Repeat,
    TrendingUp,
} from "lucide-react";

const statistics = [
    {
        id: 1,
        title: "Today",
        value: "Present",
        icon: CalendarCheck,
        iconClass: "attendance",
        change: "Marked at 8:05 AM",
        changeType: "positive",
    },
    {
        id: 2,
        title: "New Sabaq",
        value: "Page 23–24",
        icon: BookOpen,
        iconClass: "students",
        change: "Assigned today",
        changeType: "neutral",
    },
    {
        id: 3,
        title: "Manzil",
        value: "Juz 1–2",
        icon: Repeat,
        iconClass: "sessions",
        change: "Needs revision",
        changeType: "negative",
    },
    {
        id: 4,
        title: "Pages Memorised",
        value: "25 / 604",
        icon: TrendingUp,
        iconClass: "teachers",
        change: "4% of the Quran",
        changeType: "positive",
    },
];


const DashboardStats = () => {
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

                                        <span className={`stat-change ${stat.changeType}`}>
                                            {stat.change}
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
