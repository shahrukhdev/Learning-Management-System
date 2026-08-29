import "./AttendanceTabs.css";

export type AttendanceTab = "mark-attendance" | "attendance-overview";

interface AttendanceTabsProps {
    activeTab: AttendanceTab;
    onTabChange: (tab: AttendanceTab) => void;
}

const AttendanceTabs = ({ activeTab, onTabChange }: AttendanceTabsProps) => {
    return (
        <div className="attendance-tabs">
            <button className={`attendance-tab ${activeTab === "mark-attendance" ? "active" : ""}`} onClick={() => onTabChange("mark-attendance")}>
                Mark Attendance
            </button>

            <button className={`attendance-tab ${activeTab === "attendance-overview" ? "active" : ""}`} onClick={() => onTabChange("attendance-overview")}>
                Attendance Overview
            </button>
        </div>
    );
};

export default AttendanceTabs;