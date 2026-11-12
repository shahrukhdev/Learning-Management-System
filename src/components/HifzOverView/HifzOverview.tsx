import "./HifzOverview.css"
import { Link } from "react-router-dom";
import { MoveRight } from "lucide-react";
import DashboardBoxStatus from "../DashboardStatistics/DashboardBoxStatus";
import type { DashboardHifzStudent } from "../../types/dashboard.types";

// Existing avatar/progress colours, picked by student ID (stable per student)
const COLORS = ["green", "blue", "orange", "purple"];

const getColor = (studentId: number) => COLORS[Math.abs(studentId) % COLORS.length];

interface HifzOverviewProps {
    // From GET /v1/dashboard/summary `hifz_overview` (max 4, from the backend)
    students: DashboardHifzStudent[];
    isLoading: boolean;
    error: string | null;
    onRetry: () => void;
}

const HifzOverview = ({ students, isLoading, error, onRetry }: HifzOverviewProps) => {

    const progressStyle = (progress: number) =>
    ({
        "--progress": `${progress}%`,
    } as React.CSSProperties);

    return (

        <div className="hifz-overview dashboard-box">
            <div className="dash-box-top">
                <h2 className="dash-box-title">
                    Hifz Overview
                </h2>
                <Link className="view-details-btn" to="/hifz">
                    View all
                    <MoveRight color="#0F7A47" size={12} strokeWidth={2.5} />
                </Link>
            </div>

            <DashboardBoxStatus
                isLoading={isLoading && students.length === 0 && !error}
                error={students.length === 0 ? error : null}
                onRetry={onRetry}
                isEmpty={students.length === 0}
                emptyText="No Hifz progress yet."
                loadingText="Loading Hifz overview..."
            />

            {students.length > 0 && (
                <div className={`hifz-list ${isLoading ? "dashboard-box-refreshing" : ""}`}>

                    {students.map((student) => {

                        const color = getColor(student.student_id);

                        // API values as returned (null = not available)
                        const progress = student.progress;

                        return (
                            <div className="hifz-item" key={student.student_id}>

                                <div className="student-info">

                                    <div className={`user-avatar student-avatar ${color}`}>
                                        {student.initials}
                                    </div>

                                    <div className="student-details">
                                        <h4 className="sm-title">{student.name}</h4>
                                        <span className="sm-para">
                                            {student.last_session_date
                                                ? `Last session: ${student.last_session_date}`
                                                : "No sessions yet"}
                                        </span>
                                    </div>

                                </div>

                                <div className="student-progress">

                                    <div
                                        className={`progress-circle ${color}`}
                                        style={progressStyle(progress ?? 0)}
                                    >
                                        <span>
                                            {progress !== null ? `${progress}%` : "—"}
                                        </span>
                                    </div>

                                    <div className="progress-pages text-end">
                                        <span className="sm-para fw-bold">
                                            {student.memorised_surahs ?? "—"}/{student.total_surahs ?? "—"}
                                        </span>
                                    </div>

                                </div>

                            </div>
                        );
                    })}

                </div>
            )}

        </div>

    );
};

export default HifzOverview;
