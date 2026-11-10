import api from "../api/api";
import type {
    AcademicClassDetailResponse,
    AcademicClassesListParams,
    AcademicClassesListResponse,
    DeleteAcademicClassResponse,
    SaveAcademicClassRequest,
    SaveAcademicClassResponse,
} from "../types/academicClass.types";

// Academic Classes API. The Bearer token is attached by the api.ts
// request interceptor.

// GET /v1/academic-classes. Pass an AbortSignal so superseded requests can be
// cancelled.
export const getAcademicClasses = async (
    params: AcademicClassesListParams,
    signal?: AbortSignal
): Promise<AcademicClassesListResponse> => {

    // Drop empty values so they are not sent as e.g. `search=`
    const query: Record<string, string | number> = {};

    if (params.search) query.search = params.search;
    if (params.is_active !== undefined) query.is_active = params.is_active ? 1 : 0;
    if (params.page !== undefined) query.page = params.page;
    if (params.per_page !== undefined) query.per_page = params.per_page;

    const response = await api.get<AcademicClassesListResponse>("/v1/academic-classes", {
        params: query,
        signal,
    });

    return response.data;
};

// POST /v1/academic-classes
export const createAcademicClass = async (
    payload: SaveAcademicClassRequest
): Promise<SaveAcademicClassResponse> => {
    const response = await api.post<SaveAcademicClassResponse>("/v1/academic-classes", payload);
    return response.data;
};

// GET /v1/academic-classes/{id}
export const getAcademicClass = async (
    id: number,
    signal?: AbortSignal
): Promise<AcademicClassDetailResponse> => {
    const response = await api.get<AcademicClassDetailResponse>(`/v1/academic-classes/${id}`, { signal });
    return response.data;
};

// PUT /v1/academic-classes/{id}
export const updateAcademicClass = async (
    id: number,
    payload: SaveAcademicClassRequest
): Promise<SaveAcademicClassResponse> => {
    const response = await api.put<SaveAcademicClassResponse>(`/v1/academic-classes/${id}`, payload);
    return response.data;
};

// Class options for selects (e.g. assigning classes to a course), reusing
// GET /v1/academic-classes. Not cached, so a newly created class shows up
// the next time a form opens.
const CLASS_OPTIONS_PER_PAGE = 100;

export const getAcademicClassOptions = async (
    signal?: AbortSignal
): Promise<{ id: number; name: string }[]> => {
    const response = await getAcademicClasses({ per_page: CLASS_OPTIONS_PER_PAGE }, signal);

    return (Array.isArray(response.data) ? response.data : []).map(({ id, name }) => ({ id, name }));
};

// DELETE /v1/academic-classes/{id}
export const deleteAcademicClass = async (id: number): Promise<DeleteAcademicClassResponse> => {
    const response = await api.delete<DeleteAcademicClassResponse>(`/v1/academic-classes/${id}`);
    return response.data;
};
