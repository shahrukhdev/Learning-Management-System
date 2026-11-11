import api from "../api/api";
import type { HifzStatistics, HifzStatisticsResponse } from "../types/hifzStatistics.types";

// Hifz statistics of a student. The Bearer token is attached by the api.ts
// request interceptor. Values are used as returned (never recalculated).

const isObject = (value: unknown): value is Record<string, unknown> =>
    typeof value === "object" && value !== null;

const toNumber = (value: unknown): number => {
    if (typeof value === "number" && Number.isFinite(value)) return value;
    if (typeof value === "string" && value.trim() !== "" && Number.isFinite(Number(value))) return Number(value);
    return 0;
};

// GET /v1/students/{studentId}/hifz-statistics
export const getHifzStatistics = async (studentId: number, signal?: AbortSignal): Promise<HifzStatistics> => {
    const response = await api.get<HifzStatisticsResponse>(`/v1/students/${studentId}/hifz-statistics`, { signal });

    const data = isObject(response.data.data) ? response.data.data : {};

    const surahs = isObject(data.surahs) ? data.surahs : {};

    return {
        memorised: toNumber(data.memorised),
        in_progress: toNumber(data.in_progress),
        remaining: toNumber(data.remaining),
        surahs: {
            completed: toNumber(surahs.completed),
            total: toNumber(surahs.total),
            percentage: toNumber(surahs.percentage),
        },
    };
};
