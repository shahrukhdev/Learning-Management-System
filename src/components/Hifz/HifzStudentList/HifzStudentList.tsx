import "../../Attendance/AttendanceStudentList/AttendanceStudentList.css";
import "./HifzStudentList.css";
import type { AttendanceStatus, Student } from "../../Attendance/Attendance.types";

import { Check, ShieldAlert, X } from "lucide-react";
import FilterBar from "../../FilterBar/FilterBar";

import { useState } from "react";

interface HifzStudentListProps {
    students: Student[];
    attendance: Record<number, AttendanceStatus>;
    selectedStudentId:number | null ;
    onStudentSelect: (StudentId: number) => void;
}

const HifzStudentList = ({
    students,
    attendance,
    selectedStudentId,
    onStudentSelect
}: HifzStudentListProps) => {

    const [search, setSearch] = useState("");

    return (
        <div className="hifz-box hifz-student-list">

            <FilterBar
                searchPlaceholder="Search students"
                searchValue={search}
                onSearchChange={setSearch}
            />

            <div className="attendance-student-list p-0">

                {/* Student Grid */}
                <div className="attendance-student-grid">

                    {students.map((student) => {

                        const status =
                            attendance[student.id] ??
                            "not-marked";

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
                                        onStudentSelect(
                                            student.id
                                        )
                                    }
                                >

                                    {/* Attendance Status Icon */}
                                    <div className="student-select-checkbox">

                                        <span
                                            className={`selected-icon ${status}`}
                                        >

                                            {status === "present" && (
                                                <Check
                                                    color="#fff"
                                                    size={14}
                                                    strokeWidth={2.5}
                                                />
                                            )}

                                            {status === "late" && (
                                                <ShieldAlert
                                                    color="#424242"
                                                    size={14}
                                                    strokeWidth={2.5}
                                                />
                                            )}

                                            {status === "absent" && (
                                                <X
                                                    color="#fff"
                                                    size={14}
                                                    strokeWidth={2.5}
                                                />
                                            )}

                                        </span>

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

                                        <span className="dot"></span>

                                        {status === "present" &&
                                            "Present"}

                                        {status === "late" &&
                                            "Late"}

                                        {status === "absent" &&
                                            "Absent"}

                                        {status === "not-marked" &&
                                            "Not Marked"}

                                    </span>

                                </button>

                            </div>

                        );
                    })}

                </div>

            </div>

        </div>
    )
};

export default HifzStudentList;