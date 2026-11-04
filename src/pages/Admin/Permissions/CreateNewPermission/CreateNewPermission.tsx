import { useRef, useState } from "react";
import type { FormEvent } from "react";
import { ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import SEO from "../../../../components/Seo/SEO";
import PermissionInformation, {
    type PermissionFormData,
    type PermissionFormErrors,
} from "../../../../components/Permissions/PermissionInformation";
import { createPermission } from "../../../../services/permissionService";
import { getFirstFieldErrors, parseApiError } from "../../../../utils/apiError";
import "../../Roles/CreateNewRole/CreateNewRole.css";

const PERMISSIONS_LIST_PATH = "/system/permissions";

const MAX_PERMISSION_NAME_LENGTH = 255;

// Client-side rules (mirror the backend): name required, string, max 255.
// Description is optional and not validated or submitted.
const validatePermissionForm = (data: PermissionFormData): PermissionFormErrors => {
    const errors: PermissionFormErrors = {};

    const name = data.name.trim();

    if (!name) {
        errors.name = "The permission name field is required.";
    } else if (name.length > MAX_PERMISSION_NAME_LENGTH) {
        errors.name = `The permission name must not be greater than ${MAX_PERMISSION_NAME_LENGTH} characters.`;
    }

    return errors;
};

const CreateNewPermission = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState<PermissionFormData>({
        name: "",
        description: "",
    });

    const [errors, setErrors] = useState<PermissionFormErrors>({});

    const [isSubmitting, setIsSubmitting] = useState(false);

    // Synchronous guard against double submits
    const isSubmittingRef = useRef(false);

    const handleChange = (field: keyof PermissionFormData, value: string) => {
        setFormData((current) => ({ ...current, [field]: value }));

        // Clear this field's error once it is edited
        setErrors((current) =>
            current[field] ? { ...current, [field]: undefined } : current
        );
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (isSubmittingRef.current) return;

        const clientErrors = validatePermissionForm(formData);

        if (Object.keys(clientErrors).length > 0) {
            setErrors(clientErrors);
            return;
        }

        isSubmittingRef.current = true;
        setIsSubmitting(true);
        setErrors({});

        try {
            // Only `name` is sent; description is intentionally omitted
            const response = await createPermission({
                name: formData.name.trim(),
            });

            toast.success(response.message || "Permission created successfully.");

            // The Permissions listing mounts fresh and fetches
            // GET /v1/permissions again, so the new permission is shown
            navigate(PERMISSIONS_LIST_PATH);
        } catch (error) {
            const { status, message, validationErrors } = parseApiError(error);

            if (status === 401) return; // handled globally

            if (status === 422 && validationErrors) {
                const nameError =
                    getFirstFieldErrors<keyof PermissionFormData>(validationErrors).name;

                if (nameError) {
                    setErrors({ name: nameError });
                } else {
                    // Nothing that belongs to a field on this form
                    toast.error(message);
                }
            } else {
                toast.error(message);
            }
        } finally {
            isSubmittingRef.current = false;
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <SEO
                title="Create Permission - Noor Ul Imaan Masjid"
                description="Create a permission in the Noor Ul Imaan Masjid Madrassah Portal."
            />
            <section className="admin create-role-section">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-12">
                            <div className="create-role-page-header">
                                <Link
                                    to={PERMISSIONS_LIST_PATH}
                                    className="role-back-btn"
                                    aria-label="Back to permissions"
                                >
                                    <ArrowLeft size={25} strokeWidth={2.2} />
                                </Link>
                                <div className="create-role-head">
                                    <h1 className="section-title">Create Permission</h1>
                                    <p className="section-desc-para m-0">
                                        Define access for a specific area of the Madrasah portal.
                                    </p>
                                </div>
                            </div>
                            <form onSubmit={handleSubmit} noValidate>
                                <PermissionInformation
                                    formData={formData}
                                    onChange={handleChange}
                                    errors={errors}
                                />
                                <div className="create-role-form-actions">
                                    <div className="form-actions">
                                        <button
                                            type="button"
                                            className="form-btn form-btn-cancel"
                                            onClick={() =>
                                                navigate(PERMISSIONS_LIST_PATH)
                                            }
                                            disabled={isSubmitting}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="form-btn form-btn-primary"
                                            disabled={isSubmitting}
                                            aria-busy={isSubmitting}
                                        >
                                            {isSubmitting ? "Creating..." : "Create Permission"}
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
