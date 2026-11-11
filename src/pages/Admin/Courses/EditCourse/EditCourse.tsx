import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { ArrowLeft } from "lucide-react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import SEO from "../../../../components/Seo/SEO";
import CourseInformation from "../../../../components/Courses/CourseInformation";
import {
    COURSES_LIST_PATH,
    EMPTY_COURSE_FORM,
    toCourseFormData,
    toCourseFormErrors,
    toCoursePayload,
    validateCourseForm,
    type CourseFormData,
    type CourseFormErrors,
} from "../../../../components/Courses/courseForm";
import { getCourse, updateCourse } from "../../../../services/courseService";
import { parseApiError } from "../../../../utils/apiError";
import { useAcademicClassOptions } from "../../../../hooks/useAcademicClassOptions";
import "../../Roles/CreateNewRole/CreateNewRole.css";
import "../../Roles/Roles.css";
import { usePermittedPath } from "../../../../hooks/usePermittedPath";
import { PERMISSIONS } from "../../../../utils/permissions";

// Edit Course at /academic/courses/:courseId/edit. The listing passes its query
// string (page, per_page, search) in location state so we return to it.
const EditCourse = () => {

    const navigate = useNavigate();

    const location = useLocation();

    const listSearch =
        typeof (location.state as { listSearch?: unknown } | null)?.listSearch === "string"
            ? (location.state as { listSearch: string }).listSearch
            : "";

    // Back to the same listing page/filters, or the home page without "View Courses"
    const backToListPath = usePermittedPath(`${COURSES_LIST_PATH}${listSearch}`, PERMISSIONS.VIEW_COURSES);

    const { courseId: courseIdParam } = useParams<{ courseId: string }>();

    const courseId = Number(courseIdParam);

    const isValidCourseId = Number.isInteger(courseId) && courseId > 0;

    const [formData, setFormData] = useState<CourseFormData>(EMPTY_COURSE_FORM);

    const [errors, setErrors] = useState<CourseFormErrors>({});

    const [isSubmitting, setIsSubmitting] = useState(false);

    // Synchronous guard against double submits
    const isSubmittingRef = useRef(false);

    // Academic class options (Academic Classes API)
    const {
        classes: academicClasses,
        isLoading: academicClassesLoading,
        error: academicClassesError,
        retry: retryAcademicClasses,
    } = useAcademicClassOptions();


    /* Load the course (GET /v1/courses/{id}) */

    const [loadToken, setLoadToken] = useState(0);

    const [loadState, setLoadState] = useState<{ key: string; error: string | null } | null>(null);

    const loadKey = `${courseId}|${loadToken}`;

    const isLoadingCourse = isValidCourseId && loadState?.key !== loadKey;

    const loadError = !isValidCourseId
        ? "This course could not be found."
        : loadState?.key === loadKey
            ? loadState.error
            : null;

    useEffect(() => {

        if (!isValidCourseId) return;

        const controller = new AbortController();

        getCourse(courseId, controller.signal)
            .then((response) => {

                if (controller.signal.aborted) return;

                // All existing values, incl. assigned classes and is_active
                setFormData(toCourseFormData(response.data));

                setErrors({});

                setLoadState({ key: loadKey, error: null });

            })
            .catch((error: unknown) => {

                if (controller.signal.aborted) return;

                const { message } = parseApiError(error);

                setLoadState({ key: loadKey, error: message });

            });

        return () => controller.abort();

    }, [courseId, isValidCourseId, loadKey]);


    const handleChange = <K extends keyof CourseFormData>(field: K, value: CourseFormData[K]) => {
        setFormData((current) => ({ ...current, [field]: value }));

        // Clear this field's error once it is edited
        setErrors((current) =>
            current[field] ? { ...current, [field]: undefined } : current
        );
    };


    /* Update (PUT /v1/courses/{id}) */

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (isSubmittingRef.current || isLoadingCourse || loadError) return;

        const clientErrors = validateCourseForm(formData);

        if (Object.keys(clientErrors).length > 0) {
            setErrors(clientErrors);
            return;
        }

        isSubmittingRef.current = true;
        setIsSubmitting(true);
        setErrors({});

        try {
            // Every field is sent from the loaded values, so untouched optional
            // values and class assignments are kept as they were
            const response = await updateCourse(courseId, toCoursePayload(formData));

            toast.success(response.message || "Course updated successfully.");

            // Back to the same listing page/filters; it refetches on mount
            navigate(backToListPath);
        } catch (error) {
            const { status, message, validationErrors } = parseApiError(error);

            if (status === 401) return; // handled globally

            if (status === 422 && validationErrors) {
                const inlineErrors = toCourseFormErrors(validationErrors);

                setErrors(inlineErrors);

                if (Object.keys(inlineErrors).length === 0) {
                    toast.error(message);
                }
            } else {
                toast.error(message);
            }
        } finally {
            isSubmittingRef.current = false;
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <SEO
                title="Edit Course - Madrasah Portal"
                description="Edit course in the Madrasah Portal"
            />
            <section className="admin create-role-section">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-12">
                            <div className="create-role-page-header">
                                <Link
                                    to={backToListPath}
                                    className="role-back-btn"
                                    aria-label="Back to courses"
                                >
                                    <ArrowLeft size={25} strokeWidth={2.2} />
                                </Link>
                                <div className="create-role-head">
                                    <h1 className="section-title">Edit Course</h1>
                                    <p className="section-desc-para m-0">
                                        Update this course's name and description.
                                    </p>
                                </div>
                            </div>

                            {isLoadingCourse ? (

                                <div className="create-role-card">
                                    <div className="create-role-card-body d-flex justify-content-center align-items-center gap-2 py-5" role="status">
                                        <span className="spinner-border spinner-border-sm" aria-hidden="true"></span>
                                        <span>Loading course...</span>
                                    </div>
                                </div>

                            ) : loadError ? (

                                <div className="create-role-card">
                                    <div className="create-role-card-body d-flex flex-column align-items-center gap-3 py-5 text-center">
                                        <p className="m-0">{loadError}</p>
                                        <div className="form-actions">
                                            <button
                                                type="button"
                                                className="form-btn form-btn-cancel"
                                                onClick={() => navigate(backToListPath)}
                                            >
                                                Back to Courses
                                            </button>
                                            {isValidCourseId && (
                                                <button
                                                    type="button"
                                                    className="form-btn form-btn-primary"
                                                    onClick={() => setLoadToken((token) => token + 1)}
                                                >
                                                    Try Again
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>

                            ) : (

                            <form onSubmit={handleSubmit} noValidate>
                                <CourseInformation
                                    formData={formData}
                                    onChange={handleChange}
                                    errors={errors}
                                    academicClasses={academicClasses}
                                    academicClassesLoading={academicClassesLoading}
                                    academicClassesError={academicClassesError}
                                    onRetryAcademicClasses={retryAcademicClasses}
                                    disabled={isSubmitting}
                                />
                                <div className="create-role-form-actions">
                                    <div className="form-actions">
                                        <button
                                            type="button"
                                            className="form-btn form-btn-cancel"
                                            onClick={() =>
                                                navigate(backToListPath)
                                            }
                                            disabled={isSubmitting}
                                        >
                                            Discard Changes
                                        </button>
                                        <button
                                            type="submit"
                                            className="form-btn form-btn-primary"
                                            disabled={isSubmitting}
                                            aria-busy={isSubmitting}
                                        >
                                            {isSubmitting ? "Saving..." : "Save Course"}
                                        </button>
                                    </div>
                                </div>
                            </form>

                            )}
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default EditCourse;
