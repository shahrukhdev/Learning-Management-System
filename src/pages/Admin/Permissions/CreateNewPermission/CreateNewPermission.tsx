import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import SEO from "../../../../components/Seo/SEO";
import PermissionInformation, {
    type PermissionFormData,
} from "../../../../components/Permissions/PermissionInformation";
import "../../Roles/CreateNewRole/CreateNewRole.css";

const CreateNewPermission = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState<PermissionFormData>({
        name: "",
        description: "",
    });

    const handleChange = (field: keyof PermissionFormData, value: string) => {
        setFormData((current) => ({ ...current, [field]: value }));
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        console.log("Permission Data:", formData);
    };

    return (
        <>
            <SEO
                title="Create New Permission - Madrasah Portal"
                description="Create a new permission in the Madrasah Portal"
            />
            <section className="admin create-role-section">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-12">
                            <div className="create-role-page-header">
                                <Link
                                    to="/admin/dashboard/system/permissions"
                                    className="role-back-btn"
                                    aria-label="Back to permissions"
                                >
                                    <ArrowLeft size={25} strokeWidth={2.2} />
                                </Link>
                                <div className="create-role-head">
                                    <h1 className="section-title">Create New Permission</h1>
                                    <p className="section-desc-para m-0">
                                        Define access for a specific area of the Madrasah portal.
                                    </p>
                                </div>
                            </div>
                            <form onSubmit={handleSubmit}>
                                <PermissionInformation
                                    formData={formData}
                                    onChange={handleChange}
                                />
                                <div className="create-role-form-actions">
                                    <div className="form-actions">
                                        <button
                                            type="button"
                                            className="form-btn form-btn-cancel"
                                            onClick={() =>
                                                navigate("/admin/dashboard/system/permissions")
                                            }
                                        >
                                            Cancel
                                        </button>
                                        <button type="submit" className="form-btn form-btn-primary">
                                            Create Permission
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

export default CreateNewPermission;
