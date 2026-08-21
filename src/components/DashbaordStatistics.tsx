import { BookOpen, Clock3, TrendingUp, Users } from "lucide-react";

const statistics = [
    {
        id: 1,
        title: "Total Students",
        value: "24",
        icon: Users,
        iconClass: "students",
        change: "▲ 3 this month",
        changeType: "positive",
    },
    {
        id: 2,
        title: "Teachers",
        value: "6",
        icon: BookOpen,
        iconClass: "teachers",
        change: "— no change",
        changeType: "neutral",
    },
    {
        id: 3,
        title: "Hifz Sessions Today",
        value: "12",
        icon: Clock3,
        iconClass: "sessions",
        change: "▲ 5 vs yesterday",
        changeType: "positive",
    },
    {
        id: 4,
        title: "Attendance Rate",
        value: "92%",
        icon: TrendingUp,
        iconClass: "attendance",
        change: "▼ 2% this week",
        changeType: "negative",
    },
];


const DashboardStats = () => {
    return (
        <div className="dashboard-stats">
            <div className="row">
                {statistics.map((stat) => {

                    const Icon = stat.icon;

                    return (
                        <div className="col-12 col-md-6 col-lg-3">
                            <div className="dash-stat-card" key={stat.id}>
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
                                    <div className="stat-bottom d-flex justify-content-between align-items-center g-2">
                                        <span className="stat-title">
                                            {stat.title}
                                        </span>
                                        <span className={`stat-change ${stat.changeType}`} >
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