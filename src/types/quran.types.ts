// Quran reference data (GET /v1/surahs, GET /v1/juz)

export interface Surah {
    id: number;
    number: number;
    name: string; // English / transliterated
    arabic: string;
    ayahs: number; // total ayah count
}

// The part of one Surah that belongs to a Juz (inclusive ayah range)
export interface JuzSurahRange {
    id: number;
    surah: Surah;
    start_ayah: number;
    end_ayah: number;
}

export interface Juz {
    id: number;
    number: number;
    name: string;
    surah_ranges: JuzSurahRange[];
}

export interface SurahsResponse {
    success: boolean;
    message: string;
    data: Surah[];
}

export interface SurahResponse {
    success: boolean;
    message: string;
    data: Surah;
}

export interface JuzListResponse {
    success: boolean;
    message: string;
    data: Juz[];
}

export interface JuzResponse {
    success: boolean;
    message: string;
    data: Juz;
}
