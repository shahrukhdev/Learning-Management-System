import { Plus } from "lucide-react";
import SEO from "../../components/Seo/SEO";

const Notices = () => {
    return (
        <>
            <SEO
                title="Notices | Noor Ul Imaan Masjid"
                description="Manage notices for Noor Ul Imaan Masjid Madrassah Portal."
            />

            <section className="notices-section">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-12">
                            <div className="notices-head">
                                <div className="">
                                    <h1 className="section-title">
                                        Notices & Announcements
                                    </h1>
                                    <p className="notices-desc m-0">Communicate with teachers, students and parents</p>
                                </div> 
                                <button 
                                    type="button"
                                    className="new-notice-btn"
                                >
                                    <Plus color="#fff" size={20} strokeWidth={2.5} />
                                    <span>New Notice</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

        </>
    );
};

export default Notices;