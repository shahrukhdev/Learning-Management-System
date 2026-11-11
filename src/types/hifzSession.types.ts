import type { Surah } from "./quran.types";

// Hifz sessions (GET/POST/PUT/DELETE /v1/students/{studentId}/hifz-sessions)

export type SabaqStatus = "fluent" | "mistakes" | "repeat" | "needs-revision";

export type SabaqStrength = "strong" | "good" | "needs-work" | "weak";

export type RevisionSection = "old_sabaq" | "manzil";

export type SessionSection = RevisionSection | "new_sabaq";

// Old Sabaq / Manzil entry as returned by the API. Surahs are nested objects
// when the API includes them; the IDs are always kept.
export interface RevisionEntry {
    id: number | null;
    from_surah_id: number;
    from_surah: Surah | null;
    to_surah_id: number;
    to_surah: Surah | null;
    status: SabaqStatus | null;
    strength: SabaqStrength | null;
    mistakes: number | null;
}

export interface NewSabaqEntry {
    id: number | null;
    from_surah_id: number;
    from_surah: Surah | null;
    from_ayah: number;
    to_surah_id: number;
    to_surah: Surah | null;
    to_ayah: number;
}

export interface HifzSession {
    id: number;
    session_date: string; // Y-m-d
    notes: string | null;
    old_sabaq: RevisionEntry[];
    manzil: RevisionEntry[];
    new_sabaq: NewSabaqEntry[];
}

// Request bodies (no student_id / teacher_id: the backend sets them)
export interface RevisionEntryPayload {
    from_surah_id: number;
    to_surah_id: number;
    status: SabaqStatus;
    strength: SabaqStrength;
    mistakes: number | null;
}

export interface NewSabaqEntryPayload {
    from_surah_id: number;
    from_ayah: number;
    to_surah_id: number;
    to_ayah: number;
}

// Used for create and update (update requires all three arrays, even empty)
export interface SaveHifzSessionRequest {
    session_date: string;
    notes: string | null;
    old_sabaq: RevisionEntryPayload[];
    manzil: RevisionEntryPayload[];
    new_sabaq: NewSabaqEntryPayload[];
}

export interface HifzSessionResponse {
    success: boolean;
    message: string;
    data?: unknown;
}
