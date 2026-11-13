import AuthLayout from "../../components/Layouts/AuthLayout";
import SEO from "../../components/Seo/SEO";
import { useRef, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { ArrowLeft, ArrowRight, Eye, EyeOff, LockKeyholeOpen } from "lucide-react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import ResetPassIcon from "../../assets/images/reset-password-icon.png";
import { resetPassword } from "../../services/authService";
import { getFirstFieldErrors, parseApiError } from "../../utils/apiError";
import type { ResetPasswordFormErrors } from "../../types/auth.types";

const MIN_PASSWORD_LENGTH = 8;

type PasswordField = keyof ResetPasswordFormErrors;

interface ResetPasswordFormData {
    password: string;
    password_confirmation: string;
}

const INVALID_LINK_MESSAGE =
    "This password reset link is invalid or incomplete. Please request a new one.";

// Client-side rules (same wording as the backend)
const validatePasswords = (data: ResetPasswordFormData): ResetPasswordFormErrors => {
    const errors: ResetPasswordFormErrors = {};

    if (!data.password) {
        errors.password = "The password field is required.";
    } else if (data.password.length < MIN_PASSWORD_LENGTH) {
        errors.password = `The password field must be at least ${MIN_PASSWORD_LENGTH} characters.`;
    }

    if (!data.password_confirmation) {
        errors.password_confirmation = "The password confirmation field is required.";
    } else if (data.password && data.password !== data.password_confirmation) {
        errors.password_confirmation = "The password confirmation does not match.";
    }

    return errors;
};

// Reset Password: opened from the emailed Laravel link
// (/reset-password/{token}?email=...). Email and token come from the URL.
const ResetPassword = () => {

    const navigate = useNavigate();

    const { token: pathToken } = useParams<{ token: string }>();

    const [searchParams] = useSearchParams();

    // Token is normally in the path; ?token= is accepted as a fallback
    const token = (pathToken ?? searchParams.get("token") ?? "").trim();

    const email = (searchParams.get("email") ?? "").trim();

    const isLinkValid = Boolean(token && email);

    const [formData, setFormData] = useState<ResetPasswordFormData>({
        password: "",
        password_confirmation: "",
    });

    const [errors, setErrors] = useState<ResetPasswordFormErrors>({});

    // Email/token problems from the API (e.g. expired or invalid token)
    const [linkError, setLinkError] = useState<string | null>(null);

    const [showPassword, setShowPassword] = useState(false);

    const [showConfirmation, setShowConfirmation] = useState(false);

    const [isSubmitting, setIsSubmitting] = useState(false);

    // Synchronous guard against double submits (state updates are async)
    const isSubmittingRef = useRef(false);

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const field = event.target.name as PasswordField;
        const { value } = event.target;

        setFormData((current) => ({ ...current, [field]: value }));

        // Clear the field's error once the user edits it
        if (errors[field]) {
            setErrors((current) => ({ ...current, [field]: undefined }));
        }
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (isSubmittingRef.current) return;

        if (!isLinkValid) {
            toast.error(INVALID_LINK_MESSAGE);
            return;
        }

        // Validate before hitting the API
        const clientErrors = validatePasswords(formData);

        if (clientErrors.password || clientErrors.password_confirmation) {
            setErrors(clientErrors);
            return;
        }

        isSubmittingRef.current = true;
        setIsSubmitting(true);
        setErrors({});
        setLinkError(null);

        try {
            const response = await resetPassword({
                email,
                token,
                password: formData.password,
                password_confirmation: formData.password_confirmation,
            });

            toast.success(response.message || "Password reset successfully.");

            // Not signed in automatically: the user logs in with the new password
            navigate("/login", { replace: true });
        } catch (error) {
            const { status, message, validationErrors } = parseApiError(error);

            if (status === 422 && validationErrors) {
                const fieldErrors = getFirstFieldErrors<string>(validationErrors);

                const inlineErrors: ResetPasswordFormErrors = {
                    password: fieldErrors.password,
                    // Laravel puts "confirmed" failures on `password`; a
                    // separate key is mapped too in case the API sends one
                    password_confirmation: fieldErrors.password_confirmation,
                };

                // No email/token inputs exist, so their errors (incl. an
                // invalid/expired token) are shown above the form
                const urlError = fieldErrors.token || fieldErrors.email || null;

                setErrors(inlineErrors);
                setLinkError(urlError);

                if (!inlineErrors.password && !inlineErrors.password_confirmation && !urlError) {
                    toast.error(message);
                }
            } else {
                // Invalid/expired token (non-422), other HTTP and network errors:
                // stay here so the user can request a new link
                if (status !== null && status >= 400 && status < 500) {
                    setLinkError(message);
                }

                toast.error(message);
            }
        } finally {
            isSubmittingRef.current = false;
            setIsSubmitting(false);
        }
    };

    const visibleLinkError = isLinkValid ? linkError : INVALID_LINK_MESSAGE;

    return (
        <>

            <SEO
                title="Reset Password - Noor Ul Imaan Masjid"
                description="Reset password for Noor Ul Imaan Masjid Madrassah Portal."
            />

            <AuthLayout sectionClassName="reset-password-section" mainClassName="reset-password-main">
                {/* noValidate (as on Login) so our inline errors show instead of
                    the browser's popup; `required` stays on the inputs */}
                <form className="m-0" onSubmit={handleSubmit} noValidate>
                    <div className="login-center login-box">

                        <div className="login-box-top text-center">
                            <img className="img-fluid reset-pass-icon" src={ResetPassIcon} alt="" />
                            <h2 className="auth-md-title">Reset Password</h2>
                            <p className="login-text m-0">
                                {isLinkValid ? (
                                    <>Enter a new password for <strong>{email}</strong>.</>
                                ) : (
                                    <>Choose a new password <br /> for your account.</>
                                )}
                            </p>
                            {visibleLinkError && (
                                <span className="error-text d-block mt-2" role="alert">
                                    {visibleLinkError}{" "}
                                    <Link to="/forgot-password">Request a new link</Link>
                                </span>
                            )}
                        </div>

                        {/* New Password */}
                        <div className="form-group">
                            <label className="form-label" htmlFor="password">New Password<span className="required-mark" aria-hidden="true">*</span></label>

                            <div className="input-wrapper">
                                <span className="input-icon">
                                    <LockKeyholeOpen color="#6E7A6D" size={20} strokeWidth={2.5} />
                                </span>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    name="password"
                                    className="form-control"
                                    placeholder="••••••••••"
                                    value={formData.password}
                                    onChange={handleChange}
                                    autoComplete="new-password"
                                    aria-invalid={Boolean(errors.password)}
                                    disabled={!isLinkValid}
                                    required
                                />
                                <button
                                    type="button"
                                    className="password-eye"
                                    onClick={() => setShowPassword((current) => !current)}
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                >
                                    {showPassword ? (
                                        <EyeOff color="#6E7A6D" size={20} strokeWidth={2.5} />
                                    ) : (
                                        <Eye color="#6E7A6D" size={20} strokeWidth={2.5} />
                                    )}
                                </button>
                            </div>

                            {errors.password && (
                                <span className="error-text">{errors.password}</span>
                            )}
                        </div>

                        {/* Confirm Password */}
                        <div className="form-group mt-24px">
                            <label className="form-label" htmlFor="password_confirmation">Confirm Password<span className="required-mark" aria-hidden="true">*</span></label>

                            <div className="input-wrapper">
                                <span className="input-icon">
                                    <LockKeyholeOpen color="#6E7A6D" size={20} strokeWidth={2.5} />
                                </span>
                                <input
                                    type={showConfirmation ? "text" : "password"}
                                    id="password_confirmation"
                                    name="password_confirmation"
                                    className="form-control"
                                    placeholder="••••••••••"
                                    value={formData.password_confirmation}
                                    onChange={handleChange}
                                    autoComplete="new-password"
                                    aria-invalid={Boolean(errors.password_confirmation)}
                                    disabled={!isLinkValid}
                                    required
                                />
                                <button
                                    type="button"
                                    className="password-eye"
                                    onClick={() => setShowConfirmation((current) => !current)}
                                    aria-label={showConfirmation ? "Hide password" : "Show password"}
                                >
                                    {showConfirmation ? (
                                        <EyeOff color="#6E7A6D" size={20} strokeWidth={2.5} />
                                    ) : (
                                        <Eye color="#6E7A6D" size={20} strokeWidth={2.5} />
                                    )}
                                </button>
                            </div>

                            {errors.password_confirmation && (
                                <span className="error-text">{errors.password_confirmation}</span>
                            )}
                        </div>

                        <button
                            type="submit"
                            className="btn primary-btn"
                            disabled={isSubmitting || !isLinkValid}
                            aria-busy={isSubmitting}
                        >
                            Reset Password
                            {/* The arrow becomes a spinner while submitting */}
                            {isSubmitting ? (
                                <span className="spinner-border spinner-border-sm" aria-hidden="true"></span>
                            ) : (
                                <ArrowRight color="#fff" size={20} strokeWidth={2} />
                            )}
                        </button>

                        <div className="login-divider"></div>

                        <div className="account-text text-center login-text md">
                            <Link className="login-text md d-flex justify-content-center align-items-center gap-2" to="/login">
                                <ArrowLeft color="#525523" size={18} strokeWidth={2.5} />
                                Back to Login
                            </Link>
                        </div>

                    </div>
                </form>
            </AuthLayout>
        </>
    );
};

export default ResetPassword;
