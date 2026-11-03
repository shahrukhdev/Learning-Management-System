import axios from "axios";

import type { ApiErrorResponse, ValidationErrors } from "../types/api.types";

export interface ParsedApiError {
    status: number | null; // null = network / no response
    message: string;
    validationErrors: ValidationErrors | null;
}

const FALLBACK_MESSAGE = "Something went wrong. Please try again.";
const NETWORK_MESSAGE = "Unable to connect to the server. Please check your internet connection.";

// Normalize any thrown error (Axios or otherwise) into one predictable shape
export const parseApiError = (error: unknown): ParsedApiError => {

    if (axios.isAxiosError<ApiErrorResponse>(error)) {

        if (!error.response) {
            return { status: null, message: NETWORK_MESSAGE, validationErrors: null };
        }

        const { status, data } = error.response;

        const errors = data?.errors;
        const validationErrors =
            errors && typeof errors === "object" && !Array.isArray(errors)
                ? errors
                : null;

        return {
            status,
            message: data?.message || FALLBACK_MESSAGE,
            validationErrors,
        };
    }

    return { status: null, message: FALLBACK_MESSAGE, validationErrors: null };
};

// Map backend validation errors to the first message per field
export const getFirstFieldErrors = <TField extends string>(
    errors: ValidationErrors
): Partial<Record<TField, string>> => {

    const result: Partial<Record<TField, string>> = {};

    Object.entries(errors).forEach(([field, messages]) => {
        if (Array.isArray(messages) && messages.length > 0) {
            result[field as TField] = messages[0];
        }
    });

    return result;
};
