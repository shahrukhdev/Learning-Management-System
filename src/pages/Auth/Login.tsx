
import AuthLayout from "../../components/Layouts/AuthLayout";
import SEO from "../../components/Seo/SEO";

import { useRef, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";

import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import { login } from "../../services/authService";
import { setToken } from "../../utils/tokenStorage";
import { getFirstFieldErrors, parseApiError } from "../../utils/apiError";
import type { LoginFormErrors, LoginRequest } from "../../types/auth.types";

import {
    Mail,
    LockKeyholeOpen,
    Eye,
    EyeOff,
    Check,
    ArrowRight,
    ArrowLeft
} from "lucide-react";

const Login = () => {

    const { role } = useParams<{ role: string }>();

    const navigate = useNavigate();

    const [showPassword, setShowPassword] = useState(false);

    const [formData, setFormData] = useState<LoginRequest>({
        email: "",
        password: "",
    });

    const [errors, setErrors] = useState<LoginFormErrors>({});

    const [isSubmitting, setIsSubmitting] = useState(false);

    // Synchronous guard against double submits (state updates are async)
    const isSubmittingRef = useRef(false);

    const dashboardPath =
        role === "teacher" ? "/teacher/dashboard" : "/admin/dashboard";

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const field = e.target.name as keyof LoginRequest;
        const { value } = e.target;

        setFormData((prev) => ({ ...prev, [field]: value }));

        // Clear this field's previous error once the user edits it
        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: undefined }));
        }
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (isSubmittingRef.current) return;

        isSubmittingRef.current = true;
        setIsSubmitting(true);
        setErrors({});

        try {
            const response = await login(formData);

            setToken(response.data.token);

            toast.success(response.message || "Login successful.");

            navigate(dashboardPath);

        } catch (error) {

            const { status, message, validationErrors } = parseApiError(error);

            if (status === 422 && validationErrors) {

                const fieldErrors = getFirstFieldErrors<keyof LoginRequest>(validationErrors);

                setErrors({
                    email: fieldErrors.email,
                    password: fieldErrors.password,
                });

                // Only toast if the backend flagged something we can't show inline
                const hasInlineError = Boolean(fieldErrors.email || fieldErrors.password);

                if (!hasInlineError) {
                    toast.error(message);
                }

            } else {
                // 401 (invalid credentials), 500, other errors, and network errors
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
                title="Login | Noor Ul Imaan Masjid"
                description="Sign in to Noor Ul Imaan Masjid Madrassah Portal."
            />

            <AuthLayout
                sectionClassName="login-section"
                mainClassName="login-main"
            >

                <form onSubmit={handleSubmit} className="m-0" noValidate>

                    <div className="login-center login-box">

                        <div className="login-box-top">
                            <h2 className="auth-title m-0">
                                Madrassah Portal
                            </h2>

                            <p className="login-text m-0">
                                Please enter your details to sign in.
                            </p>
                        </div>

                        {/* Email */}
                        <div className="form-group">

                            <label className="form-label" htmlFor="email">
                                Email Address
                            </label>

                            <div className="input-wrapper">

                                <span className="input-icon">
                                    <Mail
                                        color="#6E7A6D"
                                        size={20}
                                        strokeWidth={2.5}
                                    />
                                </span>

                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    className="form-control"
                                    placeholder="teacher@nooracademy.edu"
                                    value={formData.email}
                                    onChange={handleChange}
                                    autoComplete="email"
                                    aria-invalid={Boolean(errors.email)}
                                />

                            </div>

                            {errors.email && (
                                <span className="error-text">
                                    {errors.email}
                                </span>
                            )}

                        </div>

                        {/* Password */}
                        <div className="form-group mt-24px">

                            <div className="d-flex justify-content-between align-items-center mb-10px">

                                <label
                                    className="form-label mb-0"
                                    htmlFor="password"
                                >
                                    Password
                                </label>

                                <Link
                                    className="forgot-password"
                                    to={`/reset-password/${role}`}
                                >
                                    Forgot Password?
                                </Link>

                            </div>

                            <div className="input-wrapper">

                                <span className="input-icon">
                                    <LockKeyholeOpen
                                        color="#6E7A6D"
                                        size={20}
                                        strokeWidth={2.5}
                                    />
                                </span>

                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    name="password"
                                    className="form-control"
                                    placeholder="••••••••••"
                                    value={formData.password}
                                    onChange={handleChange}
                                    autoComplete="current-password"
                                    aria-invalid={Boolean(errors.password)}
                                />

                                <button
                                    type="button"
                                    className="password-eye"
                                    onClick={() => setShowPassword(!showPassword)}
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                >
                                    {showPassword ? (
                                        <EyeOff
                                            color="#6E7A6D"
                                            size={20}
                                            strokeWidth={2.5}
                                        />
                                    ) : (
                                        <Eye
                                            color="#6E7A6D"
                                            size={20}
                                            strokeWidth={2.5}
                                        />
                                    )}
                                </button>

                            </div>

                            {errors.password && (
                                <span className="error-text">
                                    {errors.password}
                                </span>
                            )}

                        </div>

                        {/* Remember Me */}
                        <div className="remember-box">

                            <input
                                className="d-none remember-input"
                                type="checkbox"
                                id="remember"
                            />

                            <label
                                className="remember-me"
                                htmlFor="remember"
                            >

                                <span className="check-square">
                                    <Check
                                        className="check-icon"
                                        size={15}
                                        strokeWidth={2.5}
                                    />
                                </span>

                                <span className="login-text md">
                                    Remember me on this device
                                </span>

                            </label>

                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            className="btn primary-btn w-100 mt-4"
                            disabled={isSubmitting}
                            aria-busy={isSubmitting}
                        >
                            {isSubmitting ? "Signing In..." : "Sign In"}

                            <ArrowRight
                                color="#fff"
                                size={20}
                                strokeWidth={2}
                            />
                        </button>

                        <div className="login-divider"></div>

                        {/* Contact Admin */}
                        <div className="account-text text-center login-text md">

                            Don’t have an account?

                            <a href="#">
                                Contact Admin
                            </a>

                        </div>

                        {/* Back */}
                        <div className="account-text text-center login-text md mt-4">

                            <Link
                                className="login-text md d-flex justify-content-center align-items-center gap-2"
                                to="/"
                            >
                                <ArrowLeft
                                    color="#525523"
                                    size={18}
                                    strokeWidth={2.5}
                                />

                                Back
                            </Link>

                        </div>

                    </div>

                </form>

            </AuthLayout>

        </>
    );
};

export default Login;
