import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import SEO from "../../../../components/Seo/SEO";
import ClassInformation, {
    type ClassFormData,
} from "../../../../components/Classes/ClassInformation";
import "../../Roles/CreateNewRole/CreateNewRole.css";

const CreateNewClass = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState<ClassFormData>({
        name: "",
        description: "",
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
                title="Create New Class - Madrasah Portal"
                description="Create a new class in the Madrasah Portal"
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
                                    <h1 className="section-title">Create New Class</h1>
                                    <p className="section-desc-para m-0">
                                        Add a new class to the Madrasah portal.
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
                                            Cancel
                                        </button>
                                        <button type="submit" className="form-btn form-btn-primary">
                                            Create Class
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

export default CreateNewClass;
