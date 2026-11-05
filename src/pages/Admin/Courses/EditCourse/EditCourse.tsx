import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import SEO from "../../../../components/Seo/SEO";
import CourseInformation, { type CourseFormData } from "../../../../components/Courses/CourseInformation";
import { courses } from "../../../../components/Courses/CoursesTable.data";
import "../../Roles/CreateNewRole/CreateNewRole.css";

const EditCourse = () => {
    const navigate = useNavigate();
    const { courseId } = useParams();
    const course = courses.find((item) => item.id === Number(courseId)) ?? courses[0];
    const [formData, setFormData] = useState<CourseFormData>({
        name: course.name,
        description: course.description,
    });

    const handleChange = (field: keyof CourseFormData, value: string) => {
        setFormData((current) => ({ ...current, [field]: value }));
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        console.log("Course Data:", formData);
    };

    return (
        <>
            <SEO title="Edit Course - Madrasah Portal" description="Edit course in the Madrasah Portal" />
            <section className="admin create-role-section">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-12">
                            <div className="create-role-page-header">
                                <Link to="/admin/dashboard/academic/courses" className="role-back-btn" aria-label="Back to courses">
                                    <ArrowLeft size={25} strokeWidth={2.2} />
                                </Link>
                                <div className="create-role-head">
                                    <h1 className="section-title">Edit Course</h1>
                                    <p className="section-desc-para m-0">Update this course's name and description.</p>
                                </div>
                            </div>
                            <form onSubmit={handleSubmit}>
                                <CourseInformation formData={formData} onChange={handleChange} />
                                <div className="create-role-form-actions">
                                    <div className="form-actions">
                                        <button type="button" className="form-btn form-btn-cancel" onClick={() => navigate("/admin/dashboard/academic/courses")}>Discard Changes</button>
                                        <button type="submit" className="form-btn form-btn-primary">Save Course</button>
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

export default EditCourse;
