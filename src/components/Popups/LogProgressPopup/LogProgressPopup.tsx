import { useRef, useState } from "react";
import type { FormEvent } from "react";

import { X, BookOpen, ChevronDown } from "lucide-react";
import { toast } from "react-toastify";

import AvatarContent from "../../Avatar/AvatarContent";
import { useStudentProgressDetails } from "../../../hooks/useStudentProgress";
import { storeStudentProgressRecord, updateStudentProgressRecord } from "../../../services/studentProgressService";
import { getFirstFieldErrors, parseApiError } from "../../../utils/apiError";
import type {
    ProgressCourse,
    ProgressRecordField,
    ProgressRecordFormErrors,
    StudentProgressRecord,
} from "../../../types/studentProgress.types";

import "./LogProgressPopup.css";

// The student shown at the top of the popup
export interface ProgressStudent {
    id: number;
    name: string;
    email: string;
    className: string;
    initials?: string;
    image?: string | null;
}

// Subjects (the student's class courses) and grades from
// GET /v1/student-progress/{id}. Fetched by the popup when not passed.
export interface ProgressOptions {
    courses: ProgressCourse[];
    grades: string[];
}

// Edit mode: the record's current values
export interface ProgressInitialValues {
    course_id: number;
    lesson: string;
    grade: string;
    notes: string;
    progress_date: string; // Y-m-d
    // Shown if the record's subject is no longer one of the class subjects
    subject?: string;
}

interface LogProgressPopupProps {
    student: ProgressStudent;
    options?: ProgressOptions | null;
    // "create" (POST, default) or "edit" (PUT of `recordId`)
    mode?: "create" | "edit";
    recordId?: number;
    initialValues?: ProgressInitialValues;
    onClose: () => void;
    // Called after the POST / PUT succeeds
    onSaved: (record: StudentProgressRecord | null) => void;
    // Edit mode: the record was not found (deleted meanwhile)
    onRecordMissing?: () => void;
}

const DEFAULT_GRADE = "A";

// Today in local time (Y-m-d): the Date field's default and max
const todayYmd = () => new Date().toLocaleDateString("en-CA");

const MAX_LESSON_LENGTH = 255;

const MAX_NOTES_LENGTH = 5000;

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

// Client-side rules (same wording as the backend)
const validate = (
    courseId: string,
    lesson: string,
    grade: string,
    notes: string,
    progressDate: string,
    today: string
): ProgressRecordFormErrors => {
    const errors: ProgressRecordFormErrors = {};

    if (!progressDate) {
        errors.progress_date = "The progress date field is required.";
    } else if (progressDate > today) {
        errors.progress_date = "The progress date field must be a date before or equal to today.";
    }

    if (!courseId) errors.course_id = "The subject field is required.";

    if (!lesson.trim()) {
        errors.lesson = "The lesson / topic field is required.";
    } else if (lesson.trim().length > MAX_LESSON_LENGTH) {
        errors.lesson = `The lesson / topic field must not be greater than ${MAX_LESSON_LENGTH} characters.`;
    }

    if (!grade) errors.grade = "The grade field is required.";

    if (notes.trim().length > MAX_NOTES_LENGTH) {
        errors.notes = `The notes field must not be greater than ${MAX_NOTES_LENGTH} characters.`;
    }

    return errors;
};

