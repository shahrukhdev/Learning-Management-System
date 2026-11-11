import api from "../api/api";
import type { StudentQuranMap, QuranMapSurah, QuranMapStatus } from "../types/quranMap.types";

// Read-only Quran map of a student. The Bearer token is attached by the
// api.ts request interceptor.

const STATUSES: QuranMapStatus[] = ["memorised", "progress", "not-started"];

const isObject = (value: unknown): value is Record<string, unknown> =>
    typeof value === "object" && value !== null;

const toCount = (value: unknown): number | null =>
    typeof value === "number" && Number.isFinite(value) ? value : null;

const toSurah = (value: unknown): QuranMapSurah | null => {
    if (!isObject(value) || typeof value.id !== "number") return null;

    return {
        id: value.id,
        number: typeof value.number === "number" ? value.number : 0,
        name: typeof value.name === "string" ? value.name : "",
        arabic: typeof value.arabic === "string" ? value.arabic : "",
        ayahs: typeof value.ayahs === "number" ? value.ayahs : 0,
        status: STATUSES.includes(value.status as QuranMapStatus) ? (value.status as QuranMapStatus) : "not-started",
        juz_ranges: (Array.isArray(value.juz_ranges) ? value.juz_ranges : [])
            .filter(isObject)
            .filter((range) =>
                typeof range.juz_number === "number" &&
                typeof range.start_ayah === "number" &&
                typeof range.end_ayah === "number"
            )
            .map((range) => ({
                juz_number: range.juz_number as number,
                start_ayah: range.start_ayah as number,
                end_ayah: range.end_ayah as number,
            })),
    };
};

// GET /v1/students/{studentId}/quran-map
export const getStudentQuranMap = async (studentId: number, signal?: AbortSignal): Promise<StudentQuranMap> => {
    const response = await api.get<{ success: boolean; message: string; data?: unknown }>(
        `/v1/students/${studentId}/quran-map`,
        { signal }
    );

    const data = isObject(response.data.data) ? response.data.data : {};

    const statistics = isObject(data.statistics) ? data.statistics : {};

    return {
        // Shown exactly as returned (never calculated on the frontend)
        statistics: {
            total_surahs: toCount(statistics.total_surahs),
            memorised: toCount(statistics.memorised),
            in_progress: toCount(statistics.in_progress),
            remaining: toCount(statistics.remaining),
        },
        surahs: (Array.isArray(data.surahs) ? data.surahs : [])
            .map(toSurah)
            .filter((surah): surah is QuranMapSurah => surah !== null)
            .sort((a, b) => a.number - b.number),
    };
};
