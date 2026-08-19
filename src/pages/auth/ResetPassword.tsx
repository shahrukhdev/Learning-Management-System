import "./Auth.css";

import { ArrowLeft, ArrowRight, Mail } from "lucide-react";
import Copyright from "../../components/Copyright";

import { Link } from "react-router-dom";

import TopImg1 from "../../assets/images/auth-top-img-1.png";
import TopImg2 from "../../assets/images/auth-top-img-2.png";
import AuthLogo from "../../assets/images/auth-logo.png";
import CenterBr from "../../assets/images/center-br-img.png";
import ResetPassIcon from "../../assets/images/reset-password-icon.png";

const ResetPassword = () => {

    return (
        <main className="auth-main reset-password-main">
            <section className="reset-password-section auth-section">
                <div className="auth-top-imgs">
                    <img className="auth-top-img top-img-1" src={TopImg1} alt="" />
                    <img className="auth-top-img top-img-2" src={TopImg2} alt="" />
                </div>
                <div className="container">
                    <div className="row">
                        <div className="col-12">
                            <form className="m-0" action="">
                                <div className="login-main">

                                    <div className="login-top text-center">
                                        <img className="img-fluid auth-logo" src={AuthLogo} alt="Noor Ul Imaan Masjid" />
                                        <br />
                                        <img className="img-fluid center-br" src={CenterBr} alt="" />
                                    </div>
                                    
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
                                        </div>

                                        <button type="submit" className="btn primary-btn" >
                                            Send Reset Link
                                            <ArrowRight color="#fff" size={20} strokeWidth={2} />
                                        </button>

                                        <div className="login-divider"></div>

                                        <div className="account-text text-center login-text md">
                                            <Link className="login-text md d-flex justify-content-center align-items-center gap-2" to="/login">
                                                <ArrowLeft color="#525523" size={18} strokeWidth={2.5} />
                                                Back to Login
                                            </Link>
                                        </div>

                                    </div>

                                    <div className="login-bottom text-center">
                                        <Copyright />
                                    </div>

                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default ResetPassword;
