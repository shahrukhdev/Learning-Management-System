import SEO from "../../../components/Seo/SEO";
import HifzEmptyState from "../../../components/Hifz/HifzEmptyState/HifzEmptyState";
import HifzStudentList from "../../../components/Hifz/HifzStudentList/HifzStudentList";
import "./Hifz.css";
import { useEffect, useRef, useState } from "react";
import HifzStudentDetails from "../../../components/Hifz/HifzStudentDetails/HifzStudentDetails";
import { useAcademicClassOptions } from "../../../hooks/useAcademicClassOptions";
import { useClassAttendance } from "../../../hooks/useClassAttendance";
import type { ClassAttendanceRecord } from "../../../types/attendance.types";
import { todayYmd } from "../../../components/Attendance/attendanceDates";


const Hifz = () => {

    /* --------------------------------
       Classes (Academic Classes API, same as Attendance)
    -------------------------------- */

    const {
        classes,
        isLoading: classesLoading,
        error: classesError,
        retry: retryClasses,
    } = useAcademicClassOptions();

    // Picked class (null = the first class once they load)
    const [chosenClassId, setChosenClassId] = useState<number | null>(null);

    const selectedClassId =
        chosenClassId !== null && classes.some((item) => item.id === chosenClassId)
            ? chosenClassId
            : classes[0]?.id ?? null;

    /* --------------------------------
       Students of the selected class (same request as Attendance; older
       responses are discarded by the hook)
    -------------------------------- */

    // The tracker's date (header date picker). The student list shows each
    // student's attendance status on this date; cleared (all sessions) = today.
    const [date, setDate] = useState<string | null>(todayYmd);

    const attendanceDate = date ?? todayYmd();

    const {
        records,
        isLoading: studentsLoading,
        error: studentsError,
        reload: reloadStudents,
        hasLoaded: studentsLoaded,
    } = useClassAttendance(selectedClassId, attendanceDate);

    // While another date loads, keep this class's previous list (dimmed) so
    // the selected student and the details panel stay in place
    const [lastList, setLastList] = useState<{ classId: number | null; records: ClassAttendanceRecord[] }>({
        classId: null,
        records: [],
    });

    if (studentsLoaded && lastList.records !== records) {
        setLastList({ classId: selectedClassId, records });
    }

    const students =
        studentsLoaded || lastList.classId !== selectedClassId
            ? records
            : lastList.records;

    // Selected student, tied to the class it was picked from
    const [selection, setSelection] = useState<{ classId: number; studentId: number } | null>(null);

    // Only a student of the currently loaded class counts as selected
    const selectedStudentId =
        selection !== null &&
        selection.classId === selectedClassId &&
        students.some((student) => student.student_id === selection.studentId)
            ? selection.studentId
            : null;

    // The selected student's card number (position in the class list)
    const selectedStudentNumber =
        selectedStudentId === null
            ? null
            : students.findIndex((student) => student.student_id === selectedStudentId) + 1;

    // The selected student's name, from the same list record as its card
    const selectedStudentName =
        selectedStudentId === null
            ? ""
            : students.find((student) => student.student_id === selectedStudentId)?.name ?? "";

    const handleClassChange = (classId: number) => {
        setChosenClassId(classId);
        setSelection(null);
    };

    const handleStudentSelect = (studentId: number) => {
        if (selectedClassId === null) return;

        setSelection({ classId: selectedClassId, studentId });

        // Small screens: bring the details panel into view
        if (window.innerWidth < 992 && rightPanelRef.current) {
            setTimeout(() => {
                rightPanelRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
            }, 60);
        }
    };

    const rightPanelRef = useRef<HTMLDivElement>(null);
    const [rightPanelHeight, setRightPanelHeight] =
        useState<number | null>(null);

    useEffect(() => {
        const rightPanel = rightPanelRef.current;

        if (!rightPanel) return;

        const observer = new ResizeObserver(([entry]) => {
            setRightPanelHeight(entry.contentRect.height);
        });

        observer.observe(rightPanel);

        return () => observer.disconnect();
    }, [selectedStudentId]);

    return (
        <>
            <SEO
                title="Hifz - Noor Ul Imaan Masjid"
                description="Manage your Noor Ul Imaan Masjid Madrassah Portal Hifz."
            />

            <section className="hifz-section">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-12">
                            <div className="hifz-sec-header d-flex align-items-center justify-content-between">
                                <h1 className="section-title m-0">Hifz</h1>
                                <select
                                    className="form-select attendance-class-select"
                                    aria-label="Select class"
                                    value={selectedClassId ?? ""}
                                    onChange={(e) => handleClassChange(Number(e.target.value))}
                                    disabled={classesLoading || classes.length === 0}
                                >
                                    {classes.length === 0 && (
                                        <option value="">
                                            {classesLoading ? "Loading" : "No classes"}
                                        </option>
                                    )}
                                    {classes.map((option) => (
                                        <option key={option.id} value={option.id}>
                                            {option.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-12 col-lg-6">
                            <div
                                className="hifz-list-wrapper"
                                style={{
                                    height:
                                        rightPanelHeight !== null
                                            ? `${rightPanelHeight}px`
                                            : undefined,
                                }}
                            >
                                <HifzStudentList
                                    students={students}
                                    selectedStudentId={selectedStudentId}
                                    onStudentSelect={handleStudentSelect}
                                    hasClass={selectedClassId !== null}
                                    classesLoading={classesLoading}
                                    classesError={classesError}
                                    onRetryClasses={retryClasses}
                                    isLoading={studentsLoading}
                                    error={studentsError}
                                    onRetry={reloadStudents}
                                />
                            </div>
                        </div>

                        <div className="col-12 col-lg-6">
                            <div ref={rightPanelRef}>
                                {selectedStudentId === null ? (
                                    <HifzEmptyState />
                                ) : (
                                    <HifzStudentDetails
                                        studentId={selectedStudentId}
                                        studentNumber={selectedStudentNumber}
                                        studentName={selectedStudentName}
                                        date={date}
                                        onDateChange={setDate}
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                    
                </div>
            </section>
        </>
    )
};

export default Hifz;
