import "./Announcements.css";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { usePermissions } from "../../hooks/usePermissions";
import { PERMISSIONS } from "../../utils/permissions";
import { formatNoticeDate } from "../../utils/noticeDate";

import DashboardBoxStatus from "../DashboardStatistics/DashboardBoxStatus";
import type { DashboardAnnouncement } from "../../types/dashboard.types";

// Existing dot colours, picked by announcement ID (stable per announcement)
const DOT_CLASSES = ["green", "yellow", "blue"];

interface AnnouncementsProps {
    // From GET /v1/dashboard/summary `announcements` (max 3, from the backend)
    announcements: DashboardAnnouncement[];
    isLoading: boolean;
    error: string | null;
    onRetry: () => void;
}

const Announcements = ({ announcements, isLoading, error, onRetry }: AnnouncementsProps) => {

    const navigate = useNavigate();

    // The Notices page needs "View Notices" (same rule as its Sidebar item)
    const { hasPermission } = usePermissions();

    const canViewNotices = hasPermission(PERMISSIONS.VIEW_NOTICES);

    return (
        <div className="announcement dashboard-box">
            <div className="dash-box-top">
                <h2 className="dash-box-title">
                    Announcements
                </h2>
                {canViewNotices && (
                    <button
                        type="button"
                        className="add-btn"
                        onClick={() => navigate("/notices")}
                        aria-label="Go to Notices"
                    >
                        <Plus color="#33423C" size={18} strokeWidth={2.5} />
                    </button>
                )}
            </div>

            {/* Announcement List */}
            <DashboardBoxStatus
                isLoading={isLoading && announcements.length === 0 && !error}
                error={announcements.length === 0 ? error : null}
                onRetry={onRetry}
                isEmpty={announcements.length === 0}
                emptyText="No announcements yet."
                loadingText="Loading announcements..."
            />

            {announcements.length > 0 && (
            <div className={`announcement-list ${isLoading ? "dashboard-box-refreshing" : ""}`}>

                {announcements.map((announcement) => (
                    <div
                        className="announcement-item"
                        key={announcement.id}
                    >

                        <span
                            className={`announcement-dot ${DOT_CLASSES[Math.abs(announcement.id) % DOT_CLASSES.length]}`}
                        />

                        <div className="announcement-content">

                            <h3 className="sm-title announcement-title m-0">
                                {announcement.title}
                            </h3>

                            {/* "<date, same format as Notices> · <message>"; a missing
                                or invalid date is left out (never the raw timestamp) */}
                            <p className="sm-para announcement-description m-0">
                                {[formatNoticeDate(announcement.created_at), announcement.message].filter(Boolean).join(" · ")}
                            </p>

                        </div>

                    </div>
                ))}

            </div>
            )}

        </div>
    );
};

export default Announcements;