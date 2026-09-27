import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

import SEO from "../../../components/Seo/SEO";

import PermissionMatrix from "../../../components/Roles/EditRole/PermissionMatrix/PermissionMatrix";
import AssignPersonnel from "../../../components/Roles/EditRole/AssignPersonnel/AssignPersonnel";

import "./EditRole.css";


const EditRole = () => {

    return (

        <>

            <SEO
                title="Edit Role - Madrasah Portal"
                description="Edit role in the Madrasah Portal"
            />


            <section className="edit-role-section">

                <div className="container-fluid">

                    <div className="row">

                        <div className="col-12">

                            {/* Page Header */}

                            <div className="edit-role-page-header">

                                {/* Left */}

                                <div className="edit-role-header-left">

                                    <Link
                                        to="/dashboard/system/roles"
                                        className="role-back-btn"
                                        aria-label="Back to roles"
                                    >
                                        <ArrowLeft
                                            size={22}
                                            strokeWidth={2.2}
                                        />
                                    </Link>


                                    <div className="edit-role-heading">

                                        <div className="edit-role-title-row">

                                            <h1 className="section-title">
                                                Senior Teacher
                                            </h1>

                                            <span className="edit-role-status">
                                                Active
                                            </span>

                                        </div>


                                        <p className="section-desc-para m-0">
                                            Manage permissions and assigned personnel for this role.
                                        </p>

                                    </div>

                                </div>


                                {/* Actions */}

                                <div className="form-actions edit-role-actions">

                                    <button
                                        type="button"
                                        className="form-btn form-btn-cancel"
                                    >
                                        Discard Changes
                                    </button>


                                    <button
                                        type="button"
                                        className="form-btn form-btn-primary"
                                    >
                                        Save Configuration
                                    </button>

                                </div>

                            </div>

                        </div>

                        {/* Permission Matrix */}

                        <div className="col-12 col-lg-7 col-xl-8">
                            <div className="edit-role-permissions">
                                <PermissionMatrix />
                            </div>
                        </div>

                        {/* Assign Personnel */}

                        <div className="col-12 col-lg-5 col-xl-4">
                            <div className="edit-role-personnel">
                                <AssignPersonnel />
                            </div>
                        </div>

                    </div>

                </div>

            </section>

        </>

    );

};


export default EditRole;