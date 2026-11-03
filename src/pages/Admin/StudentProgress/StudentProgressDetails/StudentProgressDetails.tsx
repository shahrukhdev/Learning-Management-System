
import { useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import { ArrowLeft, Award, BookOpen, CalendarDays, ClipboardList, GraduationCap, Plus, UserRound } from "lucide-react";

import SEO from "../../../../components/Seo/SEO";

import LogProgressPopup, { type ProgressStudent, type LogProgressPayload } from "../../../../components/Popups/LogProgressPopup/LogProgressPopup";

import { INITIAL_STUDENTS } from "../StudentProgress";
import "./StudentProgressDetails.css";

const SUBJECTS = [
    "All Subjects",
    "Quran",
    "Tajweed",
    "Arabic",
    "Fiqh",
    "Islamic Studies",
];

type Student = ProgressStudent & {
    image?: string;
};

const getInitials = (name: string) => {
    const words = name.trim().split(/\s+/).filter(Boolean);

    if (!words.length) return "";
    if (words.length === 1) return words[0][0].toUpperCase();

    return `${words[0][0]}${words[words.length - 1][0]}`.toUpperCase();
};

const formatDate = (date: string) => {
    const parsedDate = new Date(`${date}T00:00:00`);

    if (Number.isNaN(parsedDate.getTime())) return date;

    return parsedDate.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
};

const getGradeClass = (grade: string) => {
    if (grade === "A+" || grade === "A") return "grade-high";
    if (grade === "B+" || grade === "B") return "grade-good";
    return "grade-review";
};

const StudentProgressDetails = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { studentId } = useParams();

    const students = INITIAL_STUDENTS as Student[];

    const student = useMemo(() => {
        const stateStudent = location.state?.student as Student | undefined;

        if (stateStudent && String(stateStudent.id) === studentId) {
            return stateStudent;
        }

        return students.find(
            (item) => String(item.id) === studentId
        );
    }, [location.state, studentId, students]);

    const [progressEntries, setProgressEntries] = useState<
        LogProgressPayload[]
    >(() => location.state?.progressEntries ?? []);

    const [activeSubject, setActiveSubject] = useState("All Subjects");
    const [showPopup, setShowPopup] = useState(false);

    const popupStudents: ProgressStudent[] = students.map((item) => ({
        id: item.id,
        name: item.name,
        email: item.email,
        className: item.className,
    }));

    const studentEntries = useMemo(() => {
        if (!student) return [];

        return progressEntries
            .filter((entry) => entry.studentId === student.id)
            .sort((a, b) => b.id - a.id);
    }, [progressEntries, student]);

    const filteredEntries = useMemo(() => {
        if (activeSubject === "All Subjects") {
            return studentEntries;
        }

        return studentEntries.filter(
            (entry) => entry.subject === activeSubject
        );
    }, [studentEntries, activeSubject]);

    const strongCount = studentEntries.filter(
        (entry) => entry.grade === "A+" || entry.grade === "A"
    ).length;

    const attentionCount = studentEntries.filter(
        (entry) =>
            entry.grade === "C" ||
            entry.grade === "Needs Improvement"
    ).length;

    const handleSaveProgress = (data: LogProgressPayload) => {
        setProgressEntries((current) => [data, ...current]);
        setShowPopup(false);
    };

    const handleBack = () => {
        navigate("/students-progress", {
            state: { progressEntries },
        });
    };

    if (!student) {

        return (
            <section className="student-progress-detail">
                <div className="spd-empty-page">
                    <UserRound size={38} />
                    <h2>Student Not Found</h2>
                    <p>
                        Please return to the student list and select a
                        student to view their progress.
                    </p>
                    <button type="button" onClick={handleBack}>
                        <ArrowLeft size={17} />
                        Back to Students
                    </button>
                </div>
            </section>
        );
    }

    return (
        <>
            <SEO
                title={`${student.name} Progress | Noor Ul Imaan Masjid`}
                description={`Learning progress and assessment records for ${student.name}.`}
            />

            <section className="student-progress-detail">

                {/* Page heading */}
                <div className="spd-page-heading">
                    <div>
                        <button
                            type="button"
                            className="spd-back-button"
                            onClick={handleBack}
                        >
                            <ArrowLeft size={16} />
                            Back to Students
                        </button>

                        <h1>Student Progress</h1>
                        <p>Review lessons, results and teacher feedback.</p>
                    </div>

                    <button
                        type="button"
                        className="spd-add-button"
                        onClick={() => setShowPopup(true)}
                    >
                        <Plus size={18} />
                        Add Progress
                    </button>
                </div>

                {/* Student profile */}
                <div className="spd-profile">
                    <div className="spd-avatar">
                        {student.image ? (
                            <img src={student.image} alt={student.name} />
                        ) : (
                            <span>{getInitials(student.name)}</span>
                        )}
                    </div>

                    <div className="spd-profile-content">

                        <span className="spd-overline">STUDENT PROFILE</span>
                        <h2>{student.name}</h2>
                        <p className="spd-email">{student.email}</p>

                        <div className="spd-profile-meta">
                            <span>
                                <GraduationCap size={15} />
                                {student.className}
                            </span>
                            <span>
                                <BookOpen size={15} />
                                Madrassah Student
                            </span>
                        </div>
                    </div>
                </div>

                {/* Summary */}
                <div className="spd-summary">

                    <div className="spd-summary-card">
                        <div className="spd-summary-icon icon-records">
                            <ClipboardList size={21} />
                        </div>
                        <p>Total Records</p>
                        <h3>{studentEntries.length}</h3>
                        <span>Progress entries recorded</span>
                    </div>

                    <div className="spd-summary-card">
                        <div className="spd-summary-icon icon-strong">
                            <Award size={21} />
                        </div>
                        <p>Strong Results</p>
                        <h3>{strongCount}</h3>
                        <span>Grades A+ and A</span>
                    </div>

                    <div className="spd-summary-card">
                        <div className="spd-summary-icon icon-attention">
                            <BookOpen size={21} />
                        </div>
                        <p>Needs Attention</p>
                        <h3>{attentionCount}</h3>
                        <span>Grades needing improvement</span>
                    </div>
                    
                </div>

                {/* Progress history */}
                <div className="spd-history">
                    <div className="spd-history-heading">
                        <div>
                            <span className="spd-overline">
                                LEARNING ACTIVITY
                            </span>
                            <h2>Progress History</h2>
                            <p>
                                The most recently added progress appears first.
                            </p>
                        </div>

                        <span className="spd-record-count">
                            {filteredEntries.length}{" "}
                            {filteredEntries.length === 1
                                ? "record"
                                : "records"}
                        </span>
                    </div>

                    {/* Subject filters — no search bar */}
                    <div className="spd-filters">
                        {SUBJECTS.map((subjectName) => (
                            <button
                                type="button"
                                key={subjectName}
                                className={
                                    activeSubject === subjectName
                                        ? "spd-filter active"
                                        : "spd-filter"
                                }
                                onClick={() => setActiveSubject(subjectName)}
                            >
                                {subjectName}
                            </button>
                        ))}
                    </div>

                    {filteredEntries.length > 0 ? (
                        <div className="spd-record-list">
                            {filteredEntries.map((entry, index) => (
                                <article
                                    className={`spd-record ${
                                        index === 0 &&
                                        activeSubject === "All Subjects"
                                            ? "spd-record-latest"
                                            : ""
                                    }`}
                                    key={entry.id}
                                >
                                    <div className="spd-record-icon">
                                        <BookOpen size={19} />
                                    </div>

                                    <div className="spd-record-content">
                                        <div className="spd-record-heading">
                                            <div className="spd-record-title">
                                                <div className="spd-record-tags">
                                                    <span className="spd-subject-tag">
                                                        {entry.subject}
                                                    </span>

                                                    {index === 0 &&
                                                        activeSubject ===
                                                            "All Subjects" && (
                                                            <span className="spd-latest-tag">
                                                                Latest
                                                            </span>
                                                        )}
                                                </div>

                                                <h3>{entry.lesson}</h3>

                                                <span className="spd-date">
                                                    <CalendarDays size={14} />
                                                    {formatDate(entry.date)}
                                                </span>
                                            </div>

                                            <span
                                                className={`spd-grade ${getGradeClass(
                                                    entry.grade
                                                )}`}
                                            >
                                                {entry.grade}
                                            </span>
                                        </div>

                                        <div className="spd-feedback">
                                            <span>Teacher Feedback</span>
                                            <p>
                                                {entry.notes ||
                                                    "No feedback has been added for this lesson."}
                                            </p>
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>
                    ) : (
                        <div className="spd-empty">
                            <div className="spd-empty-icon">
                                <BookOpen size={25} />
                            </div>

                            <h3>
                                {studentEntries.length === 0
                                    ? "No Progress Yet"
                                    : "No Records for This Subject"}
                            </h3>

                            <p>
                                {studentEntries.length === 0
                                    ? "Add the first lesson record to start tracking this student's learning."
                                    : "Try selecting another subject to view its records."}
                            </p>

                            {studentEntries.length === 0 && (
                                <button
                                    type="button"
                                    onClick={() => setShowPopup(true)}
                                >
                                    <Plus size={17} />
                                    Add First Progress
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </section>

            {showPopup && (
                <LogProgressPopup
                    students={popupStudents}
                    selectedStudentId={student.id}
                    onClose={() => setShowPopup(false)}
                    onSave={handleSaveProgress}
                />
            )}
        </>
    );
};

export default StudentProgressDetails;
