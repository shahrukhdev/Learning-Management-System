import AuthLayout from "../../components/Layouts/AuthLayout";
import SEO from "../../components/Seo/SEO";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Mail, LockKeyholeOpen, Eye, EyeOff, Check, ArrowRight, ArrowLeft } from "lucide-react";

const Login = () => {

    const { role } = useParams();

    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();

        console.log("Login role:", role);
    };

    return (
        <>

            <SEO
                title="Login | Noor Ul Imaan Masjid"
                description="Sign in to Noor Ul Imaan Masjid Madrassah Portal."
            />

            <AuthLayout sectionClassName="login-section" mainClassName="login-main">
                <form onSubmit={handleSubmit} className="m-0">
                    <div className="login-center login-box">

                        <div className="login-box-top">
                            <h2 className="auth-title m-0">Madrassah Portal</h2>
                            <p className="login-text m-0">Please enter your details to sign in.</p>
                        </div>

                        <div className="form-group">
                            <label className="form-label" htmlFor="email">Email Address</label>

                            <div className="input-wrapper">
                                <span className="input-icon">
                                    <Mail color="#6E7A6D" size={20} strokeWidth={2.5} />
                                </span>
                                <input type="email" id="email" className="form-control" placeholder="teacher@nooracademy.edu" />
                            </div>

                            <span className="error-text d-none">Please enter your email address.</span>
                        </div>

                        <div className="form-group mt-24px">
                            <div className="d-flex justify-content-between align-items-center mb-10px">
                                <label className="form-label mb-0" htmlFor="password">Password</label>
                                <Link className="forgot-password" to={`/reset-password/${role}`}>
                                    Forgot Password?
                                </Link>
                            </div>
                            <div className="input-wrapper">
                                <span className="input-icon">
                                    <LockKeyholeOpen color="#6E7A6D" size={20} strokeWidth={2.5} />
                                </span>
                                <input type={showPassword ? "text" : "password"} id="password" className="form-control" placeholder="••••••••••"/>
                                <button type="button" className="password-eye" onClick={() => setShowPassword(!showPassword)}>
                                    { showPassword ? (
                                        <EyeOff color="#6E7A6D" size={20} strokeWidth={2.5} />  
                                    ) : (
                                        <Eye color="#6E7A6D" size={20} strokeWidth={2.5} />
                                    )}
                                </button>
                            </div>

                            <span className="error-text d-none">Please enter your password.</span>
                        </div>

                        <div className="remember-box">
                            <input className="d-none remember-input" type="checkbox" id="remember" />
                            <label className="remember-me" htmlFor="remember">
                                <span className="check-square">
                                    <Check className="check-icon" size={15} strokeWidth={2.5} />
                                </span>
                                <span className="login-text md">Remember me on this device</span>
                            </label>
                        </div>

                        <button type="submit" className="btn primary-btn w-100 mt-4" >
                            Sign In
                            <ArrowRight color="#fff" size={20} strokeWidth={2} />
                        </button>

                        <div className="login-divider"></div>

                        <div className="account-text text-center login-text md">
                            Don’t have an account?
                            <a href="#">
                                Contact Admin
                            </a>
                        </div>

                        <div className="account-text text-center login-text md mt-4">
                            <Link className="login-text md d-flex justify-content-center align-items-center gap-2" to={`/`}>
                                <ArrowLeft color="#525523" size={18} strokeWidth={2.5} />
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
