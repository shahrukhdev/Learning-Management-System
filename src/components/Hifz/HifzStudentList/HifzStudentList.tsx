import { useState } from "react";
import { Check } from "lucide-react";

import "../../Attendance/AttendanceStudentList/AttendanceStudentList.css";
import "./HifzStudentList.css";

import type {
    AttendanceStatus,
    Student,
} from "../../Attendance/Attendance.types";

import FilterBar from "../../FilterBar/FilterBar";

interface HifzStudentListProps {
    students: Student[];
    attendance: Record<number, AttendanceStatus>;
    selectedStudentId: number | null;
    onStudentSelect: (studentId: number) => void;
}

const HifzStudentList = ({
    students,
    attendance,
    selectedStudentId,
    onStudentSelect,
}: HifzStudentListProps) => {
    const [search, setSearch] = useState("");

    // Filter students by name or ID
    const filteredStudents = students.filter((student) => {
        const searchTerm = search.trim().toLowerCase();

        const studentName = student.name.toLowerCase();
        const studentId = String(student.id);

        return (
            studentName.includes(searchTerm) ||
            studentId.includes(searchTerm)
        );
    });

    return (
        <div className="hifz-box hifz-student-list">
            <FilterBar
                searchPlaceholder="Search students"
                searchValue={search}
                onSearchChange={setSearch}
            />

            <div className="attendance-student-list p-0">
                <div className="attendance-student-grid">
                    {filteredStudents.length > 0 ? (
                        filteredStudents.map((student) => {
                            const status =
                                attendance[student.id] ?? "not-marked";

                            const isSelected =
                                selectedStudentId === student.id;

                            return (
                                <div
                                    className="student-card-wrapper"
                                    key={student.id}
                                >
                                    <button
                                        type="button"
                                        className={`attendance-student-card ${
                                            isSelected
                                                ? "selected"
                                                : "not-selected"
                                        }`}
                                        onClick={() =>
                                            onStudentSelect(student.id)
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
                                            {student.id}
                                        </span>

                                        {/* Student Image */}
                                        <div className="attendance-student-avatar">
                                            <img
                                                className="img-fluid student-img"
                                                src={student.image}
                                                alt={student.name}
                                            />
                                        </div>

                                        {/* Student Name */}
                                        <h3 className="student-name m-0">
                                            {student.name}
                                        </h3>

                                        {/* Attendance Status */}
                                        <span
                                            className={`student-attendance-status ${status}`}
                                        >
                                            <span className="dot" />

                                            {status === "present" && "Present"}
                                            {status === "late" && "Late"}
                                            {status === "absent" && "Absent"}
                                            {status === "not-marked" &&
                                                "Not Marked"}
                                        </span>
                                    </button>
                                </div>
                            );
                        })
                    ) : (
                        <div className="hifz-student-empty">
                            No students found.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default HifzStudentList;