import type { PaginationMeta } from "./api.types";
import type { HifzSession } from "./hifzSession.types";
import type { HifzStatistics } from "./hifzStatistics.types";
import type { StudentQuranMap } from "./quranMap.types";

// GET /v1/my-hifz and GET /v1/my-hifz/sessions (Student role only, read only).
// Statistics, Quran map and sessions use the same shapes as the per-student
// Admin / Teacher endpoints, so their existing types are reused.

export interface MyHifzProfile {
    name: string;
    initials: string;
    image: string | null;
    class_name: string | null;
    admission_number: string | null;
}

export interface MyHifz {
    student: MyHifzProfile;
    statistics: HifzStatistics;
    quran_map: StudentQuranMap;
}

export interface MyHifzSessionsParams {
    page?: number;
    per_page?: number;
    date?: string; // Y-m-d
}

export interface MyHifzSessionsResult {
    sessions: HifzSession[];
    pagination: PaginationMeta | null;
}
