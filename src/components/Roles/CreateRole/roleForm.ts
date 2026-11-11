import { getFirstFieldErrors } from "../../../utils/apiError";
import type { ValidationErrors } from "../../../types/api.types";
import type { RoleFormData, RoleFormErrors } from "./CreateRole.types";

// Shared by the Add Role and Edit Role pages so both forms stay consistent

export const ROLES_LIST_PATH = "/system/roles";

export const MAX_ROLE_NAME_LENGTH = 255;

const ROLE_FORM_FIELDS: (keyof RoleFormData)[] = ["name", "description"];

export const EMPTY_ROLE_FORM: RoleFormData = {
    name: "",
    description: "",
};

// Client-side rules (mirror the backend): name required, max 255;
// description optional
export const validateRoleForm = (data: RoleFormData): RoleFormErrors => {

    const errors: RoleFormErrors = {};

    const name = data.name.trim();

    if (!name) {
        errors.name = "The role name field is required.";
    } else if (name.length > MAX_ROLE_NAME_LENGTH) {
        errors.name = `The role name must not be greater than ${MAX_ROLE_NAME_LENGTH} characters.`;
    }

    return errors;

};

// Laravel 422 errors -> inline errors for the Role Information fields
export const toRoleFormErrors = (validationErrors: ValidationErrors): RoleFormErrors => {

    const fieldErrors = getFirstFieldErrors<keyof RoleFormData>(validationErrors);

    const inlineErrors: RoleFormErrors = {};

    ROLE_FORM_FIELDS.forEach((field) => {
        if (fieldErrors[field]) inlineErrors[field] = fieldErrors[field];
    });

    return inlineErrors;

};

// Laravel 422 errors for `permissions` / `permissions.*` (shown above the
// permission matrix)
export const toPermissionsError = (validationErrors: ValidationErrors): string | null => {

    const entry = Object.entries(validationErrors).find(
        ([key, messages]) =>
            (key === "permissions" || key.startsWith("permissions.")) &&
            Array.isArray(messages) &&
            messages.length > 0
    );

    return entry ? entry[1][0] : null;

};
