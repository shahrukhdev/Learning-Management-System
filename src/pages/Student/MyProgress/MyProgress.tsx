
import { useMemo, useState } from "react";

import { Award, BookOpen, CalendarDays, ClipboardList, GraduationCap } from "lucide-react";

import SEO from "../../../components/Seo/SEO";

import type { ProgressStudent, LogProgressPayload } from "../../../components/Popups/LogProgressPopup/LogProgressPopup";

import "../../Admin/StudentProgress/StudentProgress.css";
import "./MyProgress.css";

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

// Temporary demo student
const DEMO_STUDENT: Student = {
    id: 1,
    name: "Muhammad Salman",
    email: "salman@example.com",
    className: "Class A · Morning",
};

// Temporary demo progress records

const DEMO_PROGRESS_ENTRIES: LogProgressPayload[] = [
    {
        id: 5,
        studentId: 1,
        studentName: "Muhammad Salman",
        subject: "Quran",
        lesson: "Surah Al-Baqarah (Ayah 1–20)",
        date: "2026-11-09",
        grade: "A+",
        notes: "Excellent recitation. Keep practicing with proper Tajweed.",
    },
    {
        id: 4,
        studentId: 1,
        studentName: "Muhammad Salman",
        subject: "Tajweed",
        lesson: "Rules of Noon Sakin",
        date: "2026-11-07",
        grade: "A",
        notes: "Good understanding of Tajweed rules.",
    },
    {
        id: 3,
        studentId: 1,
        studentName: "Muhammad Salman",
        subject: "Arabic",
        lesson: "Arabic Vocabulary – Lesson 3",
        date: "2026-11-05",
        grade: "B+",
        notes: "Good effort. Practice vocabulary daily.",
    },
    {
        id: 2,
        studentId: 1,
        studentName: "Muhammad Salman",
        subject: "Fiqh",
        lesson: "Basic Rules of Wudu",
        date: "2026-11-03",
        grade: "C",
        notes: "Needs more revision. Review the basic steps of Wudu.",
    },
    {
        id: 1,
        studentId: 1,
        studentName: "Muhammad Salman",
        subject: "Islamic Studies",
        lesson: "Islamic Manners",
        date: "2026-11-01",
        grade: "A",
        notes: "Very good understanding of the lesson.",
    },
];


const getInitials = (name: string) => {
    const words = name.trim().split(/\s+/).filter(Boolean);

    if (!words.length) return "";

    if (words.length === 1) {
        return words[0][0].toUpperCase();
    }

    return `${words[0][0]}${words[words.length - 1][0]}`.toUpperCase();
};

const formatDate = (date: string) => {
    const parsedDate = new Date(`${date}T00:00:00`);

    if (Number.isNaN(parsedDate.getTime())) {
        return date;
    }

    return parsedDate.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
};

const getGradeClass = (grade: string) => {
    if (grade === "A+" || grade === "A") {
        return "grade-high";
    }

    if (grade === "B+" || grade === "B") {
        return "grade-good";
    }

    return "grade-review";
};

const MyProgress = () => {
    
    const student = DEMO_STUDENT;

    const [progressEntries] = useState<LogProgressPayload[]>(
        DEMO_PROGRESS_ENTRIES
    );

    const [activeSubject, setActiveSubject] = useState("All Subjects");

    // Current student ke progress records
    const studentEntries = useMemo(() => {
        return progressEntries
            .filter((entry) => entry.studentId === student.id)
            .sort((a, b) => b.id - a.id);
    }, [progressEntries, student.id]);

    // Subject filter
    const filteredEntries = useMemo(() => {
        if (activeSubject === "All Subjects") {
            return studentEntries;
        }

        return studentEntries.filter(
            (entry) => entry.subject === activeSubject
        );
    }, [studentEntries, activeSubject]);

    // Summary calculations
    const strongCount = studentEntries.filter(
        (entry) => entry.grade === "A+" || entry.grade === "A"
    ).length;

    const attentionCount = studentEntries.filter(
        (entry) =>
            entry.grade === "C" ||
            entry.grade === "Needs Improvement"
    ).length;

    return (
        <>
            <SEO
                title="My Learning Progress | Noor Ul Imaan Masjid"
                description="View your learning progress, results and teacher feedback."
            />

            <section className="my-progress student-progress-detail">

                {/* Page Heading */}
                <div className="my-progress-head mb-5">
                    <h1 className="section-title">My Learning Progress</h1>
                    <p className="section-desc-para">
                        Track your learning journey, results and teacher feedback.
                    </p>
                </div>

                {/* Student Profile */}
                <div className="spd-profile">

                    <div className="spd-avatar">
                        {student.image ? (
                            <img
                                src={student.image}
                                alt={student.name}
                            />
                        ) : (
                            <span>{getInitials(student.name)}</span>
                        )}
                    </div>

                    <div className="spd-profile-content">

                        <span className="spd-overline">
                            STUDENT PROFILE
                        </span>

                        <h2>{student.name}</h2>

                        <p className="spd-email">
                            {student.email}
                        </p>

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

                {/* Summary Cards */}
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

                {/* Progress History */}
                <div className="spd-history">

                    <div className="spd-history-heading">
                        <div>
                            <span className="spd-overline">
                                YOUR LEARNING ACTIVITY
                            </span>

                            <h2>My Progress History</h2>

                            <p>
                                View your lesson records and teacher feedback.
                            </p>
                        </div>

                        <span className="spd-record-count">
                            {filteredEntries.length}{" "}
                            {filteredEntries.length === 1
                                ? "record"
                                : "records"}
                        </span>
                    </div>

                    {/* Subject Filters */}
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

                    {/* Progress Records */}
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
                                                        activeSubject === "All Subjects" && (
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

                                        {/* Teacher Feedback */}
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
                                    ? "Your learning progress will appear here once your teacher adds your first lesson record."
                                    : "Try selecting another subject to view your progress."}
                            </p>

                        </div>

                    )}

                </div>

            </section>
        </>
    );
};

export default MyProgress;
