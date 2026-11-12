import { useCallback, useEffect, useRef, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { Camera, Eye, EyeOff, Mail, Phone, UserRound } from "lucide-react";
import { toast } from "react-toastify";

import AvatarContent from "../Avatar/AvatarContent";
import { getProfile, updateProfile } from "../../services/profileService";
import { useAuth } from "../../hooks/useAuth";
import { toAuthUser } from "../../utils/authUser";
import { resolveImageUrl } from "../../utils/imageUrl";
import { getFirstFieldErrors, parseApiError } from "../../utils/apiError";
import type {
    ProfileFormErrors,
    ProfileFormField,
    ProfileUser,
    UpdateProfileRequest,
} from "../../types/profile.types";

// Mirrors the backend rules
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const ALLOWED_IMAGE_EXTENSIONS = /\.(jpe?g|png|webp)$/i;
const MAX_IMAGE_BYTES = 2048 * 1024; // 2048 KB
const MAX_NAME_LENGTH = 255;
const MAX_PHONE_LENGTH = 20;
const MIN_PASSWORD_LENGTH = 8;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const PROFILE_FIELDS: ProfileFormField[] = [
    "name", "email", "phone_no", "new_password", "confirm_password", "image",
];

interface ProfileFormValues {
    name: string;
    email: string;
    phone_no: string;
    new_password: string;
    confirm_password: string;
}

const EMPTY_FORM: ProfileFormValues = {
    name: "",
    email: "",
    phone_no: "",
    new_password: "",
    confirm_password: "",
};

// Password fields are never populated from the API
const toFormValues = (profile: ProfileUser): ProfileFormValues => ({
    ...EMPTY_FORM,
    name: profile.name,
    email: profile.email,
    phone_no: profile.phone_no ?? "",
});

const validateImage = (file: File): string | undefined => {
    const hasAllowedType =
        ALLOWED_IMAGE_TYPES.includes(file.type) || ALLOWED_IMAGE_EXTENSIONS.test(file.name);

    if (!hasAllowedType) {
        return "The image must be a file of type: jpg, jpeg, png, webp.";
    }

    if (file.size > MAX_IMAGE_BYTES) {
        return "The image must not be greater than 2 MB.";
    }

    return undefined;
};

const validateForm = (values: ProfileFormValues, imageFile: File | null): ProfileFormErrors => {
    const errors: ProfileFormErrors = {};

    const name = values.name.trim();
    const email = values.email.trim();

    if (!name) {
        errors.name = "The name field is required.";
    } else if (name.length > MAX_NAME_LENGTH) {
        errors.name = `The name must not be greater than ${MAX_NAME_LENGTH} characters.`;
    }

    if (!email) {
        errors.email = "The email field is required.";
    } else if (!EMAIL_PATTERN.test(email)) {
        errors.email = "The email must be a valid email address.";
    }

    if (values.phone_no.trim().length > MAX_PHONE_LENGTH) {
        errors.phone_no = `The phone number must not be greater than ${MAX_PHONE_LENGTH} characters.`;
    }

    if (values.new_password) {
        if (values.new_password.length < MIN_PASSWORD_LENGTH) {
            errors.new_password = `The new password must be at least ${MIN_PASSWORD_LENGTH} characters.`;
        }

        if (!values.confirm_password) {
            errors.confirm_password = "The confirm password field is required.";
        } else if (values.confirm_password !== values.new_password) {
            errors.confirm_password = "The confirm password must match the new password.";
        }
    }

    if (imageFile) {
        const imageError = validateImage(imageFile);
        if (imageError) errors.image = imageError;
    }

    return errors;
};

const ProfileForm = () => {

    const { user, setUser } = useAuth();

    // Last profile saved on the server
    const [profile, setProfile] = useState<ProfileUser | null>(null);

    const [form, setForm] = useState<ProfileFormValues>(EMPTY_FORM);
    const [errors, setErrors] = useState<ProfileFormErrors>({});

    // Image: newly selected file + its preview, or a pending removal
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [removeImage, setRemoveImage] = useState(false);

    const [isLoading, setIsLoading] = useState(true);
    const [loadFailed, setLoadFailed] = useState(false);
    const [reloadKey, setReloadKey] = useState(0);

    const [isSaving, setIsSaving] = useState(false);
    const isSavingRef = useRef(false);

    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);

    // Store server data in the form and keep AuthContext (Header/Sidebar) in sync
    const applyProfile = useCallback((data: ProfileUser) => {
        setProfile(data);
        setForm(toFormValues(data));
        setUser(toAuthUser(data));
    }, [setUser]);

    // Always fetch the latest profile, even if AuthContext already has a user
    useEffect(() => {
        let ignore = false;

        getProfile()
            .then((response) => {
                if (!ignore) applyProfile(response.data);
            })
            .catch((error: unknown) => {
                if (ignore) return;

                setLoadFailed(true);

                const { status, message } = parseApiError(error);

                // 401 is handled globally (token cleared + redirect + toast)
                if (status !== 401) toast.error(message);
            })
            .finally(() => {
                if (!ignore) setIsLoading(false);
            });

        return () => {
            ignore = true;
        };
    }, [applyProfile, reloadKey]);

    // Revoke the temporary preview URL when it is replaced or on unmount
    useEffect(() => {
        if (!previewUrl) return;

        return () => URL.revokeObjectURL(previewUrl);
    }, [previewUrl]);

    const clearSelectedImage = () => {
        setImageFile(null);
        setPreviewUrl(null);

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleRetry = () => {
        setLoadFailed(false);
        setIsLoading(true);
        setReloadKey((key) => key + 1);
    };

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const field = event.target.name as keyof ProfileFormValues;
        const { value } = event.target;

        setForm((previous) => ({ ...previous, [field]: value }));

        // Clear the corrected field's error (a new password change can also
        // resolve a "must match" error on confirm password)
        setErrors((previous) => ({
            ...previous,
            [field]: undefined,
            ...(field === "new_password" ? { confirm_password: undefined } : {}),
        }));
    };

    const handlePhotoChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];

        if (!file) return;

        const imageError = validateImage(file);

        if (imageError) {
            setErrors((previous) => ({ ...previous, image: imageError }));
            event.target.value = "";
            return;
        }

        setErrors((previous) => ({ ...previous, image: undefined }));
        setImageFile(file);
        setPreviewUrl(URL.createObjectURL(file));
        setRemoveImage(false);
    };

    const handleRemovePhoto = () => {
        clearSelectedImage();
        setErrors((previous) => ({ ...previous, image: undefined }));

        // Only a saved image needs removing on the server
        if (profile?.image) {
            setRemoveImage(true);
        }
    };

    const handleSave = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (isSavingRef.current || !profile) return;

        const clientErrors = validateForm(form, imageFile);

        if (Object.keys(clientErrors).length > 0) {
            setErrors(clientErrors);
            return;
        }

        isSavingRef.current = true;
        setIsSaving(true);
        setErrors({});

        const payload: UpdateProfileRequest = {
            name: form.name.trim(),
            email: form.email.trim(),
            phone_no: form.phone_no.trim(),
        };

        // Don't send empty password fields
        if (form.new_password) {
            payload.new_password = form.new_password;
            payload.confirm_password = form.confirm_password;
        }

        if (imageFile) {
            payload.image = imageFile;
        } else if (removeImage) {
            payload.image = null;
        }

        try {
            const response = await updateProfile(payload);

            // Resets the form (incl. clearing passwords) and syncs AuthContext
            applyProfile(response.data);
            clearSelectedImage();
            setRemoveImage(false);
            setShowNewPassword(false);
            setShowConfirmPassword(false);

            toast.success(response.message || "Profile updated successfully.");

        } catch (error) {

            const { status, message, validationErrors } = parseApiError(error);

            if (status === 401) return; // handled globally

            if (status === 422 && validationErrors) {

                const fieldErrors = getFirstFieldErrors<ProfileFormField>(validationErrors);

                const inlineErrors: ProfileFormErrors = {};

                PROFILE_FIELDS.forEach((field) => {
                    if (fieldErrors[field]) inlineErrors[field] = fieldErrors[field];
                });

                setErrors(inlineErrors);

                // Only toast if nothing could be shown inline
                if (Object.keys(inlineErrors).length === 0) {
                    toast.error(message);
                }

            } else {
                toast.error(message);
            }

        } finally {
            isSavingRef.current = false;
            setIsSaving(false);
        }
    };

    const handleCancel = () => {
        if (!profile) return;

        setForm(toFormValues(profile));
        setErrors({});
        clearSelectedImage();
        setRemoveImage(false);
    };

    if (isLoading) {
        return (
            <div className="profile-status">
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading profile...</span>
                </div>
            </div>
        );
    }

    if (loadFailed || !profile) {
        return (
            <div className="profile-status">
                <p className="m-0">We couldn't load your profile.</p>

                <button
                    type="button"
                    className="form-btn form-btn-primary"
                    onClick={handleRetry}
                >
                    Try Again
                </button>
            </div>
        );
    }

    const savedImageUrl = removeImage ? null : resolveImageUrl(profile.image);
    const displayedAvatar = previewUrl ?? savedImageUrl;

    return (
        <form className="profile-form" onSubmit={handleSave} noValidate>

            {/* Profile information */}
            <div className="profile-identity">
                <div className="profile-avatar-wrapper">
                    <div className="profile-avatar">
                        <AvatarContent
                            src={displayedAvatar}
                            alt={profile.name}
                            // Same API initials as the Header/Sidebar (AuthContext)
                            fallback={<span>{user?.initials || profile.initials}</span>}
                        />
                    </div>

                    <button
                        type="button"
                        className="profile-camera-button"
                        aria-label="Change profile picture"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isSaving}
                    >
                        <Camera size={14} color="white" strokeWidth={2.2} />
                    </button>

                    <input
                        ref={fileInputRef}
                        type="file"
                        accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                        className="profile-file-input"
                        onChange={handlePhotoChange}
                    />
                </div>

                <div className="profile-identity-info">
                    <div className="profile-name-row">
                        <h2>{profile.name}</h2>
                        <span className="profile-role-badge">
                            {profile.role}
                        </span>
                    </div>

                    <p>{profile.email}</p>

                    {displayedAvatar && (
                        <button
                            type="button"
                            className="profile-remove-photo"
                            onClick={handleRemovePhoto}
                            disabled={isSaving}
                        >
                            Remove photo
                        </button>
                    )}

                    {errors.image && (
                        <span className="error-text d-block">{errors.image}</span>
                    )}
                </div>
            </div>

            {/* Profile fields */}
            <div className="row">

                <div className="col-12 col-md-6">
                    <div className="profile-field">
                        <label htmlFor="profile-name">
                            FULL NAME
                        </label>

                        <div className="profile-input-icon">
                            <input
                                id="profile-name"
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                placeholder="Enter full name"
                                autoComplete="name"
                                aria-invalid={Boolean(errors.name)}
                            />

                            <UserRound size={15} />
                        </div>

                        {errors.name && <span className="error-text">{errors.name}</span>}
                    </div>
                </div>


                <div className="col-12 col-md-6">
                    <div className="profile-field">
                        <label htmlFor="profile-phone">
                            CONTACT / PHONE NUMBER
                        </label>

                        <div className="profile-input-icon">
                            <input
                                id="profile-phone"
                                name="phone_no"
                                type="tel"
                                value={form.phone_no}
                                onChange={handleChange}
                                placeholder="Enter phone number"
                                autoComplete="tel"
                                aria-invalid={Boolean(errors.phone_no)}
                            />
                            <Phone size={15} />
                        </div>

                        {errors.phone_no && <span className="error-text">{errors.phone_no}</span>}
                    </div>
                </div>

                <div className="col-12">
                    <div className="profile-field ">
                        <label htmlFor="profile-email">
                            EMAIL ADDRESS
                        </label>

                        <div className="profile-input-icon">
                            <input
                                id="profile-email"
                                name="email"
                                type="email"
                                value={form.email}
                                onChange={handleChange}
                                placeholder="Enter email address"
                                autoComplete="email"
                                aria-invalid={Boolean(errors.email)}
                            />
                            <Mail size={15} />
                        </div>

                        {errors.email && <span className="error-text">{errors.email}</span>}
                    </div>
                </div>

                <div className="col-12 col-md-6">
                    <div className="profile-field">
                        <label htmlFor="profile-newPassword">
                            NEW PASSWORD
                        </label>

                        <div className="profile-input-icon">
                            <input
                                id="profile-newPassword"
                                name="new_password"
                                type={showNewPassword ? "text" : "password"}
                                value={form.new_password}
                                onChange={handleChange}
                                placeholder="New password"
                                autoComplete="new-password"
                                aria-invalid={Boolean(errors.new_password)}
                            />

                            <button
                                type="button"
                                aria-label="Toggle new password"
                                onClick={() => setShowNewPassword((previous) => !previous)}
                            >
                                {showNewPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                            </button>
                        </div>

                        {errors.new_password && <span className="error-text">{errors.new_password}</span>}
                    </div>
                </div>

                <div className="col-12 col-md-6">
                    <div className="profile-field">
                        <label htmlFor="profile-confirmPassword">
                            CONFIRM PASSWORD
                        </label>

                        <div className="profile-input-icon">
                            <input
                                id="profile-confirmPassword"
                                name="confirm_password"
                                type={showConfirmPassword ? "text" : "password"}
                                value={form.confirm_password}
                                onChange={handleChange}
                                placeholder="Confirm new password"
                                autoComplete="new-password"
                                aria-invalid={Boolean(errors.confirm_password)}
                            />

                            <button
                                type="button"
                                aria-label="Toggle confirm password"
                                onClick={() => setShowConfirmPassword((previous) => !previous)}
                            >
                                {showConfirmPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                            </button>
                        </div>

                        {errors.confirm_password && <span className="error-text">{errors.confirm_password}</span>}
                    </div>
                </div>

                <div className="col-12">
                    <div className="form-actions">
                        <button
                            type="button"
                            className="form-btn form-btn-cancel"
                            onClick={handleCancel}
                            disabled={isSaving}
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="form-btn form-btn-primary"
                            disabled={isSaving}
                            aria-busy={isSaving}
                        >
                            {isSaving ? "Saving..." : "Save Profile Changes"}
                        </button>
                    </div>
                </div>

            </div>
        </form>
    );
};

export default ProfileForm;
