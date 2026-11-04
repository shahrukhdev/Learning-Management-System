import { getFirstFieldErrors } from "../../utils/apiError";
import type { ValidationErrors } from "../../types/api.types";
import type { PermissionFormData, PermissionFormErrors } from "./PermissionInformation";

// Edit Permission form rules (same rules as the Create Permission page)

export const PERMISSIONS_LIST_PATH = "/system/permissions";

export const MAX_PERMISSION_NAME_LENGTH = 255;

const PERMISSION_FORM_FIELDS: (keyof PermissionFormData)[] = ["name", "description"];

// Name required, string, max 255. Description optional.
// (Uniqueness is checked by the backend and comes back as a 422.)
export const validatePermissionForm = (data: PermissionFormData): PermissionFormErrors => {

    const errors: PermissionFormErrors = {};

    const name = data.name.trim();

    if (!name) {
        errors.name = "The permission name field is required.";
    } else if (name.length > MAX_PERMISSION_NAME_LENGTH) {
        errors.name = `The permission name must not be greater than ${MAX_PERMISSION_NAME_LENGTH} characters.`;
    }

    return errors;

};

// Laravel 422 errors -> inline errors for Permission Name / Description
export const toPermissionFormErrors = (validationErrors: ValidationErrors): PermissionFormErrors => {

    const fieldErrors = getFirstFieldErrors<keyof PermissionFormData>(validationErrors);

    const inlineErrors: PermissionFormErrors = {};

    PERMISSION_FORM_FIELDS.forEach((field) => {
        if (fieldErrors[field]) inlineErrors[field] = fieldErrors[field];
    });

    return inlineErrors;

};
