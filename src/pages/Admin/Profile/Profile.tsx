
import "./Profile.css";
import SEO from "../../../components/Seo/SEO";
import ProfileForm from "../../../components/Profile/ProfileForm";

const Profile = () => {

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
                                <ProfileForm />
                            </div>
                        </div>
                    </div>
                </div>

            </section>

        </>
    );
};

export default Profile;
