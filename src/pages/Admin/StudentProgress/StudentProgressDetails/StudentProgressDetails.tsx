
import { useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import { ArrowLeft, Award, BookOpen, CalendarDays, ChevronLeft, ChevronRight, ClipboardList, GraduationCap, Pencil, Plus, Trash2, UserRound, X } from "lucide-react";
import { toast } from "react-toastify";

import SEO from "../../../../components/Seo/SEO";

import LogProgressPopup from "../../../../components/Popups/LogProgressPopup/LogProgressPopup";
import AvatarContent from "../../../../components/Avatar/AvatarContent";
import TablePageNumbers from "../../../../components/Table/TablePageNumbers";

import { useStudentProgressDetails, useStudentProgressRecords } from "../../../../hooks/useStudentProgress";
import { deleteStudentProgressRecord } from "../../../../services/studentProgressService";
import { parseApiError } from "../../../../utils/apiError";
import type { ProgressStudentItem, StudentProgressRecord } from "../../../../types/studentProgress.types";
import { formatProgressDate, getGradeClass, toPopupStudent } from "../../../../utils/studentProgress";

import "../../../../components/Table/Table.css";
import "../../../../components/Popups/LogProgressPopup/LogProgressPopup.css";
import "./StudentProgressDetails.css";
import { usePermissions } from "../../../../hooks/usePermissions";
import { usePermittedPath } from "../../../../hooks/usePermittedPath";
import { PERMISSIONS } from "../../../../utils/permissions";

const LIST_PATH = "/students-progress";

// Backend default page size (10 per page)
const RECORDS_PER_PAGE = 10;

const getInitials = (name: string) => {
    const words = name.trim().split(/\s+/).filter(Boolean);

    if (!words.length) return "";
    if (words.length === 1) return words[0][0].toUpperCase();

    return `${words[0][0]}${words[words.length - 1][0]}`.toUpperCase();
};

interface DeleteProgressDialogProps {
    lesson: string;
    isDeleting: boolean;
    onCancel: () => void;
    onConfirm: () => void;
}

// Delete confirmation in the Log Progress popup style
const DeleteProgressDialog = ({ lesson, isDeleting, onCancel, onConfirm }: DeleteProgressDialogProps) => (
    <div
        className="log-progress-overlay"
        onMouseDown={(event) => {
            if (event.target === event.currentTarget && !isDeleting) onCancel();
        }}
    >
        <div
            className="log-progress-popup spd-confirm-popup"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="spd-delete-title"
            aria-describedby="spd-delete-text"
        >
            <div className="log-progress-header">
                <div className="log-progress-heading">
                    <span className="log-progress-heading-icon spd-confirm-icon">
                        <Trash2 size={20} />
                    </span>

                    <div>
                        <h2 id="spd-delete-title">Delete Progress Record</h2>
                    </div>
                </div>

                <button
                    type="button"
                    className="log-progress-close"
                    onClick={onCancel}
                    disabled={isDeleting}
                    aria-label="Close popup"
                >
                    <X size={20} />
                </button>
            </div>

            <p id="spd-delete-text" className="spd-confirm-text">
                Are you sure you want to delete &ldquo;{lesson}&rdquo;? This cannot be undone.
            </p>

            <div className="log-progress-actions">
                <button
                    type="button"
                    className="log-progress-cancel"
                    onClick={onCancel}
                    disabled={isDeleting}
                >
                    Cancel
                </button>

                <button
                    type="button"
                    className="log-progress-save spd-confirm-delete"
                    onClick={onConfirm}
                    disabled={isDeleting}
                    aria-busy={isDeleting}
                >
                    {isDeleting ? "Deleting..." : "Delete"}
                </button>
            </div>
        </div>
    </div>
);

interface StudentProgressDetailsProps {
    // Extra section class (the Teacher page adds "teacher")
    className?: string;
}

// Student Progress details: profile + summary + subjects
// (GET /v1/student-progress/{id}) and the paginated history
// (GET /v1/student-progress/{id}/records, optionally by course).
const StudentProgressDetails = ({ className = "" }: StudentProgressDetailsProps) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { studentId: studentIdParam } = useParams();

    const parsedId = Number(studentIdParam);

    const studentId = Number.isInteger(parsedId) && parsedId > 0 ? parsedId : null;

    const sectionClassName = `${className} student-progress-detail`.trim();

    // List card data passed on navigation: shown while the profile loads
    const stateStudent = location.state?.student as ProgressStudentItem | undefined;

    /* Permissions ("View Student Progress" is checked by the route) */

    const { hasPermission } = usePermissions();

    const canCreate = hasPermission(PERMISSIONS.CREATE_STUDENT_PROGRESS);

    const canEdit = hasPermission(PERMISSIONS.EDIT_STUDENT_PROGRESS);

    const canDelete = hasPermission(PERMISSIONS.DELETE_STUDENT_PROGRESS);

    const canViewList = hasPermission(PERMISSIONS.VIEW_STUDENT_PROGRESS_LIST);

    // "Back to Students" goes to the list only with "View Student Progress
    // List", otherwise to the user's home page
    const listPath = usePermittedPath(LIST_PATH, PERMISSIONS.VIEW_STUDENT_PROGRESS_LIST);

    const stateBackTo = typeof location.state?.backTo === "string" ? location.state.backTo : LIST_PATH;

    const backTo = canViewList ? stateBackTo : listPath;

    const {
        details,
        error: detailsError,
        isNotFound,
        isLoading: isLoadingDetails,
        retry: retryDetails,
    } = useStudentProgressDetails(studentId);

    const student = details?.student ?? (stateStudent && stateStudent.id === studentId ? stateStudent : null);

    /* Subject filter + page (the page resets whenever the filter changes) */

    const [activeCourseState, setActiveCourseState] = useState<{ studentId: number | null; courseId: number | null }>({
        studentId,
        courseId: null,
    });

    // A filter chosen for another student never applies here
    const activeCourseId = activeCourseState.studentId === studentId ? activeCourseState.courseId : null;

    const filterKey = `${studentId}-${activeCourseId}`;

    const [pageState, setPageState] = useState({ key: filterKey, page: 1 });

    const page = pageState.key === filterKey ? pageState.page : 1;

    const goToPage = (nextPage: number) => setPageState({ key: filterKey, page: nextPage });

    const selectCourse = (courseId: number | null) => setActiveCourseState({ studentId, courseId });

    const {
        records,
        pagination,
        error: recordsError,
        isLoading: isLoadingRecords,
        hasLoaded: hasLoadedRecords,
        retry: retryRecords,
    } = useStudentProgressRecords({
        studentId: isNotFound ? null : studentId,
        courseId: activeCourseId,
        page,
        perPage: RECORDS_PER_PAGE,
    });

    const totalRecords = pagination?.total ?? records.length;
    const totalPages = Math.max(pagination?.last_page ?? 1, 1);
    const resultsPerPage = pagination?.per_page ?? RECORDS_PER_PAGE;
    const currentPage = pagination?.current_page ?? page;
    const firstResult = totalRecords === 0 ? 0 : (currentPage - 1) * resultsPerPage + 1;
    const lastResult = Math.min(currentPage * resultsPerPage, totalRecords);

    const summary = details?.summary ?? null;

    const courses = details?.courses ?? [];

    // "Latest" = first record of the unfiltered history
    const showLatest = activeCourseId === null && page === 1;

    const [showPopup, setShowPopup] = useState(false);

    // Record being edited (same popup in edit mode)
    const [editRecord, setEditRecord] = useState<StudentProgressRecord | null>(null);

    // Summary cards and the current history page both change
    const refreshAll = () => {
        retryDetails();
        retryRecords();
    };

    const openCreate = () => {
        if (canCreate) setShowPopup(true);
    };

    const openEdit = (record: StudentProgressRecord) => {
        if (canEdit) setEditRecord(record);
    };

    const openDelete = (record: StudentProgressRecord) => {
        if (canDelete) setDeleteRecord(record);
    };

    const handleSaveProgress = () => {
        setShowPopup(false);
        setEditRecord(null);
        refreshAll();
    };

    // Edit target was deleted meanwhile
    const handleRecordMissing = () => {
        setEditRecord(null);
        refreshAll();
    };

    /* Delete (confirm first; the API is called only on confirm) */

    const [deleteRecord, setDeleteRecord] = useState<StudentProgressRecord | null>(null);

    // Record whose request is running (its buttons are disabled)
    const [busyRecordId, setBusyRecordId] = useState<number | null>(null);

    const isDeletingRef = useRef(false);

    const handleCancelDelete = () => {
        if (!isDeletingRef.current) setDeleteRecord(null);
    };

    const handleConfirmDelete = async () => {
        if (!deleteRecord || studentId === null || isDeletingRef.current || !canDelete) return;

        const target = deleteRecord;

        isDeletingRef.current = true;
        setBusyRecordId(target.id);

        // The last record of a page above 1: show the previous page
        const leavesPageEmpty = records.length === 1 && page > 1;

        const finish = () => {
            setDeleteRecord(null);

            retryDetails();

            if (leavesPageEmpty) goToPage(page - 1);
            else retryRecords();
        };

        try {
            const response = await deleteStudentProgressRecord(studentId, target.id);

            toast.success(response.message || "Progress record deleted successfully.");

            finish();
        } catch (error) {
            const { status, message } = parseApiError(error);

            if (status === 404) {
                toast.error("This record no longer exists.");
                finish();
            } else if (status === 403) {
                toast.error("You are not allowed to manage student progress.");
            } else if (status !== 401) {
                toast.error(message || "Something went wrong.");
            }
        } finally {
            isDeletingRef.current = false;
            setBusyRecordId(null);
        }
    };

    const handleBack = () => {
        navigate(backTo);
    };

    if (studentId === null || isNotFound) {

        return (
            <section className={sectionClassName}>
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-12">
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
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    if (!student) {

        return (
            <section className={sectionClassName}>
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-12">
                <div className="spd-empty-page">
                    <UserRound size={38} />
                    <h2>{isLoadingDetails ? "Loading student..." : "Student progress could not be loaded"}</h2>
                    {!isLoadingDetails && detailsError && <p>{detailsError}</p>}
                    {!isLoadingDetails ? (
                        <button type="button" onClick={retryDetails}>
                            Try Again
                        </button>
                    ) : (
                        <button type="button" onClick={handleBack}>
                            <ArrowLeft size={17} />
                            Back to Students
                        </button>
                    )}
                </div>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    const renderSummaryValue = (value: number | undefined) =>
        summary ? value : isLoadingDetails ? "…" : "—";

    return (
        <>
            <SEO
                title={`${student.name} Progress - Noor Ul Imaan Masjid`}
                description={`Learning progress and assessment records for ${student.name}.`}
            />

            <section className={sectionClassName}>
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-12">

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

                    {canCreate && (
                        <button
                            type="button"
                            className="spd-add-button"
                            onClick={openCreate}
                        >
                            <Plus size={18} />
                            Add Progress
                        </button>
                    )}
                </div>

                {/* Student profile */}
                <div className="spd-profile">
                    <div className="spd-avatar">
                        <AvatarContent
                            src={student.image}
                            alt={student.name}
                            fallback={<span>{student.initials || getInitials(student.name)}</span>}
                        />
                    </div>

                    <div className="spd-profile-content">

                        <span className="spd-overline">STUDENT PROFILE</span>
                        <h2>{student.name}</h2>
                        <p className="spd-email">{student.email}</p>

                        <div className="spd-profile-meta">
                            <span>
                                <GraduationCap size={15} />
                                {student.class_name || "No class assigned"}
                            </span>
                            <span>
                                <BookOpen size={15} />
                                {student.admission_number
                                    ? `Admission No. ${student.admission_number}`
                                    : "Madrassah Student"}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Summary (from the API: all records of the student) */}
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
                            {totalRecords}{" "}
                            {totalRecords === 1
                                ? "record"
                                : "records"}
                        </span>
                    </div>

                    {/* Subject filters (the student's class courses) — no search bar */}
                    <div className="spd-filters">
                        <button
                            type="button"
                            className={activeCourseId === null ? "spd-filter active" : "spd-filter"}
                            onClick={() => selectCourse(null)}
                        >
                            All Courses
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
                                onClick={() => selectCourse(course.id)}
                            >
                                {course.name}
                            </button>
                        ))}
                    </div>

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

                                                {formatProgressDate(entry.progress_date) && (
                                                    <span className="spd-date">
                                                        <CalendarDays size={14} />
                                                        {formatProgressDate(entry.progress_date)}
                                                    </span>
                                                )}
                                            </div>

                                            {/* Grade + record actions */}
                                            <div className="spd-record-side">
                                                <span
                                                    className={`spd-grade ${getGradeClass(
                                                        entry.grade
                                                    )}`}
                                                >
                                                    {entry.grade}
                                                </span>

                                                {(canEdit || canDelete) && (
                                                    <div className="spd-record-actions">
                                                        {canEdit && (
                                                            <button
                                                                type="button"
                                                                className="spd-icon-button"
                                                                onClick={() => openEdit(entry)}
                                                                disabled={busyRecordId === entry.id}
                                                                aria-label="Edit progress"
                                                                title="Edit progress"
                                                            >
                                                                <Pencil size={15} />
                                                            </button>
                                                        )}

                                                        {canDelete && (
                                                            <button
                                                                type="button"
                                                                className="spd-icon-button spd-icon-button-danger"
                                                                onClick={() => openDelete(entry)}
                                                                disabled={busyRecordId === entry.id}
                                                                aria-label="Delete progress"
                                                                title="Delete progress"
                                                            >
                                                                <Trash2 size={15} />
                                                            </button>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="spd-feedback">
                                            <span>
                                                Teacher Feedback
                                                {entry.recorded_by_name ? ` · ${entry.recorded_by_name}` : ""}
                                            </span>
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
                                {activeCourseId === null
                                    ? "No Progress Yet"
                                    : "No Records for This Subject"}
                            </h3>

                            <p>
                                {activeCourseId === null
                                    ? "Add the first lesson record to start tracking this student's learning."
                                    : "Try selecting another subject to view its records."}
                            </p>

                            {activeCourseId === null && canCreate && (
                                <button
                                    type="button"
                                    onClick={openCreate}
                                >
                                    <Plus size={17} />
                                    Add First Progress
                                </button>
                            )}
                        </div>
                    )}

                    {/* Pagination (existing table footer styles) */}
                    {hasLoadedRecords && totalPages > 1 && (
                        <div className="table-footer">
                            <div className="table-results">
                                Showing <strong>{firstResult}</strong>–<strong>{lastResult}</strong> of{" "}
                                <strong>{totalRecords}</strong> records
                            </div>
                            <div className="table-pagination">
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
                        </div>
                    </div>
                </div>
            </section>

            {showPopup && canCreate && (
                <LogProgressPopup
                    student={toPopupStudent(student)}
                    // Subjects/grades already loaded here; the popup loads
                    // them itself until then
                    options={details ? { courses: details.courses, grades: details.grades } : null}
                    onClose={() => setShowPopup(false)}
                    onSaved={handleSaveProgress}
                />
            )}

            {/* Edit: the same popup, pre-filled from the record */}
            {editRecord && canEdit && (
                <LogProgressPopup
                    key={editRecord.id}
                    mode="edit"
                    recordId={editRecord.id}
                    initialValues={{
                        course_id: editRecord.course_id ?? 0,
                        lesson: editRecord.lesson,
                        grade: editRecord.grade,
                        notes: editRecord.notes ?? "",
                        progress_date: editRecord.progress_date ?? "",
                        subject: editRecord.course_name,
                    }}
                    student={toPopupStudent(student)}
                    options={details ? { courses: details.courses, grades: details.grades } : null}
                    onClose={() => setEditRecord(null)}
                    onSaved={handleSaveProgress}
                    onRecordMissing={handleRecordMissing}
                />
            )}

            {/* Delete confirmation */}
            {deleteRecord && canDelete && (
                <DeleteProgressDialog
                    lesson={deleteRecord.lesson}
                    isDeleting={busyRecordId === deleteRecord.id}
                    onCancel={handleCancelDelete}
                    onConfirm={handleConfirmDelete}
                />
            )}
        </>
    );
};

export default StudentProgressDetails;
