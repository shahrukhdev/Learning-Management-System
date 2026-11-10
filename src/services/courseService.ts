import api from "../api/api";
import type { ClassCourseSummary } from "../types/academicClass.types";
import type {
    CourseDetailResponse,
    CoursesListParams,
    CoursesListResponse,
    DeleteCourseResponse,
    SaveCourseRequest,
    SaveCourseResponse,
} from "../types/course.types";

// Courses API. The Bearer token is attached by the api.ts request interceptor.

// GET /v1/courses. Pass an AbortSignal so superseded requests can be cancelled.
export const getCourses = async (
    params: CoursesListParams,
    signal?: AbortSignal
): Promise<CoursesListResponse> => {

    // Drop empty values so they are not sent as e.g. `search=`
    const query: Record<string, string | number> = {};

    if (params.search) query.search = params.search;
    if (params.is_active !== undefined) query.is_active = params.is_active ? 1 : 0;
    if (params.page !== undefined) query.page = params.page;
    if (params.per_page !== undefined) query.per_page = params.per_page;

    const response = await api.get<CoursesListResponse>("/v1/courses", {
        params: query,
        signal,
    });

    return response.data;
};

// POST /v1/courses
export const createCourse = async (payload: SaveCourseRequest): Promise<SaveCourseResponse> => {
    const response = await api.post<SaveCourseResponse>("/v1/courses", payload);
    clearCourseOptionsCache(); // course pickers (e.g. Classes form) refetch
    return response.data;
};

// GET /v1/courses/{id}
export const getCourse = async (id: number, signal?: AbortSignal): Promise<CourseDetailResponse> => {
    const response = await api.get<CourseDetailResponse>(`/v1/courses/${id}`, { signal });
    return response.data;
};

// PUT /v1/courses/{id}
export const updateCourse = async (id: number, payload: SaveCourseRequest): Promise<SaveCourseResponse> => {
    const response = await api.put<SaveCourseResponse>(`/v1/courses/${id}`, payload);
    clearCourseOptionsCache();
    return response.data;
};

// DELETE /v1/courses/{id}
export const deleteCourse = async (id: number): Promise<DeleteCourseResponse> => {
    const response = await api.delete<DeleteCourseResponse>(`/v1/courses/${id}`);
    clearCourseOptionsCache();
    return response.data;
};


/* =========================
   Course options for selects (e.g. assigning courses to a class)
========================= */

const COURSES_OPTIONS_PER_PAGE = 100;

const isCourseOption = (value: unknown): value is ClassCourseSummary => {
    if (typeof value !== "object" || value === null) return false;

    const course = value as Record<string, unknown>;

    return typeof course.id === "number" && typeof course.name === "string";
};

// Payload is validated at runtime: anything unexpected yields an empty list
// instead of breaking the form
export const getCourseOptions = async (signal?: AbortSignal): Promise<ClassCourseSummary[]> => {
    const response = await api.get<unknown>("/v1/courses", {
        params: { per_page: COURSES_OPTIONS_PER_PAGE },
        signal,
    });

    const body = response.data;
    const list =
        typeof body === "object" && body !== null && "data" in body
            ? (body as { data: unknown }).data
            : null;

    return Array.isArray(list)
        ? list.filter(isCourseOption).map(({ id, name }) => ({ id, name }))
        : [];
};

// Fetched once and shared; cleared whenever a course is created, updated or
// deleted. A failed request is not cached.
let courseOptionsRequest: Promise<ClassCourseSummary[]> | null = null;

export const loadCourseOptions = (): Promise<ClassCourseSummary[]> => {
    if (!courseOptionsRequest) {
        courseOptionsRequest = getCourseOptions().catch((error: unknown) => {
            courseOptionsRequest = null;
            throw error;
        });
    }

    return courseOptionsRequest;
};

export function clearCourseOptionsCache(): void {
    courseOptionsRequest = null;
}
