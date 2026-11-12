import TopImg1 from "../../assets/images/auth-top-img-1.png";
import TopImg2 from "../../assets/images/auth-top-img-2.png";
import Logo from "../../assets/images/logo.svg";
import Bismillah from "../../assets/images/bismillah.png";
import Copyright from "../../components/Copyright";
import RoleSelection from "./RoleSelection";
import SEO from "../../components/Seo/SEO";

const Home = () => {
  return (
    <>
      <SEO
          title="Role Selection | Noor Ul Imaan Masjid"
          description="Select your role to sign in to Noor Ul Imaan Masjid Madrassah Portal."
      />
      
      <main className="auth-main">  
        <section className="auth-home auth-section">
          <div className="auth-top-imgs">
            <img className="auth-top-img top-img-1" src={TopImg1} alt="" />
            <img className="auth-top-img top-img-2" src={TopImg2} alt="" />
          </div>
          <div className="container">
            <div className="row">
              <div className="col-12">
                <div className="auth-main text-center ">
                  <div className="auth-main-top">
                    <img className="img-fluid auth-log mb-4" src={Logo} alt="" />
                    <img className="img-fluid bismillah-img" src={Bismillah} alt="" />
                  </div>
                  <div className="auth-main-center">
                    <RoleSelection />
                  </div>
                  <div className="auth-main-bottom text-center">
                    <Copyright />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

export default Home;