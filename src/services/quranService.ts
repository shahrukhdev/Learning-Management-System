import api from "../api/api";
import type {
    Juz,
    JuzListResponse,
    JuzResponse,
    JuzSurahRange,
    Surah,
    SurahResponse,
    SurahsResponse,
} from "../types/quran.types";

// Surah and Juz reference data. The Bearer token is attached by the api.ts
// request interceptor.

const isObject = (value: unknown): value is Record<string, unknown> =>
    typeof value === "object" && value !== null;

const toSurah = (value: unknown): Surah | null => {
    if (!isObject(value) || typeof value.id !== "number") return null;

    return {
        id: value.id,
        number: typeof value.number === "number" ? value.number : 0,
        name: typeof value.name === "string" ? value.name : "",
        arabic: typeof value.arabic === "string" ? value.arabic : "",
        ayahs: typeof value.ayahs === "number" ? value.ayahs : 0,
    };
};

const toRange = (value: unknown): JuzSurahRange | null => {
    if (!isObject(value)) return null;

    const surah = toSurah(value.surah);

    if (!surah || typeof value.start_ayah !== "number" || typeof value.end_ayah !== "number") return null;

    return {
        id: typeof value.id === "number" ? value.id : 0,
        surah,
        start_ayah: value.start_ayah,
        end_ayah: value.end_ayah,
    };
};

const toJuz = (value: unknown): Juz | null => {
    if (!isObject(value) || typeof value.id !== "number") return null;

    const ranges = (Array.isArray(value.surah_ranges) ? value.surah_ranges : [])
        .map(toRange)
        .filter((range): range is JuzSurahRange => range !== null)
        // Quran order within the Juz
        .sort((a, b) => a.surah.number - b.surah.number || a.start_ayah - b.start_ayah);

    return {
        id: value.id,
        number: typeof value.number === "number" ? value.number : 0,
        name: typeof value.name === "string" ? value.name : "",
        surah_ranges: ranges,
    };
};

// GET /v1/surahs (all Surahs, ordered by number)
export const getSurahs = async (signal?: AbortSignal): Promise<Surah[]> => {
    const response = await api.get<SurahsResponse>("/v1/surahs", { signal });

    return (Array.isArray(response.data.data) ? response.data.data : [])
        .map(toSurah)
        .filter((surah): surah is Surah => surah !== null)
        .sort((a, b) => a.number - b.number);
};

// GET /v1/surahs/{id}
export const getSurah = async (id: number, signal?: AbortSignal): Promise<Surah | null> => {
    const response = await api.get<SurahResponse>(`/v1/surahs/${id}`, { signal });
    return toSurah(response.data.data);
};

// GET /v1/juz (all Juz with their Surah ranges, ordered by number)
export const getJuzList = async (signal?: AbortSignal): Promise<Juz[]> => {
    const response = await api.get<JuzListResponse>("/v1/juz", { signal });

    return (Array.isArray(response.data.data) ? response.data.data : [])
        .map(toJuz)
        .filter((juz): juz is Juz => juz !== null)
        .sort((a, b) => a.number - b.number);
};

// GET /v1/juz/{id}
export const getJuz = async (id: number, signal?: AbortSignal): Promise<Juz | null> => {
    const response = await api.get<JuzResponse>(`/v1/juz/${id}`, { signal });
    return toJuz(response.data.data);
};

// Reference data does not change while the app is open, so both lists are
// requested once and shared by the whole Hifz Tracker. A failed request is
// not cached (the next call retries).
let quranDataRequest: Promise<{ surahs: Surah[]; juz: Juz[] }> | null = null;

export const loadQuranData = (): Promise<{ surahs: Surah[]; juz: Juz[] }> => {
    if (!quranDataRequest) {
        quranDataRequest = Promise.all([getSurahs(), getJuzList()])
            .then(([surahs, juz]) => ({ surahs, juz }))
            .catch((error: unknown) => {
                quranDataRequest = null;
                throw error;
            });
    }

    return quranDataRequest;
};
