import { useState } from "react";
import type { FormEvent } from "react";

import {
    X,
    BookOpen,
    ChevronDown,
} from "lucide-react";

import "./LogProgressPopup.css";

export interface ProgressStudent {
    id: number;
    name: string;
    email: string;
    className: string;
}

export interface ProgressEntry {
    id: number;
    studentId: number;
    subject: string;
    lesson: string;
    grade: string;
    notes: string;
    date: string;
}

export interface LogProgressPayload {
    id: number;
    studentId: number;
    studentName: string;
    subject: string;
    lesson: string;
    grade: string;
    notes: string;
    date: string;
}

interface LogProgressPopupProps {
    students: ProgressStudent[];
    selectedStudentId: number;
    onClose: () => void;
    onSave: (data: LogProgressPayload) => void;
}

const SUBJECTS = [
    "Quran",
    "Tajweed",
    "Arabic",
    "Fiqh",
    "Islamic Studies",
];

const GRADES = [
    "A+",
    "A",
    "B+",
    "B",
    "C",
    "Needs Improvement",
];

const getInitials = (name: string) => {
    const words = name.trim().split(/\s+/).filter(Boolean);

    if (words.length === 0) return "";

    if (words.length === 1) {
        return words[0][0].toUpperCase();
    }

    return (
        words[0][0] +
        words[words.length - 1][0]
    ).toUpperCase();
};

const LogProgressPopup = ({
    students,
    selectedStudentId,
    onClose,
    onSave,
}: LogProgressPopupProps) => {
    const [subject, setSubject] = useState("Quran");
    const [lesson, setLesson] = useState("");
    const [grade, setGrade] = useState("A");
    const [notes, setNotes] = useState("");

    // Only the student clicked on the Student Progress page.
    const selectedStudent = students.find(
        (student) => student.id === selectedStudentId
    );

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!selectedStudent || !lesson.trim()) return;

        const payload: LogProgressPayload = {
            id: Date.now(),
            studentId: selectedStudent.id,
            studentName: selectedStudent.name,
            subject,
            lesson: lesson.trim(),
            grade,
            notes: notes.trim(),
            date: new Date().toLocaleDateString("en-CA"),
        };

        onSave(payload);
    };

    return (
        <div
            className="log-progress-overlay"
            onMouseDown={(event) => {
                if (event.target === event.currentTarget) {
                    onClose();
                }
            }}
        >
            <section
                className="log-progress-popup"
                role="dialog"
                aria-modal="true"
                aria-labelledby="log-progress-title"
            >
                {/* Header */}
                <header className="log-progress-header">
                    <div className="log-progress-heading">
                        <span className="log-progress-heading-icon">
                            <BookOpen size={20} />
                        </span>

                        <div>
                            <h2 id="log-progress-title">
                                Log Student Progress
                            </h2>

                            <p>
                                Record a student's learning progress
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        className="log-progress-close"
                        onClick={onClose}
                        aria-label="Close popup"
                    >
                        <X size={20} />
                    </button>
                </header>

                <form
                    className="log-progress-form"
                    onSubmit={handleSubmit}
                >
                    {/* Selected Student */}
                    <div className="log-progress-student-section">
                        <label className="log-progress-label">
                            Selected Student
                        </label>

                        {selectedStudent ? (
                            <div className="log-progress-student-info">
                                <span className="log-progress-avatar">
                                    {getInitials(selectedStudent.name)}
                                </span>

                                <div>
                                    <strong>
                                        {selectedStudent.name}
                                    </strong>

                                    <span>
                                        {selectedStudent.email}
                                    </span>

                                    <span>
                                        {selectedStudent.className}
                                    </span>
                                </div>
                            </div>
                        ) : (
                            <p>
                                Student not found. Please close this
                                popup and select a student again.
                            </p>
                        )}
                    </div>

                    {/* Progress Details */}
                    <div className="log-progress-entries-heading">
                        <div>
                            <h3>Progress Details</h3>

                            <p>
                                Enter the lesson and its assessment.
                            </p>
                        </div>

                        <span className="log-progress-entry-count">
                            1 Entry
                        </span>
                    </div>

                    <div className="log-progress-entry">
                        <div className="log-progress-fields-grid">
                            {/* Subject */}
                            <div className="log-progress-field full-width">
                                <label
                                    className="log-progress-label"
                                    htmlFor="progress-subject"
                                >
                                    Subject
                                </label>

                                <div className="log-progress-select-wrap">
                                    <select
                                        id="progress-subject"
                                        className="log-progress-input"
                                        value={subject}
                                        onChange={(event) =>
                                            setSubject(event.target.value)
                                        }
                                    >
                                        {SUBJECTS.map((item) => (
                                            <option
                                                key={item}
                                                value={item}
                                            >
                                                {item}
                                            </option>
                                        ))}
                                    </select>

                                    <ChevronDown
                                        size={16}
                                        className="log-progress-select-icon"
                                    />
                                </div>
                            </div>

                            {/* Lesson / Topic */}
                            <div className="log-progress-field full-width">
                                <label
                                    className="log-progress-label"
                                    htmlFor="progress-lesson"
                                >
                                    Lesson / Topic
                                </label>

                                <input
                                    id="progress-lesson"
                                    className="log-progress-input"
                                    type="text"
                                    placeholder="e.g. Surah Al-Baqarah 1–10"
                                    value={lesson}
                                    onChange={(event) =>
                                        setLesson(event.target.value)
                                    }
                                    required
                                />
                            </div>

                            {/* Grade */}
                            <div className="log-progress-field full-width">
                                <label
                                    className="log-progress-label"
                                    htmlFor="progress-grade"
                                >
                                    Grade
                                </label>

                                <div className="log-progress-select-wrap">
                                    <select
                                        id="progress-grade"
                                        className="log-progress-input"
                                        value={grade}
                                        onChange={(event) =>
                                            setGrade(event.target.value)
                                        }
                                    >
                                        {GRADES.map((item) => (
                                            <option
                                                key={item}
                                                value={item}
                                            >
                                                {item}
                                            </option>
                                        ))}
                                    </select>

                                    <ChevronDown
                                        size={16}
                                        className="log-progress-select-icon"
                                    />
                                </div>
                            </div>

                            {/* Notes / Feedback */}
                            <div className="log-progress-field full-width">
                                <label
                                    className="log-progress-label"
                                    htmlFor="progress-notes"
                                >
                                    Notes / Feedback
                                </label>

                                <textarea
                                    id="progress-notes"
                                    className="log-progress-input log-progress-textarea"
                                    placeholder="Add feedback or additional notes..."
                                    rows={3}
                                    value={notes}
                                    onChange={(event) =>
                                        setNotes(event.target.value)
                                    }
                                />
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <footer className="log-progress-actions">
                        <button
                            type="button"
                            className="log-progress-cancel"
                            onClick={onClose}
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="log-progress-save"
                            disabled={!selectedStudent}
                        >
                            Save Progress
                        </button>
                    </footer>
                </form>
            </section>
        </div>
    );
};

export default LogProgressPopup;