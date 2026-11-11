import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";

import { loadQuranData } from "../services/quranService";
import { parseApiError } from "../utils/apiError";
import type { Juz, Surah } from "../types/quran.types";

// One Surah's part of a Juz, with the Juz it belongs to
export interface SurahJuzRange {
    juz: Juz;
    start_ayah: number;
    end_ayah: number;
}

export interface QuranData {
    surahs: Surah[];
    juz: Juz[];
    // Surah ID -> the Juz ranges it appears in (a Surah can span several Juz)
    surahJuzRanges: Map<number, SurahJuzRange[]>;
    isLoading: boolean;
    error: string | null;
    retry: () => void;
}

// Surahs + Juz for the Hifz Tracker (requested once, shared via loadQuranData)
export const useQuranData = (): QuranData => {

    const [reloadToken, setReloadToken] = useState(0);

    const [state, setState] = useState<{
        token: number;
        surahs: Surah[];
        juz: Juz[];
        error: string | null;
    } | null>(null);

    useEffect(() => {
        let isActive = true;

        loadQuranData()
            .then(({ surahs, juz }) => {
                if (isActive) setState({ token: reloadToken, surahs, juz, error: null });
            })
            .catch((error: unknown) => {
                if (!isActive) return;

                const { status, message } = parseApiError(error);

                if (status !== 401) {
                    toast.error(message, { toastId: "quran-data-error" });
                }

                setState({ token: reloadToken, surahs: [], juz: [], error: message });
            });

        return () => {
            isActive = false;
        };
    }, [reloadToken]);

    const retry = useCallback(() => setReloadToken((token) => token + 1), []);

    const isCurrent = state?.token === reloadToken;

    const surahs = useMemo(() => state?.surahs ?? [], [state]);
    const juz = useMemo(() => state?.juz ?? [], [state]);

    const surahJuzRanges = useMemo(() => {
        const map = new Map<number, SurahJuzRange[]>();

        juz.forEach((item) => {
            item.surah_ranges.forEach((range) => {
                const list = map.get(range.surah.id) ?? [];
                list.push({ juz: item, start_ayah: range.start_ayah, end_ayah: range.end_ayah });
                map.set(range.surah.id, list);
            });
        });

        map.forEach((list) => list.sort((a, b) => a.juz.number - b.juz.number));

        return map;
    }, [juz]);

    return {
        surahs,
        juz,
        surahJuzRanges,
        isLoading: !isCurrent,
        error: isCurrent ? state.error : null,
        retry,
    };
};

// Juz numbers a Surah spans, e.g. "1", "1-3", or "1, 3" if not contiguous
export const formatJuzNumbers = (ranges: SurahJuzRange[] | undefined): string => {
    const numbers = [...new Set((ranges ?? []).map((range) => range.juz.number))].sort((a, b) => a - b);

    if (numbers.length === 0) return "-";

    if (numbers.length === 1) return `${numbers[0]}`;

    const isContiguous = numbers.every((value, index) => index === 0 || value === numbers[index - 1] + 1);

    return isContiguous ? `${numbers[0]}-${numbers[numbers.length - 1]}` : numbers.join(", ");
};

// Arabic text inside an English string (e.g. an <option> label) without
// flipping the surrounding text direction (Unicode first-strong isolate)
export const isolateArabic = (text: string): string => (text ? `⁨${text}⁩` : "");
