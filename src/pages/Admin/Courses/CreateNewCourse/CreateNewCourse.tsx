import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import SEO from "../../../../components/Seo/SEO";
import CourseInformation, { type CourseFormData } from "../../../../components/Courses/CourseInformation";
import "../../Roles/CreateNewRole/CreateNewRole.css";

const CreateNewCourse = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState<CourseFormData>({ name: "", description: "" });

    const handleChange = (field: keyof CourseFormData, value: string) => {
        setFormData((current) => ({ ...current, [field]: value }));
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        console.log("Course Data:", formData);
    };

    return (
        <>
            <SEO title="Create New Course - Madrasah Portal" description="Create a new course in the Madrasah Portal" />
            <section className="admin create-role-section">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-12">
                            <div className="create-role-page-header">
                                <Link to="/admin/dashboard/academic/courses" className="role-back-btn" aria-label="Back to courses">
                                    <ArrowLeft size={25} strokeWidth={2.2} />
                                </Link>
                                <div className="create-role-head">
                                    <h1 className="section-title">Create New Course</h1>
                                    <p className="section-desc-para m-0">Add a new course to the Madrasah portal.</p>
                                </div>
                            </div>
                            <form onSubmit={handleSubmit}>
                                <CourseInformation formData={formData} onChange={handleChange} />
                                <div className="create-role-form-actions">
                                    <div className="form-actions">
                                        <button type="button" className="form-btn form-btn-cancel" onClick={() => navigate("/admin/dashboard/academic/courses")}>Cancel</button>
                                        <button type="submit" className="form-btn form-btn-primary">Create Course</button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default CreateNewCourse;
