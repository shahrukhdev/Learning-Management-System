
import { useState } from "react";

import { Award, BookOpen, CalendarDays, ChevronLeft, ChevronRight, ClipboardList, GraduationCap } from "lucide-react";

import SEO from "../../../components/Seo/SEO";
import AvatarContent from "../../../components/Avatar/AvatarContent";
import TablePageNumbers from "../../../components/Table/TablePageNumbers";

import { useAuth } from "../../../hooks/useAuth";
import { useMyProgressDetails, useMyProgressRecords } from "../../../hooks/useStudentProgress";
import { formatProgressDate, getGradeClass } from "../../../utils/studentProgress";

import "../../../components/Table/Table.css";
// The `spd-` classes used below (same styles as the Admin details page)
import "../../Admin/StudentProgress/StudentProgressDetails/StudentProgressDetails.css";
import "./MyProgress.css";

// Backend default page size
const RECORDS_PER_PAGE = 10;

const getInitials = (name: string) => {
    const words = name.trim().split(/\s+/).filter(Boolean);

    if (!words.length) return "";

    if (words.length === 1) {
        return words[0][0].toUpperCase();
    }

    return `${words[0][0]}${words[words.length - 1][0]}`.toUpperCase();
};

// Student "My Learning Progress" (read only):
// GET /v1/student-progress/my + GET /v1/student-progress/my/records.
// Separate from the Admin / Teacher Students Progress pages.
const MyProgress = () => {

    const { user } = useAuth();

    /* Profile, summary (all records) and subject chips */

    const { details, error: detailsError, isLoading: isLoadingDetails, retry: retryDetails } = useMyProgressDetails();

    const student = details?.student ?? null;

    const studentName = student?.name || user?.name || "";

    const summary = details?.summary ?? null;

    const courses = details?.courses ?? [];

    /* Subject filter + page (the page resets whenever the filter changes) */

    const [activeCourseId, setActiveCourseId] = useState<number | null>(null);

    const [pageState, setPageState] = useState({ courseId: activeCourseId, page: 1 });

    const page = pageState.courseId === activeCourseId ? pageState.page : 1;

    const goToPage = (nextPage: number) => setPageState({ courseId: activeCourseId, page: nextPage });

    const {
        records,
        pagination,
        error: recordsError,
        isLoading: isLoadingRecords,
        hasLoaded: hasLoadedRecords,
        retry: retryRecords,
    } = useMyProgressRecords({ courseId: activeCourseId, page, perPage: RECORDS_PER_PAGE });

    const totalRecords = pagination?.total ?? records.length;
    const totalPages = Math.max(pagination?.last_page ?? 1, 1);

    // "Latest" = first record of the unfiltered history
    const showLatest = activeCourseId === null && page === 1;

    const hasNoRecordsAtAll = summary !== null && summary.total_records === 0;

    const renderSummaryValue = (value: number | undefined) =>
        summary ? value : isLoadingDetails ? "…" : "—";

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
                        <AvatarContent
                            src={student?.image ?? null}
                            alt={studentName}
                            fallback={<span>{student?.initials || getInitials(studentName)}</span>}
                        />
                    </div>

                    <div className="spd-profile-content">

                        <span className="spd-overline">
                            STUDENT PROFILE
                        </span>

                        <h2>{studentName}</h2>

                        {(student?.email || user?.email) && (
                            <p className="spd-email">
                                {student?.email || user?.email}
                            </p>
                        )}

                        <div className="spd-profile-meta">
                            {student?.class_name && (
                                <span>
                                    <GraduationCap size={15} />
                                    {student.class_name}
                                </span>
                            )}

                            <span>
                                <BookOpen size={15} />
                                Madrassah Student
                            </span>
                        </div>

                        {!details && detailsError && !isLoadingDetails && (
                            <p className="error-text mb-0 mt-2">
                                {detailsError}{" "}
                                <button type="button" className="btn btn-link p-0 align-baseline" onClick={retryDetails}>
                                    Try again
                                </button>
                            </p>
                        )}

                    </div>
                </div>

                {/* Summary Cards (backend counts across all records) */}
                <div className="spd-summary">

                    <div className="spd-summary-card">
                        <div className="spd-summary-icon icon-records">
                            <ClipboardList size={21} />
                        </div>

                        <p>Total Records</p>
                        <h3>{renderSummaryValue(summary?.total_records)}</h3>

                        <span>Progress entries recorded</span>
                    </div>

                    <div className="spd-summary-card">
                        <div className="spd-summary-icon icon-strong">
                            <Award size={21} />
                        </div>

                        <p>Strong Results</p>
                        <h3>{renderSummaryValue(summary?.strong_results)}</h3>

                        <span>Grades A+ and A</span>
                    </div>

                    <div className="spd-summary-card">
                        <div className="spd-summary-icon icon-attention">
                            <BookOpen size={21} />
                        </div>

                        <p>Needs Attention</p>
                        <h3>{renderSummaryValue(summary?.needs_attention)}</h3>

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
                            {totalRecords}{" "}
                            {totalRecords === 1
                                ? "record"
                                : "records"}
                        </span>
                    </div>

                    {/* Subject Filters: "All Subjects" + the student's class courses */}
                    <div className="spd-filters">
                        <button
                            type="button"
                            className={activeCourseId === null ? "spd-filter active" : "spd-filter"}
                            onClick={() => setActiveCourseId(null)}
                        >
                            All Subjects
                        </button>

                        {courses.map((course) => (
                            <button
                                type="button"
                                key={course.id}
                                className={
                                    activeCourseId === course.id
                                        ? "spd-filter active"
                                        : "spd-filter"
                                }
                                onClick={() => setActiveCourseId(course.id)}
                            >
                                {course.name}
                            </button>
                        ))}
                    </div>

                    {/* Progress Records */}
                    {!hasLoadedRecords || (recordsError && records.length === 0) ? (

                        <div className="spd-empty">

                            <div className="spd-empty-icon">
                                <BookOpen size={25} />
                            </div>

                            <h3>
                                {recordsError && !isLoadingRecords
                                    ? "Progress could not be loaded"
                                    : "Loading progress..."}
                            </h3>

                            {recordsError && !isLoadingRecords && (
                                <>
                                    <p>{recordsError}</p>

                                    <button type="button" onClick={retryRecords}>
                                        Try Again
                                    </button>
                                </>
                            )}

                        </div>

                    ) : records.length > 0 ? (

                        <div
                            className="spd-record-list"
                            style={isLoadingRecords ? { opacity: 0.6 } : undefined}
                            aria-busy={isLoadingRecords}
                        >

                            {records.map((entry, index) => {

                                const isLatest = showLatest && index === 0;

                                const date = formatProgressDate(entry.progress_date);

                                return (
                                <article
                                    className={`spd-record ${
                                        isLatest
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
                                                    {entry.course_name && (
                                                        <span className="spd-subject-tag">
                                                            {entry.course_name}
                                                        </span>
                                                    )}

                                                    {isLatest && (
                                                        <span className="spd-latest-tag">
                                                            Latest
                                                        </span>
                                                    )}
                                                </div>

                                                <h3>{entry.lesson}</h3>

                                                {date && (
                                                    <span className="spd-date">
                                                        <CalendarDays size={14} />
                                                        {date}
                                                    </span>
                                                )}

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
                                );
                            })}

                        </div>

                    ) : (

                        <div className="spd-empty">

                            <div className="spd-empty-icon">
                                <BookOpen size={25} />
                            </div>

                            <h3>
                                {activeCourseId === null || hasNoRecordsAtAll
                                    ? "No Progress Yet"
                                    : "No Records for This Subject"}
                            </h3>

                            <p>
                                {activeCourseId === null || hasNoRecordsAtAll
                                    ? "Your learning progress will appear here once your teacher adds your first lesson record."
                                    : "Try selecting another subject to view your progress."}
                            </p>

                        </div>

                    )}

                    {/* Pagination (existing table footer styles), only when needed */}
                    {hasLoadedRecords && totalPages > 1 && (
                        <div className="table-footer">
                            <div className="table-pagination ms-auto">
                                <span>
                                    Page {page} of {totalPages}
                                </span>
                                <button
                                    type="button"
                                    disabled={page <= 1 || isLoadingRecords}
                                    onClick={() => goToPage(page - 1)}
                                    aria-label="Previous page"
                                >
                                    <ChevronLeft size={16} strokeWidth={2} />
                                </button>
                                <TablePageNumbers
                                    page={page}
                                    totalPages={totalPages}
                                    onPageChange={goToPage}
                                    disabled={isLoadingRecords}
                                />
                                <button
                                    type="button"
                                    disabled={page >= totalPages || isLoadingRecords}
                                    onClick={() => goToPage(page + 1)}
                                    aria-label="Next page"
                                >
                                    <ChevronRight size={16} strokeWidth={2} />
                                </button>
                            </div>
                        </div>
                    )}

                </div>

            </section>
        </>
    );
};

export default MyProgress;
