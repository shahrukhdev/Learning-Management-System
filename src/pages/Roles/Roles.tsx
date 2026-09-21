import { CirclePlus } from "lucide-react";
import SEO from "../../components/Seo/SEO";
import "./Roles.css";

const Roles = () => {

    return (
        <>
            <SEO
                title="Roles Management | Noor Ul Imaan Masjid"
                description="Define and control access levels across the Madrasah portal."
            />

            <section className="roles-section">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-12">
                            <div className="notices-head">
                                <div className="">
                                    <h1 className="section-title">
                                        Manage User Roles
                                    </h1>
                                    <p className="notices-desc m-0">Define and control access levels across the Madrasah portal.</p>
                                </div> 
                                <button 
                                    type="button"
                                    className="new-notice-btn"
                                >
                                    <CirclePlus color="#fff" size={20} strokeWidth={2.5} />
                                    <span>Create New Role</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default Roles;