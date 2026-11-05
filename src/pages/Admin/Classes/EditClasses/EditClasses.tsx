import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import SEO from "../../../../components/Seo/SEO";
import ClassInformation, { type ClassFormData } from "../../../../components/Classes/ClassInformation";
import { classes } from "../../../../components/Classes/ClassesTable.data";
import "../../Roles/CreateNewRole/CreateNewRole.css";
import "../../Roles/Roles.css";

const EditClass = () => {

    const navigate = useNavigate();
    const { classId } = useParams();
    const classItem = classes.find((item) => item.id === Number(classId)) ?? classes[0];
    const [formData, setFormData] = useState<ClassFormData>({
        name: classItem.name,
        description: classItem.description,
    });

    const handleChange = (field: keyof ClassFormData, value: string) => {
        setFormData((current) => ({ ...current, [field]: value }));
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        console.log("Class Data:", formData);
    };

    return (
        <>
            <SEO
                title="Edit Class - Madrasah Portal"
                description="Edit class in the Madrasah Portal"
            />
            <section className="admin create-role-section">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-12">
                            <div className="create-role-page-header">
                                <Link
                                    to="/admin/dashboard/academic/classes"
                                    className="role-back-btn"
                                    aria-label="Back to classes"
                                >
                                    <ArrowLeft size={25} strokeWidth={2.2} />
                                </Link>
                                <div className="create-role-head">
                                    <h1 className="section-title">Edit Class</h1>
                                    <p className="section-desc-para m-0">
                                        Update this class's name and description.
                                    </p>
                                </div>
                            </div>
                            <form onSubmit={handleSubmit}>
                                <ClassInformation
                                    formData={formData}
                                    onChange={handleChange}
                                />
                                <div className="create-role-form-actions">
                                    <div className="form-actions">
                                        <button
                                            type="button"
                                            className="form-btn form-btn-cancel"
                                            onClick={() =>
                                                navigate("/admin/dashboard/academic/classes")
                                            }
                                        >
                                            Discard Changes
                                        </button>
                                        <button type="submit" className="form-btn form-btn-primary">
                                            Save Class
                                        </button>
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

export default EditClass;
