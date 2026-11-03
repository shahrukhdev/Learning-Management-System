import { API_BASE_URL } from "../api/api";

// The backend returns image paths relative to Laravel's public storage disk
// (e.g. "users/profile.jpg"), served at <base>/storage/<path>.
// Absolute, blob: and data: URLs are returned unchanged.
export const resolveImageUrl = (path: string | null | undefined): string | null => {
    if (!path) return null;

    if (/^(https?:|blob:|data:)/i.test(path)) return path;

    return `${API_BASE_URL}/storage/${path.replace(/^\/+/, "")}`;
};
