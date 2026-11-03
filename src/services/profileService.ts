import api from "../api/api";
import type { ProfileResponse, UpdateProfileRequest } from "../types/profile.types";

export const getProfile = async (): Promise<ProfileResponse> => {
    const response = await api.get<ProfileResponse>("/v1/profile");
    return response.data;
};

const buildProfileFormData = (payload: UpdateProfileRequest): FormData => {
    const formData = new FormData();

    // PHP does not parse multipart bodies on real PATCH requests, so send POST
    // and let Laravel route it as PATCH via method spoofing.
    formData.append("_method", "PATCH");

    formData.append("name", payload.name);
    formData.append("email", payload.email);
    // Empty string becomes null in Laravel (clears the phone number)
    formData.append("phone_no", payload.phone_no);

    if (payload.new_password) {
        formData.append("new_password", payload.new_password);
        formData.append("confirm_password", payload.confirm_password ?? "");
    }

    if (payload.image instanceof File) {
        formData.append("image", payload.image);
    } else if (payload.image === null) {
        // Empty value -> null on the backend -> removes the current image
        formData.append("image", "");
    }

    return formData;
};

export const updateProfile = async (payload: UpdateProfileRequest): Promise<ProfileResponse> => {
    const response = await api.post<ProfileResponse>(
        "/v1/profile",
        buildProfileFormData(payload),
        {
            // Overrides the instance's JSON default. Without this, Axios would
            // serialize the FormData to JSON; with it, the browser sets the
            // multipart boundary itself.
            headers: { "Content-Type": "multipart/form-data" },
        }
    );

    return response.data;
};
