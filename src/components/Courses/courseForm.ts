import type { ValidationErrors } from "../../types/api.types";
import type { CourseItem, SaveCourseRequest } from "../../types/course.types";

// Shared by the Create and Edit Course pages (same pattern as classForm.ts)

export const COURSES_LIST_PATH = "/academic/courses";

export const MAX_COURSE_NAME_LENGTH = 255;
export const MAX_COURSE_CODE_LENGTH = 255;

export interface CourseFormData {
    name: string;
    code: string;
    description: string;
    duration: string; // raw input value; sent as a number or null
    is_active: boolean;
    academic_class_ids: number[];
}

export type CourseFormField = keyof CourseFormData;

export type CourseFormErrors = Partial<Record<CourseFormField, string>>;

// New courses are active by default
export const EMPTY_COURSE_FORM: CourseFormData = {
    name: "",
    code: "",
    description: "",
    duration: "",
    is_active: true,
    academic_class_ids: [],
};

const COURSE_FORM_FIELDS: CourseFormField[] = [
    "name", "code", "description", "duration", "is_active", "academic_class_ids",
];

// Client-side rules (mirror the backend)
export const validateCourseForm = (data: CourseFormData): CourseFormErrors => {

    const errors: CourseFormErrors = {};

    const name = data.name.trim();

    if (!name) {
        errors.name = "The name field is required.";
    } else if (name.length > MAX_COURSE_NAME_LENGTH) {
        errors.name = `The name must not be greater than ${MAX_COURSE_NAME_LENGTH} characters.`;
    }

    if (data.code.trim().length > MAX_COURSE_CODE_LENGTH) {
        errors.code = `The code must not be greater than ${MAX_COURSE_CODE_LENGTH} characters.`;
    }

    const duration = data.duration.trim();

    if (duration) {
        const value = Number(duration);

        if (!Number.isInteger(value)) {
            errors.duration = "The duration field must be an integer.";
        } else if (value < 1) {
            errors.duration = "The duration field must be at least 1.";
        }
    }

    return errors;

};

// Form -> request body. Empty optional fields become null (never "", which
// could collide with the unique `code` rule). `is_active` is always a boolean.
export const toCoursePayload = (data: CourseFormData): SaveCourseRequest => {

    const code = data.code.trim();
    const description = data.description.trim();
    const duration = data.duration.trim();

    return {
        name: data.name.trim(),
        code: code || null,
        description: description || null,
        duration: duration ? Number(duration) : null,
        is_active: data.is_active,
        academic_class_ids: data.academic_class_ids,
    };

};

// API course -> form values (Edit), incl. assigned academic classes
export const toCourseFormData = (item: CourseItem): CourseFormData => ({
    name: item.name ?? "",
    code: item.code ?? "",
    description: item.description ?? "",
    duration: item.duration !== null && item.duration !== undefined ? String(item.duration) : "",
    is_active: Boolean(item.is_active),
    academic_class_ids: (item.academic_classes ?? []).map((academicClass) => academicClass.id),
});

// Laravel 422 errors -> inline errors. Keys like "academic_class_ids.0"
// belong to the "academic_class_ids" field. Backend messages are used as-is.
export const toCourseFormErrors = (validationErrors: ValidationErrors): CourseFormErrors => {

    const inlineErrors: CourseFormErrors = {};

    Object.entries(validationErrors).forEach(([key, messages]) => {

        const field = key.split(".")[0] as CourseFormField;

        if (
            COURSE_FORM_FIELDS.includes(field) &&
            !inlineErrors[field] &&
            Array.isArray(messages) &&
            messages.length > 0
        ) {
            inlineErrors[field] = messages[0];
        }

    });

    return inlineErrors;

};
