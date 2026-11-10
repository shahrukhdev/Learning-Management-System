import type { ValidationErrors } from "../../types/api.types";
import type { AcademicClassItem, SaveAcademicClassRequest } from "../../types/academicClass.types";

// Shared by the Create and Edit Class pages so both forms stay identical

export const CLASSES_LIST_PATH = "/academic/classes";

export const MAX_CLASS_NAME_LENGTH = 255;
export const MAX_CLASS_CODE_LENGTH = 255;

export interface ClassFormData {
    name: string;
    code: string;
    description: string;
    capacity: string; // raw input value; sent as a number or null
    is_active: boolean;
    course_ids: number[];
}

export type ClassFormField = keyof ClassFormData;

export type ClassFormErrors = Partial<Record<ClassFormField, string>>;

// New classes are active by default
export const EMPTY_CLASS_FORM: ClassFormData = {
    name: "",
    code: "",
    description: "",
    capacity: "",
    is_active: true,
    course_ids: [],
};

const CLASS_FORM_FIELDS: ClassFormField[] = [
    "name", "code", "description", "capacity", "is_active", "course_ids",
];

// Client-side rules (mirror the backend)
export const validateClassForm = (data: ClassFormData): ClassFormErrors => {

    const errors: ClassFormErrors = {};

    const name = data.name.trim();

    if (!name) {
        errors.name = "The name field is required.";
    } else if (name.length > MAX_CLASS_NAME_LENGTH) {
        errors.name = `The name must not be greater than ${MAX_CLASS_NAME_LENGTH} characters.`;
    }

    if (data.code.trim().length > MAX_CLASS_CODE_LENGTH) {
        errors.code = `The code must not be greater than ${MAX_CLASS_CODE_LENGTH} characters.`;
    }

    const capacity = data.capacity.trim();

    if (capacity) {
        const value = Number(capacity);

        if (!Number.isInteger(value)) {
            errors.capacity = "The capacity field must be an integer.";
        } else if (value < 1) {
            errors.capacity = "The capacity field must be at least 1.";
        }
    }

    return errors;

};

// Form -> request body. Empty optional fields become null (never "", which
// could collide with the unique `code` rule). `is_active` is always a boolean.
export const toClassPayload = (data: ClassFormData): SaveAcademicClassRequest => {

    const code = data.code.trim();
    const description = data.description.trim();
    const capacity = data.capacity.trim();

    return {
        name: data.name.trim(),
        code: code || null,
        description: description || null,
        capacity: capacity ? Number(capacity) : null,
        is_active: data.is_active,
        course_ids: data.course_ids,
    };

};

// API class -> form values (Edit). Assigned courses may come as `course_ids`
// or as embedded `courses`.
export const toClassFormData = (item: AcademicClassItem): ClassFormData => ({
    name: item.name ?? "",
    code: item.code ?? "",
    description: item.description ?? "",
    capacity: item.capacity !== null && item.capacity !== undefined ? String(item.capacity) : "",
    is_active: Boolean(item.is_active),
    course_ids: Array.isArray(item.course_ids)
        ? item.course_ids
        : (item.courses ?? []).map((course) => course.id),
});

// Laravel 422 errors -> inline errors. Keys like "course_ids.0" belong to
// the "course_ids" field. Backend messages are used as-is.
export const toClassFormErrors = (validationErrors: ValidationErrors): ClassFormErrors => {

    const inlineErrors: ClassFormErrors = {};

    Object.entries(validationErrors).forEach(([key, messages]) => {

        const field = key.split(".")[0] as ClassFormField;

        if (
            CLASS_FORM_FIELDS.includes(field) &&
            !inlineErrors[field] &&
            Array.isArray(messages) &&
            messages.length > 0
        ) {
            inlineErrors[field] = messages[0];
        }

    });

    return inlineErrors;

};
