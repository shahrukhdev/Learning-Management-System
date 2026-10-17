
import { useRef, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { Camera, Eye, EyeOff, Mail, Phone, UserRound } from "lucide-react";

import "./Profile.css";
import SEO from "../../components/Seo/SEO";

interface ProfileData {
    fullName: string;
    email: string;
    phone: string;
    role: string;
    avatar: string;
}

interface ProfileFormData {
    fullName: string;
    email: string;
    phone: string;
    currentPassword: string;
    newPassword: string;
}

const INITIAL_PROFILE: ProfileData = {
    fullName: "Amina Khan",
    email: "amina.khan@noor-ul-imaan.edu",
    phone: "+1 (555) 782-4190",
    role: "Faculty Fellow",
    avatar: "",
};

const Profile = () => {
    const [profile, setProfile] = useState<ProfileData>(INITIAL_PROFILE);

    const [form, setForm] = useState<ProfileFormData>({
        fullName: INITIAL_PROFILE.fullName,
        email: INITIAL_PROFILE.email,
        phone: INITIAL_PROFILE.phone,
        currentPassword: "",
        newPassword: "",
    });

    const [avatarPreview, setAvatarPreview] = useState("");
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);

    // Single name = first letter.
    // Multiple names = first letter of first and last name.
    const getInitials = (name: string) => {
        const words = name.trim().split(/\s+/).filter(Boolean);

        if (words.length === 0) return "";

        if (words.length === 1) {
            return words[0][0].toUpperCase();
        }

        return (
            words[0][0] +
            words[words.length - 1][0]
        ).toUpperCase();
    };

    const handleChange = (
        event: ChangeEvent<HTMLInputElement>
    ) => {
        const { name, value } = event.target;

        setForm((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    const handlePhotoChange = (
        event: ChangeEvent<HTMLInputElement>
    ) => {
        const file = event.target.files?.[0];

        if (!file) return;

        const reader = new FileReader();

        reader.onload = () => {
            if (typeof reader.result === "string") {
                setAvatarPreview(reader.result);
            }
        };

        reader.readAsDataURL(file);
    };

    const handleSave = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const updatedProfile: ProfileData = {
            ...profile,
            fullName: form.fullName,
            email: form.email,
            phone: form.phone,
            avatar: avatarPreview || profile.avatar,
        };

        const submittedData = {
            fullName: form.fullName,
            email: form.email,
            phone: form.phone,
            currentPassword: form.currentPassword,
            newPassword: form.newPassword,
            profilePicture: fileInputRef.current?.files?.[0] ?? null,
        };

        console.log("Profile form submitted:", submittedData);

        setProfile(updatedProfile);

        setForm((previous) => ({
            ...previous,
            currentPassword: "",
            newPassword: "",
        }));
    };

    const handleCancel = () => {
        setForm({
            fullName: profile.fullName,
            email: profile.email,
            phone: profile.phone,
            currentPassword: "",
            newPassword: "",
        });

        setAvatarPreview("");

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const initials = getInitials(profile.fullName);

    const displayedAvatar = avatarPreview || profile.avatar;

    return (

        <>

            <SEO
                title="Profile | Noor Ul Imaan Masjid"
                description="Manage profile for Noor Ul Imaan Masjid Madrassah Portal."
            />

            <section className="profile-section">

                <div className="container-fluid">
                    <div className="row">
                        <div className="col-12">

                            <div className="profile-page-heading">
                                <h1 className="section-title">Profile</h1>
                                <p className="notices-desc m-0">Communicate with teachers, students and parents</p>
                            </div>

                            <div className="profile-content">
                                <form className="profile-form" onSubmit={handleSave}>
                                    
                                    {/* Profile information */}
                                    <div className="profile-identity">
                                        <div className="profile-avatar-wrapper">
                                            <div className="profile-avatar">
                                                {displayedAvatar ? (
                                                    <img
                                                        src={displayedAvatar}
                                                        alt={profile.fullName}
                                                    />
                                                ) : (
                                                    <span>{initials}</span>
                                                )}
                                            </div>

                                            <button
                                                type="button"
                                                className="profile-camera-button"
                                                aria-label="Change profile picture"
                                                onClick={() =>
                                                    fileInputRef.current?.click()
                                                }
                                            >
                                                <Camera size={14} color="white" strokeWidth={2.2} />
                                            </button>

                                            <input
                                                ref={fileInputRef}
                                                type="file"
                                                accept="image/*"
                                                className="profile-file-input"
                                                onChange={handlePhotoChange}
                                            />
                                        </div>

                                        <div className="profile-identity-info">
                                            <div className="profile-name-row">
                                                <h2>{profile.fullName}</h2>
                                                <span className="profile-role-badge">
                                                    {profile.role}
                                                </span>
                                            </div>

                                            <p>{profile.email}</p>
                                        </div>
                                    </div>

                                    {/* Profile fields */}
                                    <div className="row">

                                        <div className="col-12 col-md-6">
                                            <div className="profile-field">
                                                <label htmlFor="profile-fullName">
                                                    FULL NAME
                                                </label>

                                                <div className="profile-input-icon">
                                                    <input
                                                        id="profile-fullName"
                                                        name="fullName"
                                                        value={form.fullName}
                                                        onChange={handleChange}
                                                        placeholder="Enter full name"
                                                    />

                                                    <UserRound size={15} />
                                                </div>
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
                                                        name="phone"
                                                        value={form.phone}
                                                        onChange={handleChange}
                                                        placeholder="Enter phone number"
                                                    />
                                                    <Phone size={15} />
                                                </div>
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
                                                    />
                                                    <Mail size={15} />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="col-12 col-md-6">
                                            <div className="profile-field">
                                                <label htmlFor="profile-currentPassword">
                                                    CURRENT PASSWORD
                                                </label>

                                                <div className="profile-input-icon">
                                                    <input
                                                        id="profile-currentPassword"
                                                        name="currentPassword"
                                                        type={
                                                            showCurrentPassword
                                                                ? "text"
                                                                : "password"
                                                        }
                                                        value={form.currentPassword}
                                                        onChange={handleChange}
                                                        placeholder="Current password"
                                                    />

                                                    <button
                                                        type="button"
                                                        aria-label="Toggle current password"
                                                        onClick={() =>
                                                            setShowCurrentPassword(
                                                                (previous) => !previous
                                                            )
                                                        }
                                                    >
                                                        {showCurrentPassword ? (
                                                            <EyeOff size={15} />
                                                        ) : (
                                                            <Eye size={15} />
                                                        )}
                                                    </button>
                                                </div>
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
                                                        name="newPassword"
                                                        type={
                                                            showNewPassword
                                                                ? "text"
                                                                : "password"
                                                        }
                                                        value={form.newPassword}
                                                        onChange={handleChange}
                                                        placeholder="New password"
                                                    />

                                                    <button
                                                        type="button"
                                                        aria-label="Toggle new password"
                                                        onClick={() =>
                                                            setShowNewPassword(
                                                                (previous) => !previous
                                                            )
                                                        }
                                                    >
                                                        {showNewPassword ? (
                                                            <EyeOff size={15} />
                                                        ) : (
                                                            <Eye size={15} />
                                                        )}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="col-12">
                                            <div className="form-actions">
                                                <button
                                                    type="button"
                                                    className="form-btn form-btn-cancel"
                                                    onClick={handleCancel}
                                                >
                                                    Cancel
                                                </button>

                                                <button
                                                    type="submit"
                                                    className="form-btn form-btn-primary"
                                                >
                                                    Save Profile Changes
                                                </button>
                                            </div>
                                        </div>

                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>

            </section>

        </>
    );
};

export default Profile;
