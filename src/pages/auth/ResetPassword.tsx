import AuthLayout from "../../components/layouts/AuthLayout";
import SEO from "../../components/seo/SEO";
import { ArrowLeft, ArrowRight, Mail } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import ResetPassIcon from "../../assets/images/reset-password-icon.png";

const ResetPassword = () => {

    const { role } = useParams();

    return (
        <>

            <SEO
                title="Reset Password | Noor Ul Imaan Masjid"
                description="Reset password for Noor Ul Imaan Masjid Madrassah Portal."
            />

            <AuthLayout sectionClassName="reset-password-section" mainClassName="reset-password-main">
                <form className="m-0">
                    <div className="login-center login-box">

                        <div className="login-box-top text-center">
                            <img className="img-fluid reset-pass-icon" src={ResetPassIcon} alt="" />
                            <h2 className="auth-md-title">Reset your password</h2>
                            <p className="login-text m-0">Enter your email address and we'll send you <br /> a link to reset your password.</p>
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

                        <button type="submit" className="btn primary-btn" >
                            Send Reset Link
                            <ArrowRight color="#fff" size={20} strokeWidth={2} />
                        </button>

                        <div className="login-divider"></div>

                        <div className="account-text text-center login-text md">
                            <Link className="login-text md d-flex justify-content-center align-items-center gap-2" to={`/login/${role}`}>
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
