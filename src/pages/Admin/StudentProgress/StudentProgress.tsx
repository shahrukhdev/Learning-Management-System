import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import { BookOpen, CheckCircle2, ChevronLeft, ChevronRight, Eye, Plus, UserRound } from "lucide-react";

import SEO from "../../../components/Seo/SEO";

import LogProgressPopup from "../../../components/Popups/LogProgressPopup/LogProgressPopup";
import AvatarContent from "../../../components/Avatar/AvatarContent";
import TablePageNumbers from "../../../components/Table/TablePageNumbers";

import { useProgressStudents } from "../../../hooks/useStudentProgress";
import type { ProgressStudentItem } from "../../../types/studentProgress.types";
import { toPopupStudent } from "../../../utils/studentProgress";

import "../../../components/Table/Table.css";
import "./StudentProgress.css";

// Backend default page size (10 per page)
const PER_PAGE = 10;

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

interface StudentProgressProps {
    // Extra section class (the Teacher page adds "teacher")
    className?: string;
}

// Students Progress list (GET /v1/student-progress). The backend returns all
// students for Super Admin / Admin and only their classes' students for
// Teachers.
const StudentProgress = ({ className = "" }: StudentProgressProps) => {

    const navigate = useNavigate();

    // Page kept in the URL so "Back to Students" returns to the same page
    const [searchParams, setSearchParams] = useSearchParams();

    const page = Math.max(Number.parseInt(searchParams.get("page") ?? "1", 10) || 1, 1);

    const goToPage = (nextPage: number) => {
        setSearchParams((current) => {
            const next = new URLSearchParams(current);
            if (nextPage > 1) next.set("page", String(nextPage));
            else next.delete("page");
            return next;
        });
    };

    const {
        students,
        pagination,
        error,
        isLoading,
        hasLoaded,
        retry,
    } = useProgressStudents({ page, perPage: PER_PAGE });

    const totalResults = pagination?.total ?? students.length;
    const resultsPerPage = pagination?.per_page ?? PER_PAGE;
    const currentPage = pagination?.current_page ?? page;
    const totalPages = Math.max(pagination?.last_page ?? 1, 1);
    const firstResult = totalResults === 0 ? 0 : (currentPage - 1) * resultsPerPage + 1;
    const lastResult = Math.min(currentPage * resultsPerPage, totalResults);

    /*
     * Log Progress popup (subjects/grades are loaded by the popup)
     */
    const [logStudent, setLogStudent] = useState<ProgressStudentItem | null>(null);

    const handleLogProgress = (student: ProgressStudentItem) => {
        setLogStudent(student);
    };

    const handleCloseLogProgress = () => {
        setLogStudent(null);
    };

    // Refresh the list so the record count / last progress date update
    const handleProgressSaved = () => {
        setLogStudent(null);
        retry();
    };

    const handleViewProgress = (student: ProgressStudentItem) => {
        navigate(`/students-progress/${student.id}`, {
            state: {
                student,
                // Back to this page of the list
                backTo: `/students-progress${page > 1 ? `?page=${page}` : ""}`,
            },
        });
    };

    const renderStatus = () => {
        if (!hasLoaded && isLoading) {
            return (
                <div className="student-progress-empty">
                    <UserRound size={28} />

                    <h3>Loading students...</h3>
                </div>
            );
        }

        if (error && students.length === 0) {
            return (
                <div className="student-progress-empty">
                    <CheckCircle2 size={28} />

                    <h3>Students could not be loaded</h3>

                    <p>{error}</p>

                    <button
                        type="button"
                        className="student-progress-view-button"
                        onClick={retry}
                    >
                        <span>Try Again</span>
                    </button>
                </div>
            );
        }

        if (students.length === 0) {
            return (
                <div className="student-progress-empty">
                    <CheckCircle2 size={28} />

                    <h3>No students found</h3>

                    <p>
                        Student progress will appear here.
                    </p>
                </div>
            );
        }

        return null;
    };

    return (
        <>
            <SEO
                title="Students Progress - Noor Ul Imaan Masjid"
                description="Manage students progress for Noor Ul Imaan Masjid Madrassah Portal."
            />

            <section className={`${className} student-progress-section`.trim()}>
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
                            {hasLoaded ? totalResults : "—"} students
                        </span>
                    </div>
                </div>

                {/* Student cards */}
                {students.length > 0 && (
                <div
                    className="student-progress-grid"
                    style={isLoading ? { opacity: 0.6 } : undefined}
                    aria-busy={isLoading}
                >
                    {students.map((student) => {

                        const memorisedSurahs = student.memorised_surahs ?? 0;

                        const totalSurahs = student.total_surahs ?? 0;

                        const progressPercentage = Math.round(student.hifz_percentage ?? 0);

                        const attendance = student.attendance ?? 0;

                        const late = student.late ?? 0;

                        const absent = student.absent ?? 0;

                        return (
                            <div
                                className="student-progress-card"
                                key={student.id}
                            >
                                {/* Student details */}
                                <div className="student-progress-profile">
                                    <div className="student-progress-avatar">
                                        <AvatarContent
                                            src={student.image}
                                            alt={student.name}
                                            fallback={
                                                <span>
                                                    {student.initials || getInitials(student.name)}
                                                </span>
                                            }
                                        />
                                    </div>

                                    <div className="student-progress-identity">
                                        <h2>{student.name}</h2>

                                        <p className="student-progress-email">
                                            {student.email}
                                        </p>

                                        <p className="student-progress-class">
                                            <BookOpen size={13} />

                                            <span>
                                                {student.class_name || "No class assigned"}
                                            </span>
                                        </p>
                                    </div>
                                </div>

                                {/* Hifz progress */}
                                <div className="student-hifz-progress">
                                    <div className="student-hifz-progress-info">
                                        <span>Hifz Progress</span>

                                        <strong>
                                            {memorisedSurahs}/
                                            {totalSurahs}
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
                                            attendance < 70
                                                ? "attendance-low"
                                                : "attendance-good"
                                        }`}
                                    >
                                        <strong>
                                            {attendance}%
                                        </strong>

                                        <span>Attendance</span>
                                    </div>

                                    <div className="student-progress-stat late-stat">
                                        <strong>{late}</strong>

                                        <span>Late</span>
                                    </div>

                                    <div className="student-progress-stat absent-stat">
                                        <strong>{absent}</strong>

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
                            </div>
                        );
                    })}
                </div>
                )}

                {/* Loading / error / empty state */}
                {renderStatus()}

                {/* Pagination (existing table footer styles) */}
                {hasLoaded && totalResults > 0 && (
                    <div className="table-footer">
                        <div className="table-results">
                            Showing <strong>{firstResult}</strong>–<strong>{lastResult}</strong> of{" "}
                            <strong>{totalResults}</strong> students
                        </div>
                        <div className="table-pagination">
                            <span>
                                Page {page} of {totalPages}
                            </span>
                            <button
                                type="button"
                                disabled={page <= 1 || isLoading}
                                onClick={() => goToPage(page - 1)}
                                aria-label="Previous page"
                            >
                                <ChevronLeft size={16} strokeWidth={2} />
                            </button>
                            <TablePageNumbers
                                page={page}
                                totalPages={totalPages}
                                onPageChange={goToPage}
                                disabled={isLoading}
                            />
                            <button
                                type="button"
                                disabled={page >= totalPages || isLoading}
                                onClick={() => goToPage(page + 1)}
                                aria-label="Next page"
                            >
                                <ChevronRight size={16} strokeWidth={2} />
                            </button>
                        </div>
                    </div>
                )}
            </section>

            {/* Log Progress Popup */}
            {logStudent && (
                <LogProgressPopup
                    key={logStudent.id}
                    student={toPopupStudent(logStudent)}
                    onClose={handleCloseLogProgress}
                    onSaved={handleProgressSaved}
                />
            )}
        </>
    );
};

export default StudentProgress;
