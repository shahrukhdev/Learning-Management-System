import { useMemo,useState } from "react";

import AttendanceControls from "../../components/Attendance/AttendanceControls/AttendanceControls";
import AttendanceStudentList from "../../components/Attendance/AttendanceStudentList/AttendanceStudentList";

import { classOptions, students } from "../../components/Attendance/attendance.data";
import type { AttendanceStatus } from "../../components/Attendance/attendance.types";


import FilterBar from "../../components/FilterBar/FilterBar";
import SEO from "../../components/Seo/SEO";

const Attendance = () => {

    const [search, setSearch] = useState("");
    const [classFilter, setClassFilter] = useState("all");
    const [date, setDate] = useState("2023-10-24");
    const [status, setStatus] = useState("all");

    /* --------------------------------
       Selected Class
    -------------------------------- */

    const [selectedClass, setSelectedClass] = useState(classOptions[0]);

    /* --------------------------------
       Selected Students
    -------------------------------- */

    const [selectedStudents, setSelectedStudents] = useState<number[]>([]);

    /* --------------------------------
       Attendance State
    -------------------------------- */

    const [attendance, setAttendance] =
        useState<Record<
            number,
            AttendanceStatus
        >>(() =>
            Object.fromEntries(
                students.map((student) => [
                    student.id,
                    "not-marked",
                ])
            ) as Record<
                number,
                AttendanceStatus
            >
        );

    /* --------------------------------
       Attendance Summary
    -------------------------------- */

    const summary = useMemo(() => {

        const statuses =
            Object.values(attendance);

        return {
            total: students.length,

            present: statuses.filter(
                (status) =>
                    status === "present"
            ).length,

            late: statuses.filter(
                (status) =>
                    status === "late"
            ).length,

            absent: statuses.filter(
                (status) =>
                    status === "absent"
            ).length,

            notMarked: statuses.filter(
                (status) =>
                    status === "not-marked"
            ).length,
        };

    }, [attendance]);

    /* --------------------------------
       Select / Unselect Student
    -------------------------------- */

    const handleStudentSelect = (
        studentId: number
    ) => {

        setSelectedStudents((previous) => {

            if (
                previous.includes(studentId)
            ) {
                return previous.filter(
                    (id) =>
                        id !== studentId
                );
            }

            return [
                ...previous,
                studentId,
            ];
        });
    };

    /* --------------------------------
       Select All / Deselect All
    -------------------------------- */

    const handleSelectAll = () => {

        const allSelected =
            selectedStudents.length ===
            students.length;

        if (allSelected) {
            setSelectedStudents([]);
            return;
        }

        setSelectedStudents(
            students.map(
                (student) => student.id
            )
        );
    };

    /* --------------------------------
       Mark Attendance
    -------------------------------- */

    const handleMarkAttendance = (
        status: AttendanceStatus
    ) => {

        if (selectedStudents.length === 0) {
            return;
        }

        setAttendance((previous) => {

            const updatedAttendance = {
                ...previous,
            };

            selectedStudents.forEach((studentId) => {
                updatedAttendance[studentId] = status;
            });

            return updatedAttendance;
        });

        setSelectedStudents([]);
    };

    /* --------------------------------
       Class Change
    -------------------------------- */

    const handleClassChange = (
        className: string
    ) => {

        setSelectedClass(className);

        // Clear selected students
        setSelectedStudents([]);
    };

    return (
        <>
            <SEO
                title="Attendance | Noor Ul Imaan Masjid"
                description="Manage your Noor Ul Imaan Masjid Madrassah Portal attendance."
            />

            <section className="attendance-section">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-12">
                            <h1 className="section-title">
                                Attendance
                            </h1>
                        </div>

                        {/* Filter Bar */}
                        <div className="col-12">

                            <FilterBar
                                searchPlaceholder="Search students, teachers…"
                                searchValue={search}
                                onSearchChange={setSearch}

                                classValue={classFilter}
                                onClassChange={setClassFilter}
                                classOptions={[
                                    {
                                        value: "all",
                                        label: "All Classes",
                                    },
                                    {
                                        value: "class-a",
                                        label: "Class A",
                                    },
                                    {
                                        value: "class-b",
                                        label: "Class B",
                                    },
                                    {
                                        value: "class-c",
                                        label: "Class C",
                                    },
                                    {
                                        value: "class-d",
                                        label: "Class D",
                                    }
                                ]}

                                dateValue={date}
                                onDateChange={setDate}

                                statusValue={status}
                                onStatusChange={setStatus}
                                statusOptions={[
                                    {
                                        value: "all",
                                        label: "Status",
                                    },
                                    {
                                        value: "active",
                                        label: "Active",
                                    },
                                    {
                                        value: "inactive",
                                        label: "Inactive",
                                    },
                                ]}
                            />

                        </div>

                        {/* Attendance Controls */}
                        <div className="col-12">
                            <AttendanceControls 
                                summary={summary}
                                selectedStudents={selectedStudents}
                                totalStudents={students.length}
                                onSelectAll={handleSelectAll}
                                onMarkAttendance={handleMarkAttendance}
                                attendance={attendance}

                            />
                        </div>

                        {/* Attendance Student List */}
                        <div className="col-12">
                            <AttendanceStudentList
                                students={students}
                                selectedClass={selectedClass}
                                classOptions={classOptions}
                                attendance={attendance}
                                selectedStudents={selectedStudents}
                                onClassChange={handleClassChange}
                                onStudentSelect={handleStudentSelect}
                            />
                        </div>
                    </div>
                </div>
            </section>

        </>
    );
};

export default Attendance;