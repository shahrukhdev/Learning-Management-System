import CourseMultiSelect from "./CourseMultiSelect";
import type { ClassFormData, ClassFormErrors } from "./classForm";
import type { ClassCourseSummary } from "../../types/academicClass.types";

export type { ClassFormData } from "./classForm";

interface ClassInformationProps {
    formData: ClassFormData;
    onChange: <K extends keyof ClassFormData>(field: K, value: ClassFormData[K]) => void;
    errors?: ClassFormErrors;
    // Course options (from the Courses API)
    courses: ClassCourseSummary[];
    coursesLoading?: boolean;
    coursesError?: string | null;
    onRetryCourses?: () => void;
    disabled?: boolean;
}

const ClassInformation = ({
    formData,
    onChange,
    errors = {},
    courses,
    coursesLoading = false,
    coursesError = null,
    onRetryCourses,
    disabled = false,
}: ClassInformationProps) => (
    <div className="col-12">
        <div className="create-role-card">
            <div className="create-role-card-header">
                <h2 className="create-role-card-title">Class Information</h2>
            </div>
            <div className="create-role-card-body">

                {/* Name */}
                <div className="primary-field">
                    <label htmlFor="class-name" className="primary-label">
                        Class Name<span className="required-mark" aria-hidden="true">*</span>
                    </label>
                    <input
                        id="class-name"
                        type="text"
                        className="primary-control"
                        placeholder="e.g. Beginner Quran"
                        value={formData.name}
                        onChange={(event) => onChange("name", event.target.value)}
                        aria-invalid={Boolean(errors.name)}
                        maxLength={255}
                        required
                    />
                    {errors.name && (
                        <span className="error-text d-block">{errors.name}</span>
                    )}
                </div>

                <div className="row">

                    {/* Code (optional, unique) */}
                    <div className="col-12 col-md-6">
                        <div className="primary-field">
                            <label htmlFor="class-code" className="primary-label">
                                Class Code
                            </label>
                            <input
                                id="class-code"
                                type="text"
                                className="primary-control"
                                placeholder="e.g. QRN-101"
                                value={formData.code}
                                onChange={(event) => onChange("code", event.target.value)}
                                aria-invalid={Boolean(errors.code)}
                                maxLength={255}
                            />
                            {errors.code && (
                                <span className="error-text d-block">{errors.code}</span>
                            )}
                        </div>
                    </div>

                    {/* Capacity (optional, integer >= 1) */}
                    <div className="col-12 col-md-6">
                        <div className="primary-field">
                            <label htmlFor="class-capacity" className="primary-label">
                                Capacity
                            </label>
                            <input
                                id="class-capacity"
                                type="number"
                                min={1}
                                step={1}
                                inputMode="numeric"
                                className="primary-control"
                                placeholder="e.g. 30"
                                value={formData.capacity}
                                onChange={(event) => onChange("capacity", event.target.value)}
                                aria-invalid={Boolean(errors.capacity)}
                            />
                            {errors.capacity && (
                                <span className="error-text d-block">{errors.capacity}</span>
                            )}
                        </div>
                    </div>

                </div>

                {/* Courses (optional, multiple) */}
                <div className="primary-field">
                    <label htmlFor="class-courses" className="primary-label">
                        Courses
                    </label>
                    <CourseMultiSelect
                        id="class-courses"
                        courses={courses}
                        selectedIds={formData.course_ids}
                        onChange={(ids) => onChange("course_ids", ids)}
                        isLoading={coursesLoading}
                        disabled={disabled}
                        invalid={Boolean(errors.course_ids)}
                    />
                    {errors.course_ids && (
                        <span className="error-text d-block">{errors.course_ids}</span>
                    )}
                    {coursesError && (
                        <span className="error-text d-block">
                            {coursesError}{" "}
                            {onRetryCourses && (
                                <button
                                    type="button"
                                    className="btn btn-link p-0 align-baseline"
                                    onClick={onRetryCourses}
                                >
                                    Try again
                                </button>
                            )}
                        </span>
                    )}
                </div>

                {/* Active Status (existing toggle style) */}
                <div className="primary-field">
                    <label htmlFor="class-active" className="primary-label">
                        Active Status
                    </label>
                    <div className="d-flex align-items-center gap-2">
                        <button
                            id="class-active"
                            type="button"
                            className={`role-permission-toggle ${formData.is_active ? "active" : ""}`}
                            onClick={() => onChange("is_active", !formData.is_active)}
                            aria-pressed={formData.is_active}
                            aria-label={formData.is_active ? "Set class inactive" : "Set class active"}
                            disabled={disabled}
                        >
                            <span />
                        </button>
                        <span>{formData.is_active ? "Active" : "Inactive"}</span>
                    </div>
                    {errors.is_active && (
                        <span className="error-text d-block">{errors.is_active}</span>
                    )}
                </div>

                {/* Description (optional) */}
                <div className="primary-field mb-0">
                    <label htmlFor="class-description" className="primary-label">
                        Description
                    </label>
                    <textarea
                        id="class-description"
                        className="primary-textarea"
                        placeholder="Briefly describe this class..."
                        value={formData.description}
                        onChange={(event) => onChange("description", event.target.value)}
                        aria-invalid={Boolean(errors.description)}
                    />
                    {errors.description && (
                        <span className="error-text d-block">{errors.description}</span>
                    )}
                </div>

            </div>
        </div>
    </div>
);

export default ClassInformation;
