import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { toast } from "react-toastify";

import SEO from "../../../../components/Seo/SEO";

import RoleInformation from "../../../../components/Roles/CreateRole/RoleInformation";
import RolePermissionMatrix from "../../../../components/Roles/EditRole/PermissionMatrix/RolePermissionMatrix";
import { toRolePermissionIds } from "../../../../components/Roles/EditRole/PermissionMatrix/rolePermissions";

import type { RoleFormData, RoleFormErrors } from "../../../../components/Roles/CreateRole/CreateRole.types";
import {
    EMPTY_ROLE_FORM,
    ROLES_LIST_PATH,
    toPermissionsError,
    toRoleFormErrors,
    validateRoleForm,
} from "../../../../components/Roles/CreateRole/roleForm";

import { getRole, updateRole } from "../../../../services/roleService";
import { parseApiError } from "../../../../utils/apiError";
import { useAuth } from "../../../../hooks/useAuth";
import { useAllPermissions } from "../../../../hooks/useAllPermissions";

// Same layout and styles as the Add Role page
import "../CreateNewRole/CreateNewRole.css";


// Edit Role (name + description), at /system/roles/:roleId/edit. Separate from
// the permission matrix screen, now at /system/roles/:roleId/permissions.
const EditRoleDetails = () => {

    const navigate = useNavigate();

    // Signed-in user (Header/Sidebar show user.role from here)
    const { user, setUser } = useAuth();

    const { roleId: roleIdParam } = useParams<{ roleId: string }>();

    // The role's name as loaded, before any edits (to detect whether the
    // signed-in user has this role)
    const [originalName, setOriginalName] = useState("");

    const roleId = Number(roleIdParam);

    const isValidRoleId = Number.isInteger(roleId) && roleId > 0;

    const [formData, setFormData] = useState<RoleFormData>(EMPTY_ROLE_FORM);

    const [errors, setErrors] = useState<RoleFormErrors>({});

    const [isSubmitting, setIsSubmitting] = useState(false);

    // Synchronous guard against double submits
    const isSubmittingRef = useRef(false);

    /* Permissions (GET /v1/permissions, all pages, shared). Loaded
       separately from the role. */

    const allPermissions = useAllPermissions();

    // The role's assigned permissions as returned by GET /v1/roles/{id}
    const [rolePermissions, setRolePermissions] = useState<unknown[]>([]);

    // The user's selection; null = untouched (use the role's assignments).
    // Deriving the initial selection means a late response can never
    // overwrite changes the user has made.
    const [editedPermissionIds, setEditedPermissionIds] = useState<number[] | null>(null);

    const selectedPermissionIds =
        editedPermissionIds ?? toRolePermissionIds(rolePermissions, allPermissions.permissions);

    const [permissionsError, setPermissionsError] = useState<string | null>(null);

    const permissionsReady = !allPermissions.isLoading && !allPermissions.error;

    const handlePermissionsChange = (ids: number[]) => {
        setEditedPermissionIds(ids);
        setPermissionsError(null);
    };


    /* Load the role (GET /v1/roles/{id}) */

    const [loadToken, setLoadToken] = useState(0);

    // Which role (and attempt) the form was loaded for
    const [loadState, setLoadState] = useState<{ key: string; error: string | null } | null>(null);

    const loadKey = `${roleId}|${loadToken}`;

    const isLoadingRole = isValidRoleId && loadState?.key !== loadKey;

    const loadError = !isValidRoleId
        ? "This role could not be found."
        : loadState?.key === loadKey
            ? loadState.error
            : null;

    useEffect(() => {

        if (!isValidRoleId) return;

        const controller = new AbortController();

        getRole(roleId, controller.signal)
            .then((response) => {

                if (controller.signal.aborted) return;

                setFormData({
                    name: response.data.name ?? "",
                    description: response.data.description ?? "",
                });

                setOriginalName(response.data.name ?? "");

                // Preselect the role's permissions (matched by ID)
                setRolePermissions(Array.isArray(response.data.permissions) ? response.data.permissions : []);

                setEditedPermissionIds(null);

                setErrors({});

                setLoadState({ key: loadKey, error: null });

            })
            .catch((error: unknown) => {

                if (controller.signal.aborted) return;

                const { message } = parseApiError(error);

                setLoadState({ key: loadKey, error: message });

            });

        return () => controller.abort();

    }, [roleId, isValidRoleId, loadKey]);


    /* Form Change */

    const handleFormChange = ( field: keyof RoleFormData, value: string ) => {

        setFormData((previous) => ({
            ...previous,
            [field]: value,
        }));

        // Clear this field's error once it is edited
        setErrors((previous) =>
            previous[field] ? { ...previous, [field]: undefined } : previous
        );

    };

    /* Update Role (PUT /v1/roles/{id}) */

    const handleUpdateRole = async (
        event: FormEvent<HTMLFormElement>
    ) => {

        event.preventDefault();

        if (isSubmittingRef.current || isLoadingRole || loadError) return;

        if (!permissionsReady) {
            toast.error("Permissions have not loaded yet. Please wait or try again.");
            return;
        }

        const clientErrors = validateRoleForm(formData);

        if (Object.keys(clientErrors).length > 0) {
            setErrors(clientErrors);
            return;
        }

        isSubmittingRef.current = true;
        setIsSubmitting(true);
        setErrors({});
        setPermissionsError(null);

        try {

            const response = await updateRole(roleId, {
                name: formData.name.trim(),
                description: formData.description.trim(),
                // The complete selection, so removed permissions are synced too
                permissions: [...new Set(selectedPermissionIds)],
            });

            toast.success(response.message || "Role updated successfully.");

            // If the signed-in user has this role, update their role name in
            // AuthContext (also persisted) so the Header, Sidebar and anything
            // else reading user.role show the new name without re-login.
            // AuthContext keeps the role by name, so match the pre-edit name.
            const savedName = (response.data?.name ?? formData.name).trim();

            if (
                user &&
                originalName &&
                user.role.trim().toLowerCase() === originalName.trim().toLowerCase() &&
                user.role !== savedName
            ) {
                setUser({ ...user, role: savedName });
            }

            // The Roles listing mounts fresh and fetches GET /v1/roles again
            navigate(ROLES_LIST_PATH);

        } catch (error) {

            const { status, message, validationErrors } = parseApiError(error);

            if (status === 401) return; // handled globally

            if (status === 422 && validationErrors) {

                const inlineErrors = toRoleFormErrors(validationErrors);

                const matrixError = toPermissionsError(validationErrors);

                setErrors(inlineErrors);
                setPermissionsError(matrixError);

                // Only toast if nothing could be shown inline
                if (Object.keys(inlineErrors).length === 0 && !matrixError) {
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


    /* Cancel */

    const handleCancel = () => {
        navigate(
            ROLES_LIST_PATH
        );

    };


    return (

        <>

            <SEO
                title="Edit Role - Noor Ul Imaan Masjid"
                description="Edit a role in the Noor Ul Imaan Masjid Madrassah Portal."
            />


            <section className="create-role-section">

                <div className="container-fluid">

                    <div className="row">

                        <div className="col-12">

                            {/* Page Header */}

                            <div className="create-role-page-header">

                                <Link
                                    to={ROLES_LIST_PATH}
                                    className="role-back-btn"
                                >
                                    <ArrowLeft
                                        size={25}
                                        strokeWidth={2.2}
                                    />
                                </Link>


                                <div className="create-role-head">

                                    <h1 className="section-title">
                                        Edit Role
                                    </h1>

                                    <p className="section-desc-para m-0">
                                        Define responsibilities and access levels for staff members.
                                    </p>

                                </div>

                            </div>


                            {isLoadingRole ? (

                                /* Loading */

                                <div className="create-role-card">
                                    <div className="create-role-card-body d-flex justify-content-center align-items-center gap-2 py-5" role="status">
                                        <span className="spinner-border spinner-border-sm" aria-hidden="true"></span>
                                        <span>Loading role...</span>
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
                                                onClick={handleCancel}
                                            >
                                                Back to Roles
                                            </button>

                                            {isValidRoleId && (
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

                            /* Form */

                            <form
                                onSubmit={
                                    handleUpdateRole
                                }
                                noValidate
                            >

                                {/* Role Information */}

                                <RoleInformation
                                    formData={
                                        formData
                                    }
                                    onChange={
                                        handleFormChange
                                    }
                                    errors={
                                        errors
                                    }
                                />


                                {/* Permissions (Permission Matrix, all permissions by module) */}

                                <div className="col-12">

                                    {permissionsError && (
                                        <span className="error-text d-block mb-2" role="alert">
                                            {permissionsError}
                                        </span>
                                    )}

                                    <RolePermissionMatrix
                                        permissions={allPermissions.permissions}
                                        isLoading={allPermissions.isLoading}
                                        error={allPermissions.error}
                                        onRetry={allPermissions.retry}
                                        selectedIds={selectedPermissionIds}
                                        onChange={handlePermissionsChange}
                                        disabled={isSubmitting}
                                    />

                                </div>


                                {/* Actions */}

                                <div className="create-role-form-actions">

                                    <div className="form-actions">

                                        <button
                                            type="button"
                                            className="form-btn form-btn-cancel"
                                            onClick={
                                                handleCancel
                                            }
                                            disabled={
                                                isSubmitting
                                            }
                                        >
                                            Cancel
                                        </button>


                                        <button
                                            type="submit"
                                            className="form-btn form-btn-primary"
                                            disabled={
                                                isSubmitting || !permissionsReady
                                            }
                                            aria-busy={
                                                isSubmitting
                                            }
                                        >
                                            {isSubmitting ? "Saving..." : "Save Changes"}
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


export default EditRoleDetails;
