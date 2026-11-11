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
    EMPTY_PERMISSION_FORM,
    PERMISSIONS_LIST_PATH,
    toPermissionFormErrors,
    validatePermissionForm,
} from "../../../../components/Permissions/permissionForm";
import { getPermission, updatePermission } from "../../../../services/permissionService";
import { parseApiError } from "../../../../utils/apiError";
import { useModules } from "../../../../hooks/useModules";
import { useAuth } from "../../../../hooks/useAuth";
import "../../Roles/CreateNewRole/CreateNewRole.css";
import "../../Roles/Roles.css";

// Edit Permission (name + module + description), at
// /system/permissions/:permissionId/edit. Same load / validate / submit
// behavior as the Edit Role page.
const EditPermission = () => {

    // Signed-in user (refreshed if a permission they have is changed)
    const { user, refreshUser } = useAuth();

    // The permission's name as loaded, before any edits
    const [originalName, setOriginalName] = useState("");

    const navigate = useNavigate();

    const { permissionId: permissionIdParam } = useParams<{ permissionId: string }>();

    const permissionId = Number(permissionIdParam);

    const isValidPermissionId = Number.isInteger(permissionId) && permissionId > 0;

    const [formData, setFormData] = useState<PermissionFormData>(EMPTY_PERMISSION_FORM);

    // Module dropdown options (GET /v1/modules, shared cached request)
    const {
        modules,
        isLoading: modulesLoading,
        error: modulesError,
        retry: retryModules,
    } = useModules();

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

                // Preselect the assigned module (module_id, or an embedded module)
                const assignedModuleId =
                    response.data.module_id ?? response.data.module?.id ?? null;

                setFormData({
                    name: response.data.name ?? "",
                    description: response.data.description ?? "",
                    module_id: assignedModuleId !== null ? String(assignedModuleId) : "",
                });

                setOriginalName(response.data.name ?? "");

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

        // Wait for the permission and modules so the module selection is set
        if (isSubmittingRef.current || isLoadingPermission || loadError || modulesLoading) return;

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
                module_id: Number(formData.module_id), // numeric ID
            });

            toast.success(response.message || "Permission updated successfully.");

            // The signed-in user has this permission (e.g. it was renamed):
            // reload their permissions so checks use the new name
            if (originalName && user?.permissions.includes(originalName)) void refreshUser();

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
                                    modules={modules}
                                    modulesLoading={modulesLoading}
                                    modulesError={modulesError}
                                    onRetryModules={retryModules}
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
                                            disabled={isSubmitting || modulesLoading}
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
