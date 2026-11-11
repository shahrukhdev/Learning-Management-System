import type { Surah } from "./quran.types";

// Student Surah progress (whole Surah + overall status; no ayah ranges)

export type SurahProgressStatus = "memorised" | "progress";

export interface SurahProgressRecord {
    id: number; // progress record ID (used for PUT / DELETE)
    status: SurahProgressStatus;
    surah: Surah;
}

// GET /v1/students/{studentId}/surah-progress
export interface SurahProgressListResponse {
    success: boolean;
    message: string;
    data: SurahProgressRecord[];
}

// POST /v1/students/{studentId}/surah-progress
export interface CreateSurahProgressRequest {
    surah_id: number;
    status: SurahProgressStatus;
}

// PUT /v1/surah-progress/{id}
export interface UpdateSurahProgressRequest {
    status: SurahProgressStatus;
}

export interface SurahProgressMutationResponse {
    success: boolean;
    message: string;
    data?: unknown;
}
