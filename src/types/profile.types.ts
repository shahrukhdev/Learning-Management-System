// Profile API (GET / PATCH /v1/profile)

export interface ProfileUser {
    id: number;
    name: string;
    email: string;
    phone_no: string | null;
    is_active: boolean | number;
    image: string | null; // storage path, e.g. "users/profile.jpg"
    role: string;
    // Permission names (GET /v1/profile `data.permissions`)
    permissions?: unknown;
}

// Note: profile endpoints use `success` (login uses `status`)
export interface ProfileResponse {
    success: boolean;
    message: string;
    data: ProfileUser;
}

export interface UpdateProfileRequest {
    name: string;
    email: string;
    phone_no: string;
    // Only sent when the user is changing their password
    new_password?: string;
    confirm_password?: string;
    // File = upload new image, null = remove current image, undefined = unchanged
    image?: File | null;
}

export type ProfileFormField =
    | "name"
    | "email"
    | "phone_no"
    | "new_password"
    | "confirm_password"
    | "image";

export type ProfileFormErrors = Partial<Record<ProfileFormField, string>>;
