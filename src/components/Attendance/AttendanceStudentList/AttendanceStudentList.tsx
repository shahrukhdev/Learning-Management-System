import "./AttendanceStudentList.css";
import type { AttendanceStatus, Student } from "../Attendance.types";
import { Check, ShieldAlert, X } from "lucide-react";

interface AttendanceStudentListProps {
    students: Student[];
    selectedClass: string;
    classOptions: string[];
    attendance: Record<
        number,
        AttendanceStatus
    >;
    selectedStudents: number[];
    onClassChange: (
        className: string
    ) => void;
    onStudentSelect: (
        StudentId: number
    ) => void;
}

const AttendanceStudentList = ({
    students,
    selectedClass,
    classOptions,
    attendance,
    selectedStudents,
    onClassChange,
    onStudentSelect,

}: AttendanceStudentListProps) => {

    return (

        <div className="attendance-student-list">
            
            {/* Class Header */}
            <div className="attendance-class-header">

                <select className="form-select attendance-class-select" aria-label="Default select example" 
                    value={selectedClass}
                    onChange={(e) => onClassChange(e.target.value)}
                >
                    {classOptions.map((option) => (
                        <option key={option} value={option}>
                            {option}
                        </option>
                    ))}
                </select>

                <span className="attendance-date">
                    Oct 24, 2023
                </span>

            </div>


            {/* Student Grid */}
            <div className="attendance-student-grid">

                {students.map((student) => {

                    const status = attendance[student.id];

                    const isSelected = selectedStudents.includes(student.id);

                    return (

                        <div className="student-card-wrapper" key={student.id}>

                            <input className="d-none" type="checkbox" id={`student-${student.id}`} checked={isSelected}
                                onChange={() =>
                                    onStudentSelect(
                                        student.id
                                    )
                                }
                            />

                            <label htmlFor={`student-${student.id}`} className={`attendance-student-card ${isSelected ? "selected" : "not-selected"}`} >

                                {/* Student Selection */}
                                <div className="student-select-checkbox">
                                    <span className={`selected-icon ${status}`}>

                                        {status === "present" && (
                                            <Check color="#fff" size={14} strokeWidth={2.5} />
                                        )}

                                        {status === "late" && (
                                            <ShieldAlert color="##424242" size={14} strokeWidth={2.5} />
                                        )}

                                        {status === "absent" && (
                                            <X color="#fff" size={14} strokeWidth={2.5} />
                                        )}
                                    </span>
                                </div>

                                {/* Small Number / Badge */}
                                <span className="student-card-number">
                                    {student.id}
                                </span>


                                {/* Student Image */}
                                <div className="attendance-student-avatar">
                                    <img className="img-fluid student-img" src={student.image} alt={student.name} />
                                </div>


                                {/* Student Name */}
                                <h3 className="student-name m-0">
                                    {student.name}
                                </h3>


                                {/* Attendance Status */}
                                <span className={`student-attendance-status ${status}`} >

                                    <span className="dot"></span>

                                    {status === "present" && "Present"}

                                    {status === "late" && "Late"}

                                    {status === "absent" && "Absent"}

                                    {status === "not-marked" && "Not Marked"}

                                </span>

                            </label>
                        </div>
                    );
                })}

            </div>
        </div>
    );
};

export default AttendanceStudentList;
