import api from "../api/api";
import type {
    DeleteNoticeResponse,
    NoticeDetailResponse,
    NoticesListParams,
    NoticesListResponse,
    SaveNoticeRequest,
    SaveNoticeResponse,
} from "../types/notice.types";

// Notices & Announcements API. The Bearer token is attached by the api.ts
// request interceptor.

// GET /v1/notices. Pass an AbortSignal so superseded requests can be cancelled.
export const getNotices = async (
    params: NoticesListParams,
    signal?: AbortSignal
): Promise<NoticesListResponse> => {

    const query: NoticesListParams = {};

    if (params.page !== undefined) query.page = params.page;
    if (params.per_page !== undefined) query.per_page = params.per_page;

    const response = await api.get<NoticesListResponse>("/v1/notices", {
        params: query,
        signal,
    });

    return response.data;
};

// POST /v1/notices
export const createNotice = async (payload: SaveNoticeRequest): Promise<SaveNoticeResponse> => {
    const response = await api.post<SaveNoticeResponse>("/v1/notices", payload);
    return response.data;
};

// GET /v1/notices/{id}
export const getNotice = async (id: number, signal?: AbortSignal): Promise<NoticeDetailResponse> => {
    const response = await api.get<NoticeDetailResponse>(`/v1/notices/${id}`, { signal });
    return response.data;
};

// PUT /v1/notices/{id}
export const updateNotice = async (id: number, payload: SaveNoticeRequest): Promise<SaveNoticeResponse> => {
    const response = await api.put<SaveNoticeResponse>(`/v1/notices/${id}`, payload);
    return response.data;
};

// DELETE /v1/notices/{id}
export const deleteNotice = async (id: number): Promise<DeleteNoticeResponse> => {
    const response = await api.delete<DeleteNoticeResponse>(`/v1/notices/${id}`);
    return response.data;
};
