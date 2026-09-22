import { CirclePlus } from "lucide-react";
import { Link } from "react-router-dom";
import SEO from "../../components/Seo/SEO";
import "./Roles.css";
import RolesTable from "../../components/Roles/RolesTable";

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
                            <div className="section-head">
                                <div className="">
                                    <h1 className="section-title">
                                        Manage User Roles
                                    </h1>
                                    <p className="section-desc-para m-0">Define and control access levels across the Madrasah portal.</p>
                                </div> 
                                <Link
                                    to="/dashboard/system/roles/create-new"
                                    className="new-notice-btn"
                                >
                                    <CirclePlus
                                        color="#fff"
                                        size={20}
                                        strokeWidth={2.5}
                                    />

                                    <span>
                                        Create New Role
                                    </span>
                                </Link>
                            </div>  
                        </div>

                        <div className="col-12">
                            <RolesTable />
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default Roles;