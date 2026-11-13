import type { PaginationMeta } from "./api.types";

// NoticeResource
export interface NoticeItem {
    id: number;
    title: string;
    message: string;
    is_active: boolean | number;
    created_at: string; // already formatted by the backend (d-m-Y)
    // Who posted it; null for older notices or a deleted user
    posted_by?: { id: number; name: string } | null;
}

export interface NoticesListResponse {
    success: boolean;
    message: string;
    data: NoticeItem[];
    pagination: PaginationMeta;
}

export interface NoticesListParams {
    page?: number;
    per_page?: number;
}

// GET /v1/notices/{id}
export interface NoticeDetailResponse {
    success: boolean;
    message: string;
    data: NoticeItem;
}

// POST /v1/notices and PUT /v1/notices/{id}
export interface SaveNoticeRequest {
    title: string;
    message: string;
    is_active: boolean;
}

// The saved resource is under `data` whether the controller uses the app's
// { success, message, data } envelope or a plain Laravel resource
export interface SaveNoticeResponse {
    success?: boolean;
    message?: string;
    data: NoticeItem;
}

// DELETE /v1/notices/{id}
export interface DeleteNoticeResponse {
    success: boolean;
    message: string;
    data: null;
}
