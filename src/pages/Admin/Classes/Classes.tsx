import { CirclePlus } from "lucide-react";
import { Link } from "react-router-dom";
import SEO from "../../../components/Seo/SEO";
import ClassesTable from "../../../components/Classes/ClassesTable";
import "../AdminList.css";
import "../Roles/Roles.css";

const Classes = () => (
    <>
        <SEO
            title="Classes Management | Noor Ul Imaan Masjid"
            description="Create and manage classes across the Madrasah portal."
        />
        <section className="admin-list-section">
            <div className="container-fluid">
                <div className="row">
                    <div className="col-12">
                        <div className="section-head">
                            <div>
                                <h1 className="section-title">Manage Classes</h1>
                                <p className="section-desc-para m-0">
                                    Create and manage classes across the Madrasah portal.
                                </p>
                            </div>
                            <Link
                                to="/admin/dashboard/academic/classes/create-new"
                                className="new-notice-btn"
                            >
                                <CirclePlus color="#fff" size={20} strokeWidth={2.5} />
                                <span>Create New Class</span>
                            </Link>
                        </div>
                    </div>
                    <div className="col-12">
                        <ClassesTable />
                    </div>
                </div>
            </div>
        </section>
    </>
);

export default Classes;
