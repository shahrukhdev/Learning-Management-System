import AuthLayout from "../../components/Layouts/AuthLayout";
import SEO from "../../components/Seo/SEO";
import { useRef, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { ArrowLeft, ArrowRight, Mail } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import ResetPassIcon from "../../assets/images/reset-password-icon.png";
import { forgotPassword } from "../../services/authService";
import { getFirstFieldErrors, parseApiError } from "../../utils/apiError";
import type { ForgotPasswordFormErrors } from "../../types/auth.types";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Client-side rules (same wording as the backend): required + valid email
const validateEmail = (email: string): ForgotPasswordFormErrors => {
    const trimmed = email.trim();

    if (!trimmed) {
        return { email: "The email field is required." };
    }

    if (!EMAIL_PATTERN.test(trimmed)) {
        return { email: "The email field must be a valid email address." };
    }

    return {};
};

// Forgot Password: requests a reset link. (Reset Password itself is a
// separate, later feature.)
const ForgotPassword = () => {

    const { role } = useParams();

    const [email, setEmail] = useState("");

    const [errors, setErrors] = useState<ForgotPasswordFormErrors>({});

    const [isSubmitting, setIsSubmitting] = useState(false);

    // Synchronous guard against double submits (state updates are async)
    const isSubmittingRef = useRef(false);

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        setEmail(event.target.value);

        // Clear the error once the user edits the field
        if (errors.email) {
            setErrors({});
        }
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (isSubmittingRef.current) return;

        // Validate before hitting the API
        const clientErrors = validateEmail(email);

        if (clientErrors.email) {
            setErrors(clientErrors);
            return;
        }

        isSubmittingRef.current = true;
        setIsSubmitting(true);
        setErrors({});

        try {
            const response = await forgotPassword({ email: email.trim() });

            // Stay on this screen (no navigation to Reset Password)
            toast.success(response.message || "Password reset link sent successfully.");
        } catch (error) {
            const { status, message, validationErrors } = parseApiError(error);

            if (status === 422 && validationErrors) {
                const emailError = getFirstFieldErrors<"email">(validationErrors).email;

                if (emailError) {
                    setErrors({ email: emailError });
                } else {
                    toast.error(message);
                }
            } else {
                // Other HTTP errors and network errors
                toast.error(message);
            }
        } finally {
            isSubmittingRef.current = false;
            setIsSubmitting(false);
        }
    };

    return (
        <>

            <SEO
                title="Forgot Password - Noor Ul Imaan Masjid"
                description="Forgot password for Noor Ul Imaan Masjid Madrassah Portal."
            />

            <AuthLayout sectionClassName="reset-password-section" mainClassName="reset-password-main">
                {/* noValidate (as on Login) so our inline errors show instead of
                    the browser's popup; `required` stays on the input */}
                <form className="m-0" onSubmit={handleSubmit} noValidate>
                    <div className="login-center login-box">

                        <div className="login-box-top text-center">
                            <img className="img-fluid reset-pass-icon" src={ResetPassIcon} alt="" />
                            <h2 className="auth-md-title">Forgot Password</h2>
                            <p className="login-text m-0">Enter your email address and we'll send you <br /> a link to reset your password.</p>
                        </div>

                        <div className="form-group">
                            <label className="form-label" htmlFor="email">Email Address</label>

                            <div className="input-wrapper">
                                <span className="input-icon">
                                    <Mail color="#6E7A6D" size={20} strokeWidth={2.5} />
                                </span>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    className="form-control"
                                    placeholder="teacher@nooracademy.edu"
                                    value={email}
                                    onChange={handleChange}
                                    autoComplete="email"
                                    aria-invalid={Boolean(errors.email)}
                                    required
                                />
                            </div>

                            {errors.email && (
                                <span className="error-text">{errors.email}</span>
                            )}
                        </div>

                        <button
                            type="submit"
                            className="btn primary-btn"
                            disabled={isSubmitting}
                            aria-busy={isSubmitting}
                        >
                            Send Reset Link
                            {/* Text unchanged; the arrow becomes a spinner while sending */}
                            {isSubmitting ? (
                                <span className="spinner-border spinner-border-sm" aria-hidden="true"></span>
                            ) : (
                                <ArrowRight color="#fff" size={20} strokeWidth={2} />
                            )}
                        </button>

                        <div className="login-divider"></div>

                        <div className="account-text text-center login-text md">
                            <Link className="login-text md d-flex justify-content-center align-items-center gap-2" to={role ? `/login/${role}` : "/login"}>
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

export default ForgotPassword;
