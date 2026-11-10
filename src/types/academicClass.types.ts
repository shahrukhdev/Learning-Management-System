import type { PaginationMeta } from "./api.types";

// Course reference as it may be embedded in a class
export interface ClassCourseSummary {
    id: number;
    name: string;
}

// AcademicClassResource
export interface AcademicClassItem {
    id: number;
    name: string;
    code: string | null;
    description: string | null;
    capacity: number | null;
    is_active: boolean | number;
    created_at: string; // already formatted by the backend (d-m-Y)
    // Assigned courses (show endpoint). Either shape is accepted.
    courses?: ClassCourseSummary[];
    course_ids?: number[];
}

export interface AcademicClassesListResponse {
    success: boolean;
    message: string;
    data: AcademicClassItem[];
    pagination: PaginationMeta;
}

export interface AcademicClassesListParams {
    search?: string;
    is_active?: boolean;
    page?: number;
    per_page?: number;
}

// GET /v1/academic-classes/{id}
export interface AcademicClassDetailResponse {
    success: boolean;
    message: string;
    data: AcademicClassItem;
}

// POST /v1/academic-classes and PUT /v1/academic-classes/{id}.
// Empty optional values are sent as null so they are saved as empty.
export interface SaveAcademicClassRequest {
    name: string;
    code: string | null;
    description: string | null;
    capacity: number | null;
    is_active: boolean;
    course_ids: number[];
}

export interface SaveAcademicClassResponse {
    success?: boolean;
    message?: string;
    data: AcademicClassItem;
}

// DELETE /v1/academic-classes/{id}
export interface DeleteAcademicClassResponse {
    success: boolean;
    message: string;
    data: null;
}
