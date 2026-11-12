import { useState } from "react";
import { Check, Users } from "lucide-react";

import "../../Attendance/AttendanceStudentList/AttendanceStudentList.css";
import "./HifzStudentList.css";

import type { AttendanceStatus, ClassAttendanceRecord } from "../../../types/attendance.types";

import FilterBar from "../../FilterBar/FilterBar";
import AvatarContent from "../../Avatar/AvatarContent";
import { resolveImageUrl } from "../../../utils/imageUrl";
import avatarFallback from "../../../assets/images/student-dummy-img.png";

interface HifzStudentListProps {
    // Students of the selected class (GET /v1/attendances, same as Attendance)
    students: ClassAttendanceRecord[];
    selectedStudentId: number | null;
    onStudentSelect: (studentId: number) => void;

    hasClass: boolean;
    classesLoading: boolean;
    classesError: string | null;
    onRetryClasses: () => void;

    isLoading: boolean;
    error: string | null;
    onRetry: () => void;
}

const STATUS_LABELS: Record<AttendanceStatus, string> = {
    present: "Present",
    late: "Late",
    absent: "Absent",
    "not-marked": "Not Marked",
};

const HifzStudentList = ({
    students,
    selectedStudentId,
    onStudentSelect,
    hasClass,
    classesLoading,
    classesError,
    onRetryClasses,
    isLoading,
    error,
    onRetry,
}: HifzStudentListProps) => {
    const [search, setSearch] = useState("");

    const searchTerm = search.trim().toLowerCase();

    // Filter students by name or admission number
    const filteredStudents = searchTerm
        ? students.filter((student) =>
            student.name.toLowerCase().includes(searchTerm) ||
            (student.admission_number ?? "").toLowerCase().includes(searchTerm)
        )
        : students;

    // Same loading / empty / error states as the Attendance student list
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

        if (!hasClass) {
            return (
                <div className="attendance-status">
                    <span className="attendance-empty-icon" aria-hidden="true">
                        <Users size={20} strokeWidth={2} />
                    </span>
                    <p className="attendance-empty-title">No classes found.</p>
                    <p className="attendance-empty-hint">Create an academic class to start tracking Hifz.</p>
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

        if (isLoading && students.length === 0) {
            return (
                <div className="attendance-status" role="status">
                    <span className="d-inline-flex align-items-center gap-2">
                        <span className="spinner-border spinner-border-sm" aria-hidden="true"></span>
                        Loading students...
                    </span>
                </div>
            );
        }

        if (students.length === 0) {
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

        if (filteredStudents.length === 0) {
            return (
                <div className="hifz-student-empty">
                    No students found.
                </div>
            );
        }

        return null;
    };

    const status = renderStatus();

    return (
        <div className="hifz-box hifz-student-list">
            <FilterBar
                searchPlaceholder="Search students"
                searchValue={search}
                onSearchChange={setSearch}
            />

            <div className="attendance-student-list p-0">
                {status ?? (
                    <div
                        className={`attendance-student-grid ${isLoading ? "is-loading" : ""}`}
                        aria-busy={isLoading}
                    >
                        {filteredStudents.map((student, index) => {
                            const studentStatus = student.status ?? "not-marked";

                            const isSelected = selectedStudentId === student.student_id;

                            return (
                                <div
                                    className="student-card-wrapper"
                                    key={student.student_id}
                                >
                                    <button
                                        type="button"
                                        className={`attendance-student-card ${
                                            isSelected
                                                ? "selected"
                                                : "not-selected"
                                        }`}
                                        onClick={() =>
                                            onStudentSelect(student.student_id)
                                        }
                                    >
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

                                        {/* Student Number */}
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

                                        {/* Today's Attendance Status */}
                                        <span
                                            className={`student-attendance-status ${studentStatus}`}
                                        >
                                            <span className="dot" />

                                            {STATUS_LABELS[studentStatus]}
                                        </span>
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default HifzStudentList;
