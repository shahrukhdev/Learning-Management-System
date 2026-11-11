import "./AttendanceStudentList.css";
import type { AttendanceStatus, ClassAttendanceRecord } from "../../../types/attendance.types";
import { Check, Users } from "lucide-react";
import AvatarContent from "../../Avatar/AvatarContent";
import { resolveImageUrl } from "../../../utils/imageUrl";
import { formatDisplayDate } from "../attendanceDates";
import avatarFallback from "../../../assets/images/student-dummy-img.png";

export interface AttendanceClassOption {
    id: number;
    name: string;
}

interface AttendanceStudentListProps {
    // Students to show (already filtered by the search box)
    students: ClassAttendanceRecord[];
    // Number of students in the class before the search filter
    totalStudents: number;
    attendance: Record<number, AttendanceStatus>;
    selectedStudents: number[];
    onStudentSelect: (studentId: number) => void;

    classOptions: AttendanceClassOption[];
    selectedClassId: number | null;
    onClassChange: (classId: number) => void;
    classesLoading: boolean;
    classesError: string | null;
    onRetryClasses: () => void;

    date: string; // Y-m-d

    isLoading: boolean;
    error: string | null;
    onRetry: () => void;

    onSave: () => void;
    isSaving: boolean;
}

const STATUS_LABELS: Record<AttendanceStatus, string> = {
    present: "Present",
    late: "Late",
    absent: "Absent",
    "not-marked": "Not Marked",
};

const AttendanceStudentList = ({
    students,
    totalStudents,
    attendance,
    selectedStudents,
    onStudentSelect,
    classOptions,
    selectedClassId,
    onClassChange,
    classesLoading,
    classesError,
    onRetryClasses,
    date,
    isLoading,
    error,
    onRetry,
    onSave,
    isSaving,
}: AttendanceStudentListProps) => {

    const renderStatus = () => {

        if (classesError) {
            return (
                <div className="attendance-status">
                    <span>{classesError}</span>
                    <button type="button" className="table-retry-button" onClick={onRetryClasses}>
                        Try again
                    </button>
                </div>
            );
        }

        if (classesLoading) {
            return (
                <div className="attendance-status" role="status">
                    <span className="d-inline-flex align-items-center gap-2">
                        <span className="spinner-border spinner-border-sm" aria-hidden="true"></span>
                        Loading classes...
                    </span>
                </div>
            );
        }

        if (selectedClassId === null) {
            return (
                <div className="attendance-status">
                    <span className="attendance-empty-icon" aria-hidden="true">
                        <Users size={20} strokeWidth={2} />
                    </span>
                    <p className="attendance-empty-title">No classes found.</p>
                    <p className="attendance-empty-hint">Create an academic class to start marking attendance.</p>
                </div>
            );
        }

        if (error) {
            return (
                <div className="attendance-status">
                    <span>{error}</span>
                    <button type="button" className="table-retry-button" onClick={onRetry}>
                        Try again
                    </button>
                </div>
            );
        }

        if (isLoading && totalStudents === 0) {
            return (
                <div className="attendance-status" role="status">
                    <span className="d-inline-flex align-items-center gap-2">
                        <span className="spinner-border spinner-border-sm" aria-hidden="true"></span>
                        Loading students...
                    </span>
                </div>
            );
        }

        if (totalStudents === 0) {
            return (
                <div className="attendance-status">
                    <span className="attendance-empty-icon" aria-hidden="true">
                        <Users size={20} strokeWidth={2} />
                    </span>
                    <p className="attendance-empty-title">No students in this class.</p>
                    <p className="attendance-empty-hint">Students assigned to this class will appear here.</p>
                </div>
            );
        }

        if (students.length === 0) {
            return (
                <div className="attendance-status">
                    <p className="attendance-empty-title">No students match your search.</p>
                </div>
            );
        }

        return null;
    };

    const status = renderStatus();

    return (

        <div className="attendance-student-list">

            {/* Class Header */}
            <div className="attendance-class-header">

                <div className="attendance-class-header-left">
                    <select className="form-select attendance-class-select" aria-label="Select class"
                        value={selectedClassId ?? ""}
                        onChange={(e) => onClassChange(Number(e.target.value))}
                        disabled={classesLoading || classOptions.length === 0}
                    >
                        {classOptions.length === 0 && (
                            <option value="">
                                {classesLoading ? "Loading classes..." : "No classes"}
                            </option>
                        )}
                        {classOptions.map((option) => (
                            <option key={option.id} value={option.id}>
                                {option.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="attendance-class-header-right">
                    <span className="attendance-date">
                        {formatDisplayDate(date)}
                    </span>
                    <button
                        className="attendance-btn save-btn d-inline-flex align-items-center gap-2"
                        type="button"
                        onClick={onSave}
                        disabled={isSaving || isLoading || Boolean(error) || totalStudents === 0}
                        aria-busy={isSaving}
                    >
                        {isSaving && (
                            <span className="spinner-border spinner-border-sm" aria-hidden="true"></span>
                        )}
                        {isSaving ? "Saving..." : "Save Attendance"}
                    </button>
                </div>

            </div>


            {status ?? (

                /* Student Grid (dimmed while the same class/date reloads) */
                <div
                    className={`attendance-student-grid ${isLoading ? "is-loading" : ""}`}
                    aria-busy={isLoading}
                >

                    {students.map((student, index) => {

                        const studentStatus = attendance[student.student_id] ?? "not-marked";

                        const isSelected = selectedStudents.includes(student.student_id);

                        return (

                            <div className="student-card-wrapper" key={student.student_id}>

                                <input className="d-none" type="checkbox" id={`student-${student.student_id}`} checked={isSelected}
                                    onChange={() =>
                                        onStudentSelect(
                                            student.student_id
                                        )
                                    }
                                    disabled={isSaving}
                                />

                                <label htmlFor={`student-${student.student_id}`} className={`attendance-student-card ${isSelected ? "selected" : "not-selected"}`} >

                                    {/* Student Selection */}
                                    <div className="student-select-checkbox">
                                        {isSelected && (
                                            <span className="selected-icon">
                                                    <Check
                                                        color="#fff"
                                                        size={14}
                                                        strokeWidth={2.5}
                                                    />
                                            </span>
                                        )}

                                    </div>

                                    {/* Small Number / Badge */}
                                    <span className="student-card-number">
                                        {index + 1}
                                    </span>


                                    {/* Student Image (default avatar when missing) */}
                                    <div className="attendance-student-avatar">
                                        <AvatarContent
                                            src={resolveImageUrl(student.image)}
                                            alt={student.name}
                                            className="img-fluid student-img"
                                            fallback={<img className="img-fluid student-img" src={avatarFallback} alt={student.name} />}
                                        />
                                    </div>


                                    {/* Student Name + Admission Number */}
                                    <h3 className="student-name m-0">
                                        {student.name}
                                    </h3>

                                    {student.admission_number && (
                                        <span className="student-admission-number">
                                            {student.admission_number}
                                        </span>
                                    )}


                                    {/* Attendance Status */}
                                    <span className={`student-attendance-status ${studentStatus}`} >

                                        <span className="dot"></span>

                                        {STATUS_LABELS[studentStatus]}

                                    </span>

                                </label>
                            </div>
                        );
                    })}

                </div>

            )}
        </div>
    );
};

export default AttendanceStudentList;
