import "./AttendanceTabs.css";

export type AttendanceTab = "mark-attendance" | "attendance-overview";

interface AttendanceTabsProps {
    activeTab: AttendanceTab;
    onTabChange: (tab: AttendanceTab) => void;
    canMarkAttendance: boolean;
    canViewOverview: boolean;
}

const AttendanceTabs = ({
    activeTab,
    onTabChange,
    canMarkAttendance,
    canViewOverview,
}: AttendanceTabsProps) => {
    return (
        <div className="attendance-tabs">
            {canMarkAttendance && (
                <button
                    className={`attendance-tab ${activeTab === "mark-attendance" ? "active" : ""}`}
                    onClick={() => onTabChange("mark-attendance")}
                >
                    Mark Attendance
                </button>
            )}

            {canViewOverview && (
                <button
                    className={`attendance-tab ${activeTab === "attendance-overview" ? "active" : ""}`}
                    onClick={() => onTabChange("attendance-overview")}
                >
                    Attendance Overview
                </button>
            )}
        </div>
    );
};

export default AttendanceTabs;