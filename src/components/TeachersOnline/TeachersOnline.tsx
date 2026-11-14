import "./TeachersOnline.css";

import DashboardBoxStatus from "../DashboardStatistics/DashboardBoxStatus";
import AvatarContent from "../Avatar/AvatarContent";
import { resolveImageUrl } from "../../utils/imageUrl";
import type { DashboardTeacher } from "../../types/dashboard.types";

interface TeachersOnlineProps {
    // From GET /v1/dashboard/summary `teachers_available` (max 5) and
    // `teachers_total` (all active teachers). Admin dashboard only.
    teachers: DashboardTeacher[];
    total: number;
    isLoading: boolean;
    error: string | null;
    onRetry: () => void;
}

const TeachersOnline = ({ teachers, total, isLoading, error, onRetry }: TeachersOnlineProps) => {
    return (
        <div className="teachers-online dashboard-box">

            <div className="dash-box-top">
                <h2 className="dash-box-title">
                    Teachers Available{total > 0 ? ` (${total})` : ""}
                </h2>
            </div>

            <DashboardBoxStatus
                isLoading={isLoading && teachers.length === 0 && !error}
                error={teachers.length === 0 ? error : null}
                onRetry={onRetry}
                isEmpty={teachers.length === 0}
                emptyText="No teachers yet."
                loadingText="Loading teachers..."
            />

            {/* Teachers List */}
            {teachers.length > 0 && (
            <div className={`teachers-list ${isLoading ? "dashboard-box-refreshing" : ""}`}>

                {teachers.map((teacher) => {

                    const classNames = teacher.classes.map((item) => item.name).join(", ");

                    return (
                    <div className="teacher-item" key={teacher.id} >

                        {/* Avatar (photo, else initials) */}
                        <div className="teacher-avatar overflow-hidden">
                            <AvatarContent
                                src={resolveImageUrl(teacher.image)}
                                alt={teacher.name}
                                fallback={teacher.initials}
                                className="w-100 h-100 object-fit-cover"
                            />
                        </div>

                        {/* Teacher Info */}
                        <div className="teacher-info">
                            <div className="">
                                <h3 className="teacher-name sm-title mb-0">
                                    {teacher.name}
                                </h3>
                                <p className="teacher-class sm-para mb-0">
                                    {classNames || "No class assigned"}
                                    {teacher.shift && (
                                        <>
                                            <span> · </span>
                                            {teacher.shift}
                                        </>
                                    )}
                                </p>
                            </div>
                            {/* Status: shown as Active for every teacher (no
                                live status from the API yet) */}
                            <span className="teacher-status active">
                                Active
                            </span>
                        </div>

                    </div>
                    );
                })}
            </div>
            )}
        </div>
    );
};

export default TeachersOnline;
