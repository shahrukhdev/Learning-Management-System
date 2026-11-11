import "./QuranProgressOverview.css";

import DashboardBoxStatus from "../DashboardStatistics/DashboardBoxStatus";
import type { DashboardQuranProgress, QuranProgressStatus } from "../../types/dashboard.types";

const STATUS_LABELS: Record<QuranProgressStatus, string> = {
    "on-track": "On Track",
    "needs-attention": "Needs Attention",
};

interface QuranProgressOverviewProps {
    // From GET /v1/dashboard/summary `quran_progress_overview`
    items: DashboardQuranProgress[];
    isLoading: boolean;
    error: string | null;
    onRetry: () => void;
}

const QuranProgressOverview = ({ items, isLoading, error, onRetry }: QuranProgressOverviewProps) => {
    return (
        <div className="quran-progress-overview dashboard-box">

            {/* Header */}
            <div className="quran-progress-header">

                <div className="quran-progress-heading">
                    <h2 className="dash-box-title ">
                        Quran Progress Overview
                    </h2>

                    <p className="quran-progress-subtitle m-0">
                        Class-wise proficiency tracking
                    </p>
                </div>

                {/* Legend */}
                <div className="quran-progress-legend">

                    <span className="progress-legend-item">
                        <span className="progress-legend-dot on-track"></span>
                        On Track
                    </span>

                    <span className="progress-legend-item">
                        <span className="progress-legend-dot needs-attention"></span>
                        Needs Attention
                    </span>

                </div>

            </div>

            {/* Progress List */}
            <DashboardBoxStatus
                isLoading={isLoading && items.length === 0 && !error}
                error={items.length === 0 ? error : null}
                onRetry={onRetry}
                isEmpty={items.length === 0}
                emptyText="No class progress yet."
                loadingText="Loading progress..."
            />

            {items.length > 0 && (
            <div className={`quran-progress-list ${isLoading ? "dashboard-box-refreshing" : ""}`}>

                {items.map((item) => (
                    <div
                        className="quran-progress-item"
                        key={item.id}
                    >

                        {/* Item Header */}
                        <div className="quran-progress-item-header">

                            <h3 className="quran-progress-title sm-title">
                                {item.title}
                            </h3>

                            <span className="quran-progress-value">
                                {item.progress !== null ? `${item.progress}%` : "—"}
                                {item.status ? ` ${STATUS_LABELS[item.status]}` : ""}
                            </span>

                        </div>

                        {item.student_count !== null && (
                            <p className="quran-progress-subtitle m-0 mb-1">
                                {item.student_count} {item.student_count === 1 ? "student" : "students"}
                            </p>
                        )}

                        {/* Progress Bar */}
                        <div className="quran-progress-bar">

                            <div
                                className="quran-progress-fill"
                                style={{
                                    width: `${Math.min(Math.max(item.progress ?? 0, 0), 100)}%`,
                                }}
                            />

                        </div>

                    </div>
                ))}

            </div>
            )}

        </div>
    );
};

export default QuranProgressOverview;