import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { ArrowLeft } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import SEO from "../../../../components/Seo/SEO";
import PermissionInformation, {
    type PermissionFormData,
    type PermissionFormErrors,
} from "../../../../components/Permissions/PermissionInformation";
import {
    PERMISSIONS_LIST_PATH,
    toPermissionFormErrors,
    validatePermissionForm,
} from "../../../../components/Permissions/permissionForm";
import { getPermission, updatePermission } from "../../../../services/permissionService";
import { parseApiError } from "../../../../utils/apiError";
import "../../Roles/CreateNewRole/CreateNewRole.css";
import "../../Roles/Roles.css";

// Edit Permission (name + description), at /system/permissions/:permissionId/edit.
// Same load / validate / submit behavior as the Edit Role page.
const EditPermission = () => {

    const navigate = useNavigate();

    const { permissionId: permissionIdParam } = useParams<{ permissionId: string }>();

    const permissionId = Number(permissionIdParam);

    const isValidPermissionId = Number.isInteger(permissionId) && permissionId > 0;

    const [formData, setFormData] = useState<PermissionFormData>({
        name: "",
        description: "",
    });

    const [errors, setErrors] = useState<PermissionFormErrors>({});

    const [isSubmitting, setIsSubmitting] = useState(false);

    // Synchronous guard against double submits
    const isSubmittingRef = useRef(false);


    /* Load the permission (GET /v1/permissions/{id}) */

    const [loadToken, setLoadToken] = useState(0);

    // Which permission (and attempt) the form was loaded for
    const [loadState, setLoadState] = useState<{ key: string; error: string | null } | null>(null);

    const loadKey = `${permissionId}|${loadToken}`;

    const isLoadingPermission = isValidPermissionId && loadState?.key !== loadKey;

    const loadError = !isValidPermissionId
        ? "This permission could not be found."
        : loadState?.key === loadKey
            ? loadState.error
            : null;

    useEffect(() => {

        if (!isValidPermissionId) return;

        const controller = new AbortController();

        getPermission(permissionId, controller.signal)
            .then((response) => {

                if (controller.signal.aborted) return;

                setFormData({
                    name: response.data.name ?? "",
                    description: response.data.description ?? "",
                });

                setErrors({});

                setLoadState({ key: loadKey, error: null });

            })
            .catch((error: unknown) => {

                if (controller.signal.aborted) return;

                const { message } = parseApiError(error);

                setLoadState({ key: loadKey, error: message });

            });

        return () => controller.abort();

    }, [permissionId, isValidPermissionId, loadKey]);


    const handleChange = (field: keyof PermissionFormData, value: string) => {
        setFormData((current) => ({ ...current, [field]: value }));

        // Clear this field's error once it is edited
        setErrors((current) =>
            current[field] ? { ...current, [field]: undefined } : current
        );
    };


    /* Update (PUT /v1/permissions/{id}) */

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (isSubmittingRef.current || isLoadingPermission || loadError) return;

        const clientErrors = validatePermissionForm(formData);

        if (Object.keys(clientErrors).length > 0) {
            setErrors(clientErrors);
            return;
        }

        isSubmittingRef.current = true;
        setIsSubmitting(true);
        setErrors({});

        try {
            const response = await updatePermission(permissionId, {
                name: formData.name.trim(),
                description: formData.description.trim(),
            });

            toast.success(response.message || "Permission updated successfully.");

            // The Permissions listing mounts fresh and fetches
            // GET /v1/permissions again
            navigate(PERMISSIONS_LIST_PATH);
        } catch (error) {
            const { status, message, validationErrors } = parseApiError(error);

            if (status === 401) return; // handled globally

            if (status === 422 && validationErrors) {
                const inlineErrors = toPermissionFormErrors(validationErrors);

                setErrors(inlineErrors);

                // Only toast if nothing could be shown inline
                if (Object.keys(inlineErrors).length === 0) {
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
                title="Edit Permission - Noor Ul Imaan Masjid"
                description="Edit a permission in the Noor Ul Imaan Masjid Madrassah Portal."
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
                                    <h1 className="section-title">Edit Permission</h1>
                                    <p className="section-desc-para m-0">
                                        Update this permission's name and description.
                                    </p>
                                </div>
                            </div>

                            {isLoadingPermission ? (

                                /* Loading */
                                <div className="create-role-card">
                                    <div className="create-role-card-body d-flex justify-content-center align-items-center gap-2 py-5" role="status">
                                        <span className="spinner-border spinner-border-sm" aria-hidden="true"></span>
                                        <span>Loading permission...</span>
                                    </div>
                                </div>

                            ) : loadError ? (

                                /* Load error */
                                <div className="create-role-card">
                                    <div className="create-role-card-body d-flex flex-column align-items-center gap-3 py-5 text-center">
                                        <p className="m-0">{loadError}</p>
                                        <div className="form-actions">
                                            <button
                                                type="button"
                                                className="form-btn form-btn-cancel"
                                                onClick={() => navigate(PERMISSIONS_LIST_PATH)}
                                            >
                                                Back to Permissions
                                            </button>
                                            {isValidPermissionId && (
                                                <button
                                                    type="button"
                                                    className="form-btn form-btn-primary"
                                                    onClick={() => setLoadToken((token) => token + 1)}
                                                >
                                                    Try Again
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>

                            ) : (

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
                                            Discard Changes
                                        </button>
                                        <button
                                            type="submit"
                                            className="form-btn form-btn-primary"
                                            disabled={isSubmitting}
                                            aria-busy={isSubmitting}
                                        >
                                            {isSubmitting ? "Saving..." : "Save Permission"}
                                        </button>
                                    </div>
                                </div>
                            </form>

                            )}
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default EditPermission;
