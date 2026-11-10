import type { PaginationMeta } from "./api.types";

// Academic class reference embedded in a course
export interface CourseClassSummary {
    id: number;
    name: string;
}

// CourseResource
export interface CourseItem {
    id: number;
    name: string;
    code: string | null;
    description: string | null;
    duration: number | null;
    is_active: boolean | number;
    academic_classes?: CourseClassSummary[];
    created_at: string; // already formatted by the backend (d-m-Y)
}

export interface CoursesListResponse {
    success: boolean;
    message: string;
    data: CourseItem[];
    pagination: PaginationMeta;
}

export interface CoursesListParams {
    search?: string;
    is_active?: boolean;
    page?: number;
    per_page?: number;
}

// GET /v1/courses/{id}
export interface CourseDetailResponse {
    success: boolean;
    message: string;
    data: CourseItem;
}

// POST /v1/courses and PUT /v1/courses/{id}.
// Empty optional values are sent as null so they are saved as empty.
export interface SaveCourseRequest {
    name: string;
    code: string | null;
    description: string | null;
    duration: number | null;
    is_active: boolean;
    academic_class_ids: number[];
}

export interface SaveCourseResponse {
    success?: boolean;
    message?: string;
    data: CourseItem;
}

// DELETE /v1/courses/{id}
export interface DeleteCourseResponse {
    success: boolean;
    message: string;
    data: null;
}
