import type { Surah } from "./quran.types";

// GET /v1/students/{studentId}/quran-map (read-only)

export type QuranMapStatus = "memorised" | "progress" | "not-started";

export interface QuranMapJuzRange {
    juz_number: number;
    start_ayah: number;
    end_ayah: number;
}

export interface QuranMapSurah extends Surah {
    status: QuranMapStatus;
    juz_ranges: QuranMapJuzRange[];
}

// null = missing from the response (shown as "—", never calculated)
export interface QuranMapStatistics {
    total_surahs: number | null;
    memorised: number | null;
    in_progress: number | null;
    remaining: number | null;
}

export interface StudentQuranMap {
    statistics: QuranMapStatistics;
    surahs: QuranMapSurah[];
}
