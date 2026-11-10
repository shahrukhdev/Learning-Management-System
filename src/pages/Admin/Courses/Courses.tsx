import { CirclePlus } from "lucide-react";
import { Link } from "react-router-dom";
import SEO from "../../../components/Seo/SEO";
import CoursesTable from "../../../components/Courses/CoursesTable";
import "../AdminList.css";
import "../Roles/Roles.css";

const Courses = () => (
    <>
        <SEO
            title="Courses Management | Noor Ul Imaan Masjid"
            description="Create and manage courses across the Madrasah portal."
        />
        <section className="admin-list-section">
            <div className="container-fluid">
                <div className="row">
                    <div className="col-12">
                        <div className="section-head">
                            <div>
                                <h1 className="section-title">Manage Courses</h1>
                                <p className="section-desc-para m-0">
                                    Create and manage courses across the Madrasah portal.
                                </p>
                            </div>
                            <Link
                                to="/admin/dashboard/academic/courses/create-new"
                                className="new-notice-btn"
                            >
                                <CirclePlus color="#fff" size={20} strokeWidth={2.5} />
                                <span>Create New Course</span>
                            </Link>
                        </div>
                    </div>
                    <div className="col-12">
                        <CoursesTable />
                    </div>
                </div>
            </div>
        </section>
    </>
);

export default Courses;
