// Notice/announcement dates in the Notices module format: "d-m-Y" (e.g.
// "04-11-2026"), as GET /v1/notices already sends them. Other endpoints (e.g.
// the dashboard summary) send ISO timestamps, which are converted here.
// Returns null for missing or invalid dates, so raw values are never shown.

const D_M_Y = /^\d{2}-\d{2}-\d{4}$/;

const pad = (value: number) => String(value).padStart(2, "0");

export const formatNoticeDate = (value: string | null | undefined): string | null => {
    const text = value?.trim();

    if (!text) return null;

    // Already in the Notices format
    if (D_M_Y.test(text)) return text;

    const date = new Date(text);

    if (Number.isNaN(date.getTime())) return null;

    return `${pad(date.getDate())}-${pad(date.getMonth() + 1)}-${date.getFullYear()}`;
};
