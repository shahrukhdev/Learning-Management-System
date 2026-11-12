import api from "../api/api";
import type { Surah } from "../types/quran.types";
import type {
    HifzSession,
    HifzSessionRecorder,
    HifzSessionResponse,
    NewSabaqEntry,
    RevisionEntry,
    SabaqStatus,
    SabaqStrength,
    SaveHifzSessionRequest,
} from "../types/hifzSession.types";

// Hifz sessions of a student. The Bearer token is attached by the api.ts
// request interceptor.

const STATUSES: SabaqStatus[] = ["fluent", "mistakes", "repeat", "needs-revision"];
const STRENGTHS: SabaqStrength[] = ["strong", "good", "needs-work", "weak"];

const isObject = (value: unknown): value is Record<string, unknown> =>
    typeof value === "object" && value !== null;

const toNumber = (value: unknown): number | null => {
    if (typeof value === "number" && Number.isFinite(value)) return value;
    if (typeof value === "string" && value.trim() !== "" && Number.isFinite(Number(value))) return Number(value);
    return null;
};

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

// A Surah reference given as `<key>_surah_id` and/or a nested `<key>_surah`
const toSurahRef = (item: Record<string, unknown>, key: "from" | "to") => {
    const surah = toSurah(item[`${key}_surah`]);
    const id = toNumber(item[`${key}_surah_id`]) ?? surah?.id ?? null;

    return { id, surah };
};

const toRevisionEntry = (value: unknown): RevisionEntry | null => {
    if (!isObject(value)) return null;

    const from = toSurahRef(value, "from");
    const to = toSurahRef(value, "to");

    if (from.id === null || to.id === null) return null;

    return {
        id: toNumber(value.id),
        from_surah_id: from.id,
        from_surah: from.surah,
        to_surah_id: to.id,
        to_surah: to.surah,
        status: STATUSES.includes(value.status as SabaqStatus) ? (value.status as SabaqStatus) : null,
        strength: STRENGTHS.includes(value.strength as SabaqStrength) ? (value.strength as SabaqStrength) : null,
        mistakes: toNumber(value.mistakes),
        page: toNumber(value.page),
    };
};

const toNewSabaqEntry = (value: unknown): NewSabaqEntry | null => {
    if (!isObject(value)) return null;

    const from = toSurahRef(value, "from");
    const to = toSurahRef(value, "to");
    const fromAyah = toNumber(value.from_ayah);
    const toAyah = toNumber(value.to_ayah);

    if (from.id === null || to.id === null || fromAyah === null || toAyah === null) return null;

    return {
        id: toNumber(value.id),
        from_surah_id: from.id,
        from_surah: from.surah,
        from_ayah: fromAyah,
        to_surah_id: to.id,
        to_surah: to.surah,
        to_ayah: toAyah,
    };
};

// `recorded_by_user` is nullable (e.g. the recorder was deleted)
const toRecorder = (value: unknown): HifzSessionRecorder | null => {
    if (!isObject(value)) return null;

    const id = toNumber(value.id);

    if (id === null) return null;

    return { id, name: typeof value.name === "string" ? value.name : "" };
};

const toList = <T,>(value: unknown, map: (item: unknown) => T | null): T[] =>
    (Array.isArray(value) ? value : []).map(map).filter((item): item is T => item !== null);

// Entries are read from `old_sabaq` / `manzil` / `new_sabaq` arrays, or from
// a single `entries` array with a `type` per entry
const toSession = (value: unknown): HifzSession | null => {
    if (!isObject(value) || typeof value.id !== "number") return null;

    const entries = Array.isArray(value.entries) ? value.entries.filter(isObject) : null;

    const pick = (section: string) =>
        entries ? entries.filter((entry) => entry.type === section) : value[section];

    return {
        id: value.id,
        recorded_by: toNumber(value.recorded_by),
        recorded_by_user: toRecorder(value.recorded_by_user),
        session_date: typeof value.session_date === "string" ? value.session_date.slice(0, 10) : "",
        notes: typeof value.notes === "string" ? value.notes : null,
        old_sabaq: toList(pick("old_sabaq"), toRevisionEntry),
        manzil: toList(pick("manzil"), toRevisionEntry),
        new_sabaq: toList(pick("new_sabaq"), toNewSabaqEntry),
    };
};

const sessionsPath = (studentId: number) => `/v1/students/${studentId}/hifz-sessions`;

// GET /v1/students/{studentId}/hifz-sessions[?date=Y-m-d]
export const getHifzSessions = async (
    studentId: number,
    date: string | null,
    signal?: AbortSignal
): Promise<HifzSession[]> => {
    const response = await api.get<HifzSessionResponse>(sessionsPath(studentId), {
        params: date ? { date } : undefined,
        signal,
    });

    return toList(response.data.data, toSession);
};

// GET /v1/students/{studentId}/hifz-sessions/{id}
export const getHifzSession = async (
    studentId: number,
    id: number,
    signal?: AbortSignal
): Promise<HifzSession | null> => {
    const response = await api.get<HifzSessionResponse>(`${sessionsPath(studentId)}/${id}`, { signal });
    return toSession(response.data.data);
};

// POST /v1/students/{studentId}/hifz-sessions. The backend sets recorded_by
// from the authenticated user (Teacher, Admin or Super Admin).
export const createHifzSession = async (
    studentId: number,
    payload: SaveHifzSessionRequest
): Promise<{ message: string; session: HifzSession | null }> => {
    const response = await api.post<HifzSessionResponse>(sessionsPath(studentId), payload);
    // The created session, when the response includes it (it gets selected)
    return { message: response.data.message, session: toSession(response.data.data) };
};

// PUT /v1/students/{studentId}/hifz-sessions/{id} (all three arrays required;
// the original recorder is kept)
export const updateHifzSession = async (
    studentId: number,
    id: number,
    payload: SaveHifzSessionRequest
): Promise<{ message: string }> => {
    const response = await api.put<HifzSessionResponse>(`${sessionsPath(studentId)}/${id}`, payload);
    return { message: response.data.message };
};

// DELETE /v1/students/{studentId}/hifz-sessions/{id}
export const deleteHifzSession = async (studentId: number, id: number): Promise<{ message: string }> => {
    const response = await api.delete<HifzSessionResponse>(`${sessionsPath(studentId)}/${id}`);
    return { message: response.data.message };
};
