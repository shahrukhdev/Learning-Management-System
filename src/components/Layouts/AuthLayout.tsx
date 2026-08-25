import "../../pages/Auth/Auth.css";

import Copyright from "../Copyright";

import TopImg1 from "../../assets/images/auth-top-img-1.png";
import TopImg2 from "../../assets/images/auth-top-img-2.png";
import AuthLogo from "../../assets/images/auth-logo.png";
import CenterBr from "../../assets/images/center-br-img.png";


const AuthLayout = ({children, sectionClassName="", mainClassName=""}) => {
    return (
        <main className={`auth-main ${mainClassName}`}>
            <section className={`auth-section ${sectionClassName}`}>

                <div className="auth-top-imgs">
                    <img
                        className="auth-top-img top-img-1"
                        src={TopImg1}
                        alt=""
                    />

                    <img
                        className="auth-top-img top-img-2"
                        src={TopImg2}
                        alt=""
                    />
                </div>

                <div className="container">
                    <div className="row">
                        <div className="col-12">

                            <div className="login-main">

                                <div className="login-top text-center">
                                    <img
                                        className="img-fluid auth-logo"
                                        src={AuthLogo}
                                        alt="Noor Ul Imaan Masjid"
                                    />

                                    <br />

                                    <img
                                        className="img-fluid center-br"
                                        src={CenterBr}
                                        alt=""
                                    />
                                </div>

                                {children}

                                <div className="login-bottom text-center">
                                    <Copyright />
                                </div>

                            </div>

                        </div>
                    </div>
                </div>

            </section>
        </main>
    );
};

export default AuthLayout;

