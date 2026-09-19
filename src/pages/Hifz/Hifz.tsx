import SEO from "../../components/Seo/SEO";
import HifzEmptyState from "../../components/Hifz/HifzEmptyState/HifzEmptyState";
import HifzStudentList from "../../components/Hifz/HifzStudentList/HifzStudentList";
import { students } from "../../components/Attendance/Attendance.data";
import type { AttendanceStatus } from "../../components/Attendance/Attendance.types";
import "./Hifz.css";
import { useEffect, useRef, useState } from "react";
import HifzStudentDetails from "../../components/Hifz/HifzStudentDetails/HifzStudentDetails";

const classOptions = [
    "Class A · Morning",
    "Class B · Evening",
    "Class C · Morning",
    "Class D · Evening",
];


const Hifz = () => {

    const [selectedStudentId, setSelectedStudentId] = useState<number | null>(null);

    const attendance: Record<
        number,
        AttendanceStatus
    > = {
        1: "present",
        2: "present",
        3: "late",
        4: "absent",
        5: "present",
        6: "not-marked",
        7: "present",
        8: "present",
        9: "late",
        10: "present",
    };

    const handleStudentSelect = (
        studentId: number
    ) => (
        setSelectedStudentId(studentId)
    )

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
                title="Hifz | Noor Ul Imaan Masjid"
                description="Manage your Noor Ul Imaan Masjid Madrassah Portal Hifz."
            />

            <section className="hifz-section">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-12">
                            <div className="hifz-sec-header d-flex align-items-center justify-content-between">
                                <h1 className="section-title m-0">Hifz</h1>
                                <select className="form-select attendance-class-select" aria-label="Default select example" >
                                    {classOptions.map((option) => (
                                        <option key={option} value={option}>
                                            {option}
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
                                    attendance={attendance}
                                    selectedStudentId={selectedStudentId}
                                    onStudentSelect={handleStudentSelect}
                                />
                            </div>
                        </div>

                        <div className="col-12 col-lg-6">
                            <div ref={rightPanelRef}>
                                {selectedStudentId === null ? (
                                    <HifzEmptyState />
                                ) : (
                                    <HifzStudentDetails />
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