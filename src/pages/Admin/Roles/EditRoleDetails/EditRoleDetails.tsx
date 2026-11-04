import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { toast } from "react-toastify";

import SEO from "../../../../components/Seo/SEO";

import RoleInformation from "../../../../components/Roles/CreateRole/RoleInformation";
import RolePermissions from "../../../../components/Roles/CreateRole/RolePermissions";

import type { RoleFormData, RoleFormErrors, RolePermission } from "../../../../components/Roles/CreateRole/CreateRole.types";
import {
    EMPTY_ROLE_FORM,
    INITIAL_PERMISSIONS,
    ROLES_LIST_PATH,
    toRoleFormErrors,
    validateRoleForm,
} from "../../../../components/Roles/CreateRole/roleForm";

import { getRole, updateRole } from "../../../../services/roleService";
import { parseApiError } from "../../../../utils/apiError";

// Same layout and styles as the Add Role page
import "../CreateNewRole/CreateNewRole.css";


// Edit Role (name + description). Separate from the permission matrix screen
// at /system/roles/:roleId/edit, which is unchanged.
const EditRoleDetails = () => {

    const navigate = useNavigate();

    const { roleId: roleIdParam } = useParams<{ roleId: string }>();

    const roleId = Number(roleIdParam);

    const isValidRoleId = Number.isInteger(roleId) && roleId > 0;

    const [formData, setFormData] = useState<RoleFormData>(EMPTY_ROLE_FORM);

    const [errors, setErrors] = useState<RoleFormErrors>({});

    const [isSubmitting, setIsSubmitting] = useState(false);

    // Synchronous guard against double submits
    const isSubmittingRef = useRef(false);

    // Static for now: toggles stay local and are not submitted
    const [permissions, setPermissions] = useState<RolePermission[]>( INITIAL_PERMISSIONS );


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

    /* Permission Toggle (static, same as Add Role) */

    const handlePermissionToggle = (id: string) => {

        setPermissions((previous) =>
            previous.map((permission) =>
                permission.id === id
                    ? {
                        ...permission,
                        enabled: !permission.enabled,
                    }
                    : permission
            )
        );

    };


    /* Update Role (PUT /v1/roles/{id}) */

    const handleUpdateRole = async (
        event: FormEvent<HTMLFormElement>
    ) => {

        event.preventDefault();

        if (isSubmittingRef.current || isLoadingRole || loadError) return;

        const clientErrors = validateRoleForm(formData);

        if (Object.keys(clientErrors).length > 0) {
            setErrors(clientErrors);
            return;
        }

        isSubmittingRef.current = true;
        setIsSubmitting(true);
        setErrors({});

        try {

            // Only name + description; permissions are not sent yet
            const response = await updateRole(roleId, {
                name: formData.name.trim(),
                description: formData.description.trim(),
            });

            toast.success(response.message || "Role updated successfully.");

            // The Roles listing mounts fresh and fetches GET /v1/roles again
            navigate(ROLES_LIST_PATH);

        } catch (error) {

            const { status, message, validationErrors } = parseApiError(error);

            if (status === 401) return; // handled globally

            if (status === 422 && validationErrors) {

                const inlineErrors = toRoleFormErrors(validationErrors);

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


    /* Cancel */

    const handleCancel = () => {
        navigate(
            ROLES_LIST_PATH
        );

    };


    return (

        <>

            <SEO
                title="Edit Role - Madrasah Portal"
                description="Edit a role in the Madrasah Portal"
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


                                {/* Permissions (static, unchanged) */}

                                <RolePermissions
                                    permissions={
                                        permissions
                                    }
                                    onToggle={
                                        handlePermissionToggle
                                    }
                                />


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
                                                isSubmitting
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
