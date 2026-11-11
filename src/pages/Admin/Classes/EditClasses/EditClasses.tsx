import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { ArrowLeft } from "lucide-react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import SEO from "../../../../components/Seo/SEO";
import ClassInformation from "../../../../components/Classes/ClassInformation";
import {
    CLASSES_LIST_PATH,
    EMPTY_CLASS_FORM,
    toClassFormData,
    toClassFormErrors,
    toClassPayload,
    validateClassForm,
    type ClassFormData,
    type ClassFormErrors,
} from "../../../../components/Classes/classForm";
import { getAcademicClass, updateAcademicClass } from "../../../../services/academicClassService";
import { parseApiError } from "../../../../utils/apiError";
import { useCourseOptions } from "../../../../hooks/useCourseOptions";
import "../../Roles/CreateNewRole/CreateNewRole.css";
import "../../Roles/Roles.css";
import { usePermittedPath } from "../../../../hooks/usePermittedPath";
import { PERMISSIONS } from "../../../../utils/permissions";

// Edit Class at /academic/classes/:classId/edit. The listing passes its query
// string (page, per_page, search) in location state so we return to it.
const EditClass = () => {

    const navigate = useNavigate();

    const location = useLocation();

    const listSearch =
        typeof (location.state as { listSearch?: unknown } | null)?.listSearch === "string"
            ? (location.state as { listSearch: string }).listSearch
            : "";

    // Back to the same listing page/filters, or the home page without "View Classes"
    const backToListPath = usePermittedPath(`${CLASSES_LIST_PATH}${listSearch}`, PERMISSIONS.VIEW_CLASSES);

    const { classId: classIdParam } = useParams<{ classId: string }>();

    const classId = Number(classIdParam);

    const isValidClassId = Number.isInteger(classId) && classId > 0;

    const [formData, setFormData] = useState<ClassFormData>(EMPTY_CLASS_FORM);

    const [errors, setErrors] = useState<ClassFormErrors>({});

    const [isSubmitting, setIsSubmitting] = useState(false);

    // Synchronous guard against double submits
    const isSubmittingRef = useRef(false);

    // Course options (fetched once, shared)
    const {
        courses,
        isLoading: coursesLoading,
        error: coursesError,
        retry: retryCourses,
    } = useCourseOptions();


    /* Load the class (GET /v1/academic-classes/{id}) */

    const [loadToken, setLoadToken] = useState(0);

    const [loadState, setLoadState] = useState<{ key: string; error: string | null } | null>(null);

    const loadKey = `${classId}|${loadToken}`;

    const isLoadingClass = isValidClassId && loadState?.key !== loadKey;

    const loadError = !isValidClassId
        ? "This class could not be found."
        : loadState?.key === loadKey
            ? loadState.error
            : null;

    useEffect(() => {

        if (!isValidClassId) return;

        const controller = new AbortController();

        getAcademicClass(classId, controller.signal)
            .then((response) => {

                if (controller.signal.aborted) return;

                // All existing values, incl. assigned courses and is_active
                setFormData(toClassFormData(response.data));

                setErrors({});

                setLoadState({ key: loadKey, error: null });

            })
            .catch((error: unknown) => {

                if (controller.signal.aborted) return;

                const { message } = parseApiError(error);

                setLoadState({ key: loadKey, error: message });

            });

        return () => controller.abort();

    }, [classId, isValidClassId, loadKey]);


    const handleChange = <K extends keyof ClassFormData>(field: K, value: ClassFormData[K]) => {
        setFormData((current) => ({ ...current, [field]: value }));

        // Clear this field's error once it is edited
        setErrors((current) =>
            current[field] ? { ...current, [field]: undefined } : current
        );
    };


    /* Update (PUT /v1/academic-classes/{id}) */

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (isSubmittingRef.current || isLoadingClass || loadError) return;

        const clientErrors = validateClassForm(formData);

        if (Object.keys(clientErrors).length > 0) {
            setErrors(clientErrors);
            return;
        }

        isSubmittingRef.current = true;
        setIsSubmitting(true);
        setErrors({});

        try {
            // Every field is sent from the loaded values, so untouched optional
            // values and course assignments are kept as they were
            const response = await updateAcademicClass(classId, toClassPayload(formData));

            toast.success(response.message || "Class updated successfully.");

            // Back to the same listing page/filters; it refetches on mount
            navigate(backToListPath);
        } catch (error) {
            const { status, message, validationErrors } = parseApiError(error);

            if (status === 401) return; // handled globally

            if (status === 422 && validationErrors) {
                const inlineErrors = toClassFormErrors(validationErrors);

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
                title="Edit Class - Madrasah Portal"
                description="Edit class in the Madrasah Portal"
            />
            <section className="admin create-role-section">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-12">
                            <div className="create-role-page-header">
                                <Link
                                    to={backToListPath}
                                    className="role-back-btn"
                                    aria-label="Back to classes"
                                >
                                    <ArrowLeft size={25} strokeWidth={2.2} />
                                </Link>
                                <div className="create-role-head">
                                    <h1 className="section-title">Edit Class</h1>
                                    <p className="section-desc-para m-0">
                                        Update this class's name and description.
                                    </p>
                                </div>
                            </div>

                            {isLoadingClass ? (

                                <div className="create-role-card">
                                    <div className="create-role-card-body d-flex justify-content-center align-items-center gap-2 py-5" role="status">
                                        <span className="spinner-border spinner-border-sm" aria-hidden="true"></span>
                                        <span>Loading class...</span>
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
                                                Back to Classes
                                            </button>
                                            {isValidClassId && (
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
                                <ClassInformation
                                    formData={formData}
                                    onChange={handleChange}
                                    errors={errors}
                                    courses={courses}
                                    coursesLoading={coursesLoading}
                                    coursesError={coursesError}
                                    onRetryCourses={retryCourses}
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
                                            {isSubmitting ? "Saving..." : "Save Class"}
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

export default EditClass;
