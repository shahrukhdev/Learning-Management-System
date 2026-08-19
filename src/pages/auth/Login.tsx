import "./Auth.css";

import { useState } from "react";
import { Link, useParams } from "react-router-dom";

import { Mail, LockKeyholeOpen, Eye, EyeOff, Check, ArrowRight } from "lucide-react";
import Copyright from "../../components/Copyright";

import TopImg1 from "../../assets/images/auth-top-img-1.png";
import TopImg2 from "../../assets/images/auth-top-img-2.png";
import AuthLogo from "../../assets/images/auth-logo.png";
import CenterBr from "../../assets/images/center-br-img.png";


const Login = () => {

    const { role } = useParams();

    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();

        console.log("Login role:", role);
    };

    return (
        <main className="auth-main login-main">
            <section className="login-section auth-section">
                <div className="auth-top-imgs">
                    <img className="auth-top-img top-img-1" src={TopImg1} alt="" />
                    <img className="auth-top-img top-img-2" src={TopImg2} alt="" />
                </div>
                <div className="container">
                    <div className="row">
                        <div className="col-12">
                            <form className="m-0" onSubmit={handleSubmit}>
                                <div className="login-main">

                                    <div className="login-top text-center">
                                        <img className="img-fluid auth-logo" src={AuthLogo} alt="Noor Ul Imaan Masjid" />
                                        <br />
                                        <img className="img-fluid center-br" src={CenterBr} alt="" />
                                    </div>
                                    
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
                                        </div>

                                        <div className="form-group mt-24px">
                                            <div className="d-flex justify-content-between align-items-center mb-10px">
                                                <label className="form-label mb-0" htmlFor="password">Password</label>
                                                <Link className="forgot-password" to="/reset-password">
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

export default Login;
