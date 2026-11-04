import { getFirstFieldErrors } from "../../utils/apiError";
import type { ValidationErrors } from "../../types/api.types";
import type { PermissionFormData, PermissionFormErrors } from "./PermissionInformation";

// Create + Edit Permission form rules (shared so both pages stay identical)

export const PERMISSIONS_LIST_PATH = "/system/permissions";

export const MAX_PERMISSION_NAME_LENGTH = 255;

export const EMPTY_PERMISSION_FORM: PermissionFormData = {
    name: "",
    description: "",
    module_id: "",
};

const PERMISSION_FORM_FIELDS: (keyof PermissionFormData)[] = ["name", "description", "module_id"];

// Name required, string, max 255. Module required (a numeric ID).
// Description optional. (Uniqueness and module existence are checked by the
// backend and come back as a 422.)
export const validatePermissionForm = (data: PermissionFormData): PermissionFormErrors => {

    const errors: PermissionFormErrors = {};

    const name = data.name.trim();

    if (!name) {
        errors.name = "The permission name field is required.";
    } else if (name.length > MAX_PERMISSION_NAME_LENGTH) {
        errors.name = `The permission name must not be greater than ${MAX_PERMISSION_NAME_LENGTH} characters.`;
    }

    const moduleId = Number(data.module_id);

    if (!data.module_id || !Number.isInteger(moduleId) || moduleId <= 0) {
        errors.module_id = "The module field is required.";
    }

    return errors;

};

// Laravel 422 errors -> inline errors under Permission Name / Module /
// Description (backend messages are used as-is)
export const toPermissionFormErrors = (validationErrors: ValidationErrors): PermissionFormErrors => {

    const fieldErrors = getFirstFieldErrors<keyof PermissionFormData>(validationErrors);

    const inlineErrors: PermissionFormErrors = {};

    PERMISSION_FORM_FIELDS.forEach((field) => {
        if (fieldErrors[field]) inlineErrors[field] = fieldErrors[field];
    });

    return inlineErrors;

};
