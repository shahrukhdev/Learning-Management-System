import api from "../api/api";
import type { PaginationMeta } from "../types/api.types";
import type { HifzSession } from "../types/hifzSession.types";
import type { MyHifz, MyHifzSessionsParams, MyHifzSessionsResult } from "../types/myHifz.types";
import { parseHifzStatistics } from "./hifzStatisticsService";
import { parseQuranMap } from "./quranMapService";
import { toSession } from "./hifzSessionService";

// The signed-in student's own Hifz (read only). The Bearer token is attached
// by the api.ts request interceptor. Same parsers as the Admin / Teacher
// endpoints, because the backend returns the same shapes.

type RawObject = Record<string, unknown>;

const isObject = (value: unknown): value is RawObject =>
    typeof value === "object" && value !== null && !Array.isArray(value);

const toText = (value: unknown): string | null =>
    typeof value === "string" && value.trim() !== "" ? value : null;

// GET /v1/my-hifz: profile + statistics + Quran map
export const getMyHifz = async (signal?: AbortSignal): Promise<MyHifz> => {

    const response = await api.get<RawObject>("/v1/my-hifz", { signal });

    const data = isObject(response.data?.data) ? response.data.data : {};

    const student = isObject(data.student) ? data.student : {};

    return {
        student: {
            name: toText(student.name) ?? "",
            initials: toText(student.initials) ?? "",
            image: toText(student.image),
            class_name: toText(student.class_name),
            admission_number: toText(student.admission_number),
        },
        statistics: parseHifzStatistics(data.statistics),
        quran_map: parseQuranMap(data.quran_map),
    };
};

// GET /v1/my-hifz/sessions (newest first, 10 per page by default)
export const getMyHifzSessions = async (
    params: MyHifzSessionsParams,
    signal?: AbortSignal
): Promise<MyHifzSessionsResult> => {

    const query: MyHifzSessionsParams = {};

    if (params.page !== undefined) query.page = params.page;
    if (params.per_page !== undefined) query.per_page = params.per_page;
    if (params.date) query.date = params.date;

    const response = await api.get<RawObject>("/v1/my-hifz/sessions", { params: query, signal });

    const sessions = (Array.isArray(response.data?.data) ? response.data.data : [])
        .map(toSession)
        .filter((session): session is HifzSession => session !== null);

    return {
        sessions,
        pagination: isObject(response.data?.pagination)
            ? (response.data.pagination as unknown as PaginationMeta)
            : null,
    };
};
