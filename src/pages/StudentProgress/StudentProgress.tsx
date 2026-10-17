import { useState } from "react";

import {
    BookOpen,
    CheckCircle2,
    Eye,
    Plus,
    UserRound,
} from "lucide-react";

import SEO from "../../components/Seo/SEO";

import LogProgressPopup, {
    type ProgressStudent,
    type LogProgressPayload,
} from "../../components/Popups/LogProgressPopup/LogProgressPopup";

import "./StudentProgress.css";

interface StudentProgressData {
    id: number;
    name: string;
    email: string;
    className: string;
    image?: string;
    memorisedSurahs: number;
    totalSurahs: number;
    attendance: number;
    late: number;
    absent: number;
}

const INITIAL_STUDENTS: StudentProgressData[] = [
    {
        id: 1,
        name: "Ahmad Al-Hassan",
        email: "ahmad@madrassah.edu",
        className: "Hifz Level 2",
        memorisedSurahs: 25,
        totalSurahs: 114,
        attendance: 60,
        late: 1,
        absent: 1,
    },
    {
        id: 2,
        name: "Maryam Yusuf",
        email: "maryam@madrassah.edu",
        className: "Arabic Foundations",
        memorisedSurahs: 0,
        totalSurahs: 114,
        attendance: 80,
        late: 0,
        absent: 1,
    },
    {
        id: 3,
        name: "Bilal Karimi",
        email: "bilal@madrassah.edu",
        className: "Hifz Level 1",
        memorisedSurahs: 5,
        totalSurahs: 114,
        attendance: 60,
        late: 1,
        absent: 1,
    },
    {
        id: 4,
        name: "Zainab Osman",
        email: "zainab@madrassah.edu",
        className: "Tajweed Intermediate",
        memorisedSurahs: 0,
        totalSurahs: 114,
        attendance: 80,
        late: 1,
        absent: 0,
    },
    {
        id: 5,
        name: "Uzair",
        email: "uzair@madrassah.edu",
        className: "Tajweed Intermediate",
        memorisedSurahs: 114,
        totalSurahs: 114,
        attendance: 80,
        late: 1,
        absent: 20,
    },
    {
        id: 6,
        name: "Sadaf Jabeen",
        email: "sadaf@madrassah.edu",
        className: "Tajweed Intermediate",
        memorisedSurahs: 20,
        totalSurahs: 114,
        attendance: 80,
        late: 1,
        absent: 0,
    },
    {
        id: 7,
        name: "Ahmed",
        email: "ahmad@madrassah.edu",
        className: "Hifz Level 2",
        memorisedSurahs: 20,
        totalSurahs: 114,
        attendance: 80,
        late: 1,
        absent: 0,
    },
    {
        id: 8,
        name: "Aisha",
        email: "aisha@madrassah.edu",
        className: "Arabic Foundations",
        memorisedSurahs: 20,
        totalSurahs: 114,
        attendance: 80,
        late: 1,
        absent: 0,
    },
    {
        id: 9,
        name: "Bilal",
        email: "bilal@madrassah.edu",
        className: "Hifz Level 2",
        memorisedSurahs: 20,
        totalSurahs: 114,
        attendance: 80,
        late: 1,
        absent: 0,
    },
    {
        id: 10,
        name: "Zainab",
        email: "zainab@madrassah.edu",
        className: "Tajweed Intermediate",
        memorisedSurahs: 20,
        totalSurahs: 114,
        attendance: 80,
        late: 1,
        absent: 0,
    },
];

const getInitials = (name: string) => {
    const words = name.trim().split(/\s+/).filter(Boolean);

    if (words.length === 0) {
        return "";
    }

    if (words.length === 1) {
        return words[0][0].toUpperCase();
    }

    return (
        words[0][0] +
        words[words.length - 1][0]
    ).toUpperCase();
};

