import { CirclePlus } from "lucide-react";
import { Link } from "react-router-dom";
import SEO from "../../../components/Seo/SEO";
import PermissionsTable from "../../../components/Permissions/PermissionsTable";
import "../AdminList.css";
import "../Roles/Roles.css";

const Permissions = () => (
    <>
        <SEO
            title="Permissions Management | Noor Ul Imaan Masjid"
            description="Define and control permissions across the Madrasah portal."
        />
        <section className="admin-list-section">
            <div className="container-fluid">
                <div className="row">
                    <div className="col-12">
                        <div className="section-head">
                            <div>
                                <h1 className="section-title">Manage Permissions</h1>
                                <p className="section-desc-para m-0">
                                    Define and control permissions across the Madrasah portal.
                                </p>
                            </div>
                            <Link
                                to="/admin/dashboard/system/permissions/create-new"
                                className="new-notice-btn"
                            >
                                <CirclePlus color="#fff" size={20} strokeWidth={2.5} />
                                <span>Create New Permission</span>
                            </Link>
                        </div>
                    </div>
                    <div className="col-12">
                        <PermissionsTable />
                    </div>
                </div>
            </div>
        </section>
    </>
);

export default Permissions;
