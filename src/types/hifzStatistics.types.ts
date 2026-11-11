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
}

export interface HifzStatisticsResponse {
    success: boolean;
    message: string;
    data?: unknown;
}