const LogProgressPopup = ({
    student,
    options,
    mode = "create",
    recordId,
    initialValues,
    onClose,
    onSaved,
    onRecordMissing,
}: LogProgressPopupProps) => {

    const isEdit = mode === "edit" && recordId !== undefined;

    const [today] = useState(todayYmd);

    // Subjects/grades: from the caller, otherwise loaded here
    const fetched = useStudentProgressDetails(options ? null : student.id);

    const courses = options?.courses ?? fetched.details?.courses ?? [];

    const grades = options?.grades ?? fetched.details?.grades ?? [];

    const isLoadingOptions = !options && fetched.isLoading;

    const optionsError = options ? null : fetched.error;

    // Empty = "use the default" (first subject / grade A), so the defaults
    // apply as soon as the options arrive
    // apply as soon as the options arrive. Edit mode starts from the record.
    const [courseValue, setCourseValue] = useState(() => (initialValues ? String(initialValues.course_id) : ""));
    const [lesson, setLesson] = useState(() => initialValues?.lesson ?? "");
    const [gradeValue, setGradeValue] = useState(() => initialValues?.grade ?? "");
    const [notes, setNotes] = useState(() => initialValues?.notes ?? "");
    const [progressDate, setProgressDate] = useState(() => initialValues?.progress_date || today);

    // The record's subject when it is not (or no longer) a class subject, so
    // editing never silently switches it to another subject
    const legacyCourse =
        initialValues && !courses.some((course) => course.id === initialValues.course_id)
            ? { id: initialValues.course_id, name: initialValues.subject || "Current subject" }
            : null;

    const courseOptions = legacyCourse && !isLoadingOptions ? [legacyCourse, ...courses] : courses;

    const courseId = courseOptions.some((course) => String(course.id) === courseValue)
        ? courseValue
        : courseOptions[0] ? String(courseOptions[0].id) : "";

    // Keep the record's grade even if it is missing from the list
    const gradeOptions =
        initialValues?.grade && grades.length > 0 && !grades.includes(initialValues.grade)
            ? [initialValues.grade, ...grades]
            : grades;

    const grade = gradeOptions.includes(gradeValue)
        ? gradeValue
        : gradeOptions.includes(DEFAULT_GRADE) ? DEFAULT_GRADE : gradeOptions[0] ?? "";

    const [errors, setErrors] = useState<ProgressRecordFormErrors>({});

    const [isSaving, setIsSaving] = useState(false);

    // Synchronous guard against double submits
    const isSavingRef = useRef(false);

    const clearError = (field: ProgressRecordField) => {
        if (errors[field]) setErrors((current) => ({ ...current, [field]: undefined }));
    };

    const handleClose = () => {
        if (!isSavingRef.current) onClose();
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (isSavingRef.current) return;

        const clientErrors = validate(courseId, lesson, grade, notes, progressDate, today);

        if (Object.values(clientErrors).some(Boolean)) {
            setErrors(clientErrors);
            return;
        }

        isSavingRef.current = true;
        setIsSaving(true);
        setErrors({});

        const payload = {
            course_id: Number(courseId),
            lesson: lesson.trim(),
            grade,
            // null clears the notes when editing
            notes: notes.trim() || null,
            progress_date: progressDate,
        };

        try {
            const response = isEdit
                ? await updateStudentProgressRecord(student.id, recordId, payload)
                : await storeStudentProgressRecord(student.id, payload);

            toast.success(
                response.message || (isEdit ? "Progress updated successfully." : "Progress logged successfully.")
            );

            isSavingRef.current = false;

            onSaved(response.record);
        } catch (error) {
            const { status, message, validationErrors } = parseApiError(error);

            if (status === 403) {
                toast.error("You are not allowed to manage student progress.");
            } else if (status === 404 && isEdit) {
                toast.error("This record no longer exists.");

                isSavingRef.current = false;
                setIsSaving(false);

                onRecordMissing?.();
                return;
            }

            if (status === 422 && validationErrors) {
                const fieldErrors = getFirstFieldErrors<string>(validationErrors);

                const inlineErrors: ProgressRecordFormErrors = {
                    course_id: fieldErrors.course_id,
                    lesson: fieldErrors.lesson,
                    grade: fieldErrors.grade,
                    notes: fieldErrors.notes,
                    progress_date: fieldErrors.progress_date,
                };

                setErrors(inlineErrors);

                if (!Object.values(inlineErrors).some(Boolean)) toast.error(message);
            } else if (status !== 401 && status !== 403) {
                // 500 / network: the API's message, else the generic one
                toast.error(message || "Something went wrong.");
            }

            isSavingRef.current = false;
            setIsSaving(false);
        }
    };

    const canSave = !isSaving && !isLoadingOptions && courseOptions.length > 0 && gradeOptions.length > 0;

    return (

        <div className="log-progress-overlay"
            onMouseDown={(event) => {
                if (event.target === event.currentTarget) {
                    handleClose();
                }
            }}
        >
            <div
                className="log-progress-popup"
                role="dialog"
                aria-modal="true"
                aria-labelledby="log-progress-title"
            >
                {/* Header */}
                <div className="log-progress-header">
                    <div className="log-progress-heading">
                        <span className="log-progress-heading-icon">
                            <BookOpen size={20} />
                        </span>

                        <div>
                            <h2 id="log-progress-title">
                                {isEdit ? "Edit Student Progress" : "Log Student Progress"}
                            </h2>

                            <p>
                                {isEdit ? "Update this progress record" : "Record a student's learning progress"}
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        className="log-progress-close"
                        onClick={handleClose}
                        disabled={isSaving}
                        aria-label="Close popup"
                    >
                        <X size={20} />
                    </button>
                </div>

                <form
                    className="log-progress-form"
                    onSubmit={handleSubmit}
                    noValidate
                >
                    {/* Selected Student */}
                    <div className="log-progress-student-section">

                        <div className="log-progress-student-info">
                            <span className="log-progress-avatar">
                                <AvatarContent
                                    src={student.image ?? null}
                                    alt={student.name}
                                    fallback={student.initials || getInitials(student.name)}
                                />
                            </span>

                            <div>
                                <strong>
                                    {student.name}
                                </strong>

                                {student.email && (
                                    <span>
                                        {student.email}
                                    </span>
                                )}

                                {student.className && (
                                    <span>
                                        {student.className}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Progress Details */}
                    <div className="log-progress-entries-heading">
                        <div>
                            <h3>Progress Details</h3>

                            <p>
                                Enter the lesson and its assessment.
                            </p>
                        </div>

                    </div>

                    <div className="log-progress-entry">
                        <div className="log-progress-fields-grid">
                            {/* Subject: the student's class courses */}
                            <div className="log-progress-field full-width">
                                <label
                                    className="log-progress-label"
                                    htmlFor="progress-subject"
                                >
                                    Course<span className="required-mark" aria-hidden="true">*</span>
                                </label>

                                <div className="log-progress-select-wrap">
                                    <select
                                        id="progress-subject"
                                        className="log-progress-input"
                                        value={courseId}
                                        onChange={(event) => {
                                            setCourseValue(event.target.value);
                                            clearError("course_id");
                                        }}
                                        disabled={isSaving || courseOptions.length === 0}
                                        aria-invalid={Boolean(errors.course_id)}
                                    >
                                        {courseOptions.length === 0 && (
                                            <option value="">
                                                {isLoadingOptions
                                                    ? "Loading..."
                                                    : optionsError
                                                        ? "Subjects could not be loaded"
                                                        : "No subjects assigned"}
                                            </option>
                                        )}
                                        {courseOptions.map((course) => (
                                            <option
                                                key={course.id}
                                                value={course.id}
                                            >
                                                {course.name}
                                            </option>
                                        ))}
                                    </select>

                                    <ChevronDown
                                        size={16}
                                        className="log-progress-select-icon"
                                    />
                                </div>

                                {errors.course_id && (
                                    <span className="error-text">{errors.course_id}</span>
                                )}

                                {!isLoadingOptions && !optionsError && courseOptions.length === 0 && (
                                    <span className="error-text">
                                        No subjects are assigned to this student's class.
                                    </span>
                                )}

                                {optionsError && (
                                    <span className="error-text">
                                        {optionsError}{" "}
                                        <button
                                            type="button"
                                            className="btn btn-link p-0 align-baseline"
                                            onClick={fetched.retry}
                                        >
                                            Retry
                                        </button>
                                    </span>
                                )}
                            </div>

                            {/* Lesson / Topic */}
                            <div className="log-progress-field full-width">
                                <label
                                    className="log-progress-label"
                                    htmlFor="progress-lesson"
                                >
                                    Lesson / Topic<span className="required-mark" aria-hidden="true">*</span>
                                </label>

                                <input
                                    id="progress-lesson"
                                    className="log-progress-input"
                                    type="text"
                                    placeholder="e.g. Surah Al-Baqarah 1–10"
                                    value={lesson}
                                    onChange={(event) => {
                                        setLesson(event.target.value);
                                        clearError("lesson");
                                    }}
                                    maxLength={MAX_LESSON_LENGTH}
                                    disabled={isSaving}
                                    aria-invalid={Boolean(errors.lesson)}
                                    required
                                />

                                {errors.lesson && (
                                    <span className="error-text">{errors.lesson}</span>
                                )}
                            </div>

                            {/* Grade */}
                            <div className="log-progress-field full-width">
                                <label
                                    className="log-progress-label"
                                    htmlFor="progress-grade"
                                >
                                    Grade<span className="required-mark" aria-hidden="true">*</span>
                                </label>

                                <div className="log-progress-select-wrap">
                                    <select
                                        id="progress-grade"
                                        className="log-progress-input"
                                        value={grade}
                                        onChange={(event) => {
                                            setGradeValue(event.target.value);
                                            clearError("grade");
                                        }}
                                        disabled={isSaving || gradeOptions.length === 0}
                                        aria-invalid={Boolean(errors.grade)}
                                    >
                                        {gradeOptions.length === 0 && (
                                            <option value="">
                                                {isLoadingOptions ? "Loading..." : "No grades available"}
                                            </option>
                                        )}
                                        {gradeOptions.map((item) => (
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

                                {errors.grade && (
                                    <span className="error-text">{errors.grade}</span>
                                )}
                            </div>

                            {/* Date (today by default, never in the future) */}
                            <div className="log-progress-field full-width">
                                <label
                                    className="log-progress-label"
                                    htmlFor="progress-date"
                                >
                                    Date<span className="required-mark" aria-hidden="true">*</span>
                                </label>

                                <input
                                    id="progress-date"
                                    className="log-progress-input"
                                    type="date"
                                    value={progressDate}
                                    max={today}
                                    onChange={(event) => {
                                        setProgressDate(event.target.value);
                                        clearError("progress_date");
                                    }}
                                    disabled={isSaving}
                                    aria-invalid={Boolean(errors.progress_date)}
                                    required
                                />

                                {errors.progress_date && (
                                    <span className="error-text">{errors.progress_date}</span>
                                )}
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
                                    onChange={(event) => {
                                        setNotes(event.target.value);
                                        clearError("notes");
                                    }}
                                    maxLength={MAX_NOTES_LENGTH}
                                    disabled={isSaving}
                                    aria-invalid={Boolean(errors.notes)}
                                />

                                {errors.notes && (
                                    <span className="error-text">{errors.notes}</span>
                                )}

                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="log-progress-actions">
                        <button
                            type="button"
                            className="log-progress-cancel"
                            onClick={handleClose}
                            disabled={isSaving}
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="log-progress-save"
                            disabled={!canSave}
                            aria-busy={isSaving}
                        >
                            {isSaving ? "Saving..." : isEdit ? "Update Progress" : "Save Progress"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LogProgressPopup;
