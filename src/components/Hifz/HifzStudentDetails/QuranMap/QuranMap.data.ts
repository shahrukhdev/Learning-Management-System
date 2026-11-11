// Quran Map types. Surah and Juz information comes from the API
// (GET /v1/surahs, GET /v1/juz); nothing about the Quran is hardcoded here.

export type { Surah, Juz, JuzSurahRange } from "../../../../types/quran.types";

export type SurahStatus = | "memorised" | "progress" | "not-started";

// Memorisation status per Surah, keyed by the Surah's API ID
export type SurahStatuses = Record<number, SurahStatus>;
