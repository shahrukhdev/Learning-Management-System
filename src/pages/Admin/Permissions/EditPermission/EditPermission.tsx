import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import SEO from "../../../../components/Seo/SEO";
import PermissionInformation, { type PermissionFormData } from "../../../../components/Permissions/PermissionInformation";
import { permissions } from "../../../../components/Permissions/PermissionsTable.data";
import "../../Roles/CreateNewRole/CreateNewRole.css";
import "../../Roles/Roles.css";

const EditPermission = () => {

    const navigate = useNavigate();
    const { permissionId } = useParams();
    const permission = permissions.find((item) => item.id === Number(permissionId)) ?? permissions[0];
    const [formData, setFormData] = useState<PermissionFormData>({
        name: permission.name,
        description: permission.description,
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
                title="Edit Permission - Madrasah Portal"
                description="Edit permission in the Madrasah Portal"
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
                                    <h1 className="section-title">Edit Permission</h1>
                                    <p className="section-desc-para m-0">
                                        Update this permission's name and description.
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
                                            Discard Changes
                                        </button>
                                        <button type="submit" className="form-btn form-btn-primary">
                                            Save Permission
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

export default EditPermission;
