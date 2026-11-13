import CourseMultiSelect from "../Classes/CourseMultiSelect";
import type { CourseFormData, CourseFormErrors } from "./courseForm";
import type { CourseClassSummary } from "../../types/course.types";

export type { CourseFormData } from "./courseForm";

interface CourseInformationProps {
    formData: CourseFormData;
    onChange: <K extends keyof CourseFormData>(field: K, value: CourseFormData[K]) => void;
    errors?: CourseFormErrors;
    // Academic class options (from the Academic Classes API)
    academicClasses: CourseClassSummary[];
    academicClassesLoading?: boolean;
    academicClassesError?: string | null;
    onRetryAcademicClasses?: () => void;
    disabled?: boolean;
}

// Same fields/layout as the Class form (ClassInformation)
const CourseInformation = ({
    formData,
    onChange,
    errors = {},
    academicClasses,
    academicClassesLoading = false,
    academicClassesError = null,
    onRetryAcademicClasses,
    disabled = false,
}: CourseInformationProps) => (
    <div className="col-12">
        <div className="create-role-card">
            <div className="create-role-card-header">
                <h2 className="create-role-card-title">Course Information</h2>
            </div>
            <div className="create-role-card-body">

                {/* Name */}
                <div className="primary-field">
                    <label htmlFor="course-name" className="primary-label">Course Name<span className="required-mark" aria-hidden="true">*</span></label>
                    <input
                        id="course-name"
                        type="text"
                        className="primary-control"
                        placeholder="e.g. Quran Studies"
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
                            <label htmlFor="course-code" className="primary-label">Course Code</label>
                            <input
                                id="course-code"
                                type="text"
                                className="primary-control"
                                placeholder="e.g. QS-101"
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

                    {/* Duration (optional, integer >= 1) */}
                    <div className="col-12 col-md-6">
                        <div className="primary-field">
                            <label htmlFor="course-duration" className="primary-label">Duration</label>
                            <input
                                id="course-duration"
                                type="number"
                                min={1}
                                step={1}
                                inputMode="numeric"
                                className="primary-control"
                                placeholder="e.g. 12"
                                value={formData.duration}
                                onChange={(event) => onChange("duration", event.target.value)}
                                aria-invalid={Boolean(errors.duration)}
                            />
                            {errors.duration && (
                                <span className="error-text d-block">{errors.duration}</span>
                            )}
                        </div>
                    </div>

                </div>

                {/* Academic Classes (optional, multiple) */}
                <div className="primary-field">
                    <label htmlFor="course-classes" className="primary-label">Academic Classes</label>
                    <CourseMultiSelect
                        id="course-classes"
                        courses={academicClasses}
                        selectedIds={formData.academic_class_ids}
                        onChange={(ids) => onChange("academic_class_ids", ids)}
                        isLoading={academicClassesLoading}
                        disabled={disabled}
                        invalid={Boolean(errors.academic_class_ids)}
                        placeholder="Select classes"
                        loadingText="Loading classes..."
                        searchPlaceholder="Search classes..."
                        emptyText="No classes available."
                        noMatchText="No classes found."
                        itemLabel="Class"
                    />
                    {errors.academic_class_ids && (
                        <span className="error-text d-block">{errors.academic_class_ids}</span>
                    )}
                    {academicClassesError && (
                        <span className="error-text d-block">
                            {academicClassesError}{" "}
                            {onRetryAcademicClasses && (
                                <button
                                    type="button"
                                    className="btn btn-link p-0 align-baseline"
                                    onClick={onRetryAcademicClasses}
                                >
                                    Try again
                                </button>
                            )}
                        </span>
                    )}
                </div>

                {/* Active Status (same toggle as the Class form) */}
                <div className="primary-field">
                    <label htmlFor="course-active" className="primary-label">Active Status</label>
                    <div className="d-flex align-items-center gap-2">
                        <button
                            id="course-active"
                            type="button"
                            className={`role-permission-toggle ${formData.is_active ? "active" : ""}`}
                            onClick={() => onChange("is_active", !formData.is_active)}
                            aria-pressed={formData.is_active}
                            aria-label={formData.is_active ? "Set course inactive" : "Set course active"}
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
                    <label htmlFor="course-description" className="primary-label">Description</label>
                    <textarea
                        id="course-description"
                        className="primary-textarea"
                        placeholder="Briefly describe this course..."
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

export default CourseInformation;
