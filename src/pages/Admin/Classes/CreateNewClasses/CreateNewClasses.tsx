import { useRef, useState } from "react";
import type { FormEvent } from "react";
import { ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import SEO from "../../../../components/Seo/SEO";
import ClassInformation from "../../../../components/Classes/ClassInformation";
import {
    CLASSES_LIST_PATH,
    EMPTY_CLASS_FORM,
    toClassFormErrors,
    toClassPayload,
    validateClassForm,
    type ClassFormData,
    type ClassFormErrors,
} from "../../../../components/Classes/classForm";
import { createAcademicClass } from "../../../../services/academicClassService";
import { parseApiError } from "../../../../utils/apiError";
import { useCourseOptions } from "../../../../hooks/useCourseOptions";
import "../../Roles/CreateNewRole/CreateNewRole.css";
import { usePermittedPath } from "../../../../hooks/usePermittedPath";
import { PERMISSIONS } from "../../../../utils/permissions";

const CreateNewClass = () => {

    // Back to the list, or the home page without "View Classes"
    const listPath = usePermittedPath(CLASSES_LIST_PATH, PERMISSIONS.VIEW_CLASSES);
    const navigate = useNavigate();
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

    const handleChange = <K extends keyof ClassFormData>(field: K, value: ClassFormData[K]) => {
        setFormData((current) => ({ ...current, [field]: value }));

        // Clear this field's error once it is edited
        setErrors((current) =>
            current[field] ? { ...current, [field]: undefined } : current
        );
    };

    // POST /v1/academic-classes
    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (isSubmittingRef.current) return;

        const clientErrors = validateClassForm(formData);

        if (Object.keys(clientErrors).length > 0) {
            setErrors(clientErrors);
            return;
        }

        isSubmittingRef.current = true;
        setIsSubmitting(true);
        setErrors({});

        try {
            const response = await createAcademicClass(toClassPayload(formData));

            toast.success(response.message || "Class created successfully.");

            // The Classes listing mounts fresh and fetches the list again
            navigate(listPath);
        } catch (error) {
            const { status, message, validationErrors } = parseApiError(error);

            if (status === 401) return; // handled globally

            if (status === 422 && validationErrors) {
                const inlineErrors = toClassFormErrors(validationErrors);

                setErrors(inlineErrors);

                // Only toast if nothing could be shown inline
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
                title="Create New Class - Madrasah Portal"
                description="Create a new class in the Madrasah Portal"
            />
            <section className="admin create-role-section">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-12">
                            <div className="create-role-page-header">
                                <Link
                                    to={listPath}
                                    className="role-back-btn"
                                    aria-label="Back to classes"
                                >
                                    <ArrowLeft size={25} strokeWidth={2.2} />
                                </Link>
                                <div className="create-role-head">
                                    <h1 className="section-title">Create New Class</h1>
                                    <p className="section-desc-para m-0">
                                        Add a new class to the Madrasah portal.
                                    </p>
                                </div>
                            </div>
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
                                                navigate(listPath)
                                            }
                                            disabled={isSubmitting}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="form-btn form-btn-primary"
                                            disabled={isSubmitting}
                                            aria-busy={isSubmitting}
                                        >
                                            {isSubmitting ? "Creating..." : "Create Class"}
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default CreateNewClass;
