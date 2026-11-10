import { useRef, useState } from "react";
import type { FormEvent } from "react";
import { ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import SEO from "../../../../components/Seo/SEO";
import CourseInformation from "../../../../components/Courses/CourseInformation";
import {
    COURSES_LIST_PATH,
    EMPTY_COURSE_FORM,
    toCourseFormErrors,
    toCoursePayload,
    validateCourseForm,
    type CourseFormData,
    type CourseFormErrors,
} from "../../../../components/Courses/courseForm";
import { createCourse } from "../../../../services/courseService";
import { parseApiError } from "../../../../utils/apiError";
import { useAcademicClassOptions } from "../../../../hooks/useAcademicClassOptions";
import "../../Roles/CreateNewRole/CreateNewRole.css";

const CreateNewCourse = () => {
    const navigate = useNavigate();
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

    const handleChange = <K extends keyof CourseFormData>(field: K, value: CourseFormData[K]) => {
        setFormData((current) => ({ ...current, [field]: value }));

        // Clear this field's error once it is edited
        setErrors((current) =>
            current[field] ? { ...current, [field]: undefined } : current
        );
    };

    // POST /v1/courses
    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (isSubmittingRef.current) return;

        const clientErrors = validateCourseForm(formData);

        if (Object.keys(clientErrors).length > 0) {
            setErrors(clientErrors);
            return;
        }

        isSubmittingRef.current = true;
        setIsSubmitting(true);
        setErrors({});

        try {
            const response = await createCourse(toCoursePayload(formData));

            toast.success(response.message || "Course created successfully.");

            // The Courses listing mounts fresh and fetches the list again
            navigate(COURSES_LIST_PATH);
        } catch (error) {
            const { status, message, validationErrors } = parseApiError(error);

            if (status === 401) return; // handled globally

            if (status === 422 && validationErrors) {
                const inlineErrors = toCourseFormErrors(validationErrors);

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
                title="Create New Course - Madrasah Portal"
                description="Create a new course in the Madrasah Portal"
            />
            <section className="admin create-role-section">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-12">
                            <div className="create-role-page-header">
                                <Link
                                    to={COURSES_LIST_PATH}
                                    className="role-back-btn"
                                    aria-label="Back to courses"
                                >
                                    <ArrowLeft size={25} strokeWidth={2.2} />
                                </Link>
                                <div className="create-role-head">
                                    <h1 className="section-title">Create New Course</h1>
                                    <p className="section-desc-para m-0">
                                        Add a new course to the Madrasah portal.
                                    </p>
                                </div>
                            </div>
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
                                                navigate(COURSES_LIST_PATH)
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
                                            {isSubmitting ? "Creating..." : "Create Course"}
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

export default CreateNewCourse;
