// GET /v1/students/{studentId}/hifz-statistics (all values shown as returned)

export interface HifzStatistics {
    memorised: number;
    in_progress: number;
    remaining: number;
    surahs: {
        completed: number;
        total: number;
        percentage: number;
    };
    // Page of the latest session's last Old Sabaq entry / total Quran pages
    pages: {
        completed: number;
        total: number;
        percentage: number;
    };
}

export interface HifzStatisticsResponse {
    success: boolean;
    message: string;
    data?: unknown;
}