const StudentProgress = () => {
    const [students] = useState<StudentProgressData[]>(
        INITIAL_STUDENTS
    );

    const [showLogProgress, setShowLogProgress] = useState(false);

    const [selectedStudentId, setSelectedStudentId] = useState<
        number | null
    >(null);

    /*
     * Popup ke liye student data ka format.
     * Baad mein API se data aaye to isi structure ko map kar sakte hain.
     */
    const progressStudents: ProgressStudent[] = students.map(
        (student) => ({
            id: student.id,
            name: student.name,
            email: student.email,
            className: student.className,
        })
    );

    /*
     * Log Progress button click
     */
    const handleLogProgress = (student: StudentProgressData) => {
        setSelectedStudentId(student.id);
        setShowLogProgress(true);
    };

    /*
     * Popup close
     */
    const handleCloseLogProgress = () => {
        setShowLogProgress(false);
        setSelectedStudentId(null);
    };

    /*
     * Save progress entries.
     * Filhal console mein data jayega.
     * API integration baad mein yahan add hogi.
     */
    const [progressEntries, setProgressEntries] = useState<
        LogProgressPayload[]
    >([]);

    const handleSaveProgress = (data: LogProgressPayload) => {
        setProgressEntries((current) => [...current, data]);

        console.log("New Progress Entry:", data);
        console.log("All Progress Entries:", [
            ...progressEntries,
            data,
        ]);

        setShowLogProgress(false);
        setSelectedStudentId(null);
    };

    const handleViewProgress = (student: StudentProgressData) => {
        console.log("View Progress - Selected Student:", student);

        // View Progress page/popup baad mein connect kar sakte hain.
    };

    return (
        <>
            <SEO
                title="Students Progress | Noor Ul Imaan Masjid"
                description="Manage students progress for Noor Ul Imaan Masjid Madrassah Portal."
            />

            <section className="student-progress-section">
                {/* Page heading */}
                <div className="student-progress-heading">
                    <div>
                        <h1 className="section-title mb-0">
                            Students Progress
                        </h1>
                    </div>

                    <div className="student-progress-count">
                        <UserRound size={16} />

                        <span>
                            {students.length} students
                        </span>
                    </div>
                </div>

                {/* Student cards */}
                <div className="student-progress-grid">
                    {students.map((student) => {
                        const progressPercentage = Math.round(
                            (student.memorisedSurahs /
                                student.totalSurahs) *
                                100
                        );

                        const hasImage = Boolean(student.image);

                        return (
                            <article
                                className="student-progress-card"
                                key={student.id}
                            >
                                {/* Student details */}
                                <div className="student-progress-profile">
                                    <div className="student-progress-avatar">
                                        {hasImage ? (
                                            <img
                                                src={student.image}
                                                alt={student.name}
                                            />
                                        ) : (
                                            <span>
                                                {getInitials(student.name)}
                                            </span>
                                        )}
                                    </div>

                                    <div className="student-progress-identity">
                                        <h2>{student.name}</h2>

                                        <p className="student-progress-email">
                                            {student.email}
                                        </p>

                                        <p className="student-progress-class">
                                            <BookOpen size={13} />

                                            <span>
                                                {student.className}
                                            </span>
                                        </p>
                                    </div>
                                </div>

                                {/* Hifz progress */}
                                <div className="student-hifz-progress">
                                    <div className="student-hifz-progress-info">
                                        <span>Hifz Progress</span>

                                        <strong>
                                            {student.memorisedSurahs}/
                                            {student.totalSurahs}
                                        </strong>
                                    </div>

                                    <div
                                        className="student-hifz-progress-track"
                                        role="progressbar"
                                        aria-label={`${student.name} Hifz progress`}
                                        aria-valuenow={progressPercentage}
                                        aria-valuemin={0}
                                        aria-valuemax={100}
                                    >
                                        <span
                                            style={{
                                                width: `${progressPercentage}%`,
                                            }}
                                        />
                                    </div>

                                    <span className="student-hifz-progress-caption">
                                        {progressPercentage}% of Surahs memorised
                                    </span>
                                </div>

                                {/* Attendance summary */}
                                <div className="student-progress-stats">
                                    <div
                                        className={`student-progress-stat ${
                                            student.attendance < 70
                                                ? "attendance-low"
                                                : "attendance-good"
                                        }`}
                                    >
                                        <strong>
                                            {student.attendance}%
                                        </strong>

                                        <span>Attendance</span>
                                    </div>

                                    <div className="student-progress-stat late-stat">
                                        <strong>{student.late}</strong>

                                        <span>Late</span>
                                    </div>

                                    <div className="student-progress-stat absent-stat">
                                        <strong>{student.absent}</strong>

                                        <span>Absent</span>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="student-progress-actions">
                                    <button
                                        type="button"
                                        className="student-progress-log-button"
                                        onClick={() =>
                                            handleLogProgress(student)
                                        }
                                    >
                                        <Plus size={15} />

                                        <span>Log Progress</span>
                                    </button>

                                    <button
                                        type="button"
                                        className="student-progress-view-button"
                                        onClick={() =>
                                            handleViewProgress(student)
                                        }
                                    >
                                        <Eye size={15} />

                                        <span>View Progress</span>
                                    </button>
                                </div>
                            </article>
                        );
                    })}
                </div>

                {/* Empty state */}
                {students.length === 0 && (
                    <div className="student-progress-empty">
                        <CheckCircle2 size={28} />

                        <h3>No students found</h3>

                        <p>
                            Student progress will appear here.
                        </p>
                    </div>
                )}
            </section>

            {/* Log Progress Popup */}
            {showLogProgress && selectedStudentId !== null && (
                <LogProgressPopup
                    students={progressStudents}
                    selectedStudentId={selectedStudentId}
                    onClose={handleCloseLogProgress}
                    onSave={handleSaveProgress}
                />
            )}
        </>
    );
};

export default StudentProgress;