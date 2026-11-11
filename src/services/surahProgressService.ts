import api from "../api/api";
import type {
    CreateSurahProgressRequest,
    SurahProgressListResponse,
    SurahProgressMutationResponse,
    SurahProgressRecord,
    UpdateSurahProgressRequest,
} from "../types/surahProgress.types";

// Student Surah progress API. The Bearer token is attached by the api.ts
// request interceptor.

const isObject = (value: unknown): value is Record<string, unknown> =>
    typeof value === "object" && value !== null;

// Validates one record; anything malformed is dropped (returns null)
const toRecord = (value: unknown): SurahProgressRecord | null => {
    if (!isObject(value) || typeof value.id !== "number") return null;

    if (value.status !== "memorised" && value.status !== "progress") return null;

    const surah = value.surah;

    if (!isObject(surah) || typeof surah.id !== "number") return null;

    return {
        id: value.id,
        status: value.status,
        surah: {
            id: surah.id,
            number: typeof surah.number === "number" ? surah.number : 0,
            name: typeof surah.name === "string" ? surah.name : "",
            arabic: typeof surah.arabic === "string" ? surah.arabic : "",
            ayahs: typeof surah.ayahs === "number" ? surah.ayahs : 0,
        },
    };
};

// GET /v1/students/{studentId}/surah-progress
export const getStudentSurahProgress = async (
    studentId: number,
    signal?: AbortSignal
): Promise<SurahProgressRecord[]> => {
    const response = await api.get<SurahProgressListResponse>(
        `/v1/students/${studentId}/surah-progress`,
        { signal }
    );

    return (Array.isArray(response.data.data) ? response.data.data : [])
        .map(toRecord)
        .filter((record): record is SurahProgressRecord => record !== null);
};

// POST /v1/students/{studentId}/surah-progress. `record` is the created
// resource when the response includes a valid one, otherwise null.
export const createSurahProgress = async (
    studentId: number,
    payload: CreateSurahProgressRequest
): Promise<{ message: string; record: SurahProgressRecord | null }> => {
    const response = await api.post<SurahProgressMutationResponse>(
        `/v1/students/${studentId}/surah-progress`,
        payload
    );

    return { message: response.data.message, record: toRecord(response.data.data) };
};

// PUT /v1/surah-progress/{id} (status only; the Surah cannot be changed)
export const updateSurahProgress = async (
    id: number,
    payload: UpdateSurahProgressRequest
): Promise<{ message: string; record: SurahProgressRecord | null }> => {
    const response = await api.put<SurahProgressMutationResponse>(`/v1/surah-progress/${id}`, payload);

    return { message: response.data.message, record: toRecord(response.data.data) };
};

// DELETE /v1/surah-progress/{id}
export const deleteSurahProgress = async (id: number): Promise<{ message: string }> => {
    const response = await api.delete<SurahProgressMutationResponse>(`/v1/surah-progress/${id}`);

    return { message: response.data.message };
};
