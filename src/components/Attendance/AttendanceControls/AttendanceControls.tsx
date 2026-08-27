import "./AttendanceControls.css";
import { Users, Check, X, Clock, ShieldAlert } from "lucide-react";
import type { AttendanceStatus } from "../attendance.types";

interface AttendanceSummary {
    total: number;
    present: number;
    late: number;
    absent: number;
    notMarked: number; 
}

interface AttendanceControlsProps {
    summary: AttendanceSummary;
    selectedStudents: number[];
    totalStudents: number;
    attendance: Record<number, AttendanceStatus>;
    onSelectAll: () => void;
    onMarkAttendance: (
        status: AttendanceStatus
    ) => void;
}

const AttendanceControls = ({
    summary,
    selectedStudents,
    totalStudents,
    attendance,
    onSelectAll,
    onMarkAttendance,
    
}: AttendanceControlsProps) => {

    const isStatusDisabled = (status: AttendanceStatus) => {

        if (selectedStudents.length === 0) {
            return true;
        }

        return selectedStudents.every(
            (studentId) => attendance[studentId] === status
        );
    };

    const allSelected = selectedStudents.length === totalStudents && totalStudents > 0    

    return (
        <div className="attendance-controlS">

            {/* Attendance Tabs */}
            <div className="attendance-tabs">
                <button className="attendance-tab active">
                    Mark Attendance
                </button>

                <button className="attendance-tab">
                    Attendance Overview
                </button>
            </div>

                {/* Attendance Summary */}
            <div className="attendance-summary">

                {/* Total */}
                <div className="attendance-stat">
                    <div className="attendance-stat-icon total">
                        <Users size={18} color="#0F7A47" strokeWidth={2.4} />
                    </div>

                    <div className="attendance-stat-content">
                        <strong className="count">{summary.total}</strong>
                        <span className="label">Total</span>
                    </div>
                </div>


                {/* Present */}
                <div className="attendance-stat">
                    <div className="attendance-stat-icon present">
                        <Check size={18} color="#159A57" strokeWidth={2.4} />
                    </div>

                    <div className="attendance-stat-content">
                        <strong className="count">{summary.present}</strong>
                        <span className="label">Present</span>
                    </div>
                </div>


                {/* Leave */}
                <div className="attendance-stat">
                    <div className="attendance-stat-icon late">
                        <ShieldAlert size={18} color="#585240" strokeWidth={2.4} />
                    </div>

                    <div className="attendance-stat-content">
                        <strong className="count">{summary.late}</strong>
                        <span className="label">Late</span>
                    </div>
                </div>


                {/* Absent */}
                <div className="attendance-stat">
                    <div className="attendance-stat-icon absent">
                        <X size={18} color="#E4573D" strokeWidth={2.4} />
                    </div>

                    <div className="attendance-stat-content">
                        <strong className="count">{summary.absent}</strong>
                        <span className="label">Absent</span>
                    </div>
                </div>


                {/* Not Marked */}
                <div className="attendance-stat">
                    <div className="attendance-stat-icon not-marked">
                        <Clock size={18} color="#96A39D" strokeWidth={2.4} />
                    </div>

                    <div className="attendance-stat-content">
                        <strong className="count">{summary.notMarked}</strong>
                        <span className="label">Not Marked</span>
                    </div>
                </div>

            </div>

            {/* Bulk Attendance Actions */}
            <div className="attendance-bulk-actions">

                <div className="input-check-wrapper">
                    <input className="input-check" type="checkbox" name="select_all" id="selectAll" checked={allSelected} onChange={onSelectAll} />
                    <label htmlFor="selectAll" className="select-all">
                        <span className="input-check-square">
                            <Check size={16} color="#fff" strokeWidth={2.5} />
                        </span>
                        <span>{allSelected ? "Deselect All" : "Select All"}</span>
                    </label>
                </div>

                <div className="attendance-buttons">
                    <button className="attendance-btn present-btn" disabled={isStatusDisabled("present")} onClick={() => onMarkAttendance("present")}>
                        Present
                    </button>

                    <button className="attendance-btn late-btn" disabled={isStatusDisabled("late")} onClick={() => onMarkAttendance("late")}>
                        Late
                    </button>

                    <button className="attendance-btn absent-btn" disabled={isStatusDisabled("absent")} onClick={() => onMarkAttendance("absent")}>
                        Absent
                    </button>
                </div>

            </div>

        </div>
    );
};


export default AttendanceControls;