import { useRef, useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { toast } from "react-toastify";

import SEO from "../../../../components/Seo/SEO";

import RoleInformation from "../../../../components/Roles/CreateRole/RoleInformation";
import RolePermissionMatrix from "../../../../components/Roles/EditRole/PermissionMatrix/RolePermissionMatrix";

import type { RoleFormData, RoleFormErrors } from "../../../../components/Roles/CreateRole/CreateRole.types";
import {
    EMPTY_ROLE_FORM,
    ROLES_LIST_PATH,
    toPermissionsError,
    toRoleFormErrors,
    validateRoleForm,
} from "../../../../components/Roles/CreateRole/roleForm";

import { createRole } from "../../../../services/roleService";
import { parseApiError } from "../../../../utils/apiError";
import { useAllPermissions } from "../../../../hooks/useAllPermissions";

import "./CreateNewRole.css";
import { usePermittedPath } from "../../../../hooks/usePermittedPath";
import { PERMISSIONS } from "../../../../utils/permissions";


const CreateNewRole = () => {

    // Back to the list, or the home page without "View Roles"
    const rolesListPath = usePermittedPath(ROLES_LIST_PATH, PERMISSIONS.VIEW_ROLES);

    const navigate = useNavigate();

    const [formData, setFormData] = useState<RoleFormData>(EMPTY_ROLE_FORM);

    const [errors, setErrors] = useState<RoleFormErrors>({});

    const [isSubmitting, setIsSubmitting] = useState(false);

    // Synchronous guard against double submits
    const isSubmittingRef = useRef(false);


    /* Permissions (GET /v1/permissions, all pages, shared) */

    const allPermissions = useAllPermissions();

    // Selected permission IDs (sent as `permissions`)
    const [selectedPermissionIds, setSelectedPermissionIds] = useState<number[]>([]);

    const [permissionsError, setPermissionsError] = useState<string | null>(null);

    // Not submittable until every permission has loaded
    const permissionsReady = !allPermissions.isLoading && !allPermissions.error;

    const handlePermissionsChange = (ids: number[]) => {
        setSelectedPermissionIds(ids);
        setPermissionsError(null);
    };


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


    /* Create Role */

    const handleCreateRole = async (
        event: FormEvent<HTMLFormElement>
    ) => {

        event.preventDefault();

        if (isSubmittingRef.current) return;

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

            const description = formData.description.trim();

            const response = await createRole({
                name: formData.name.trim(),
                ...(description ? { description } : {}),
                // Permission IDs (an empty selection is sent as [])
                permissions: [...new Set(selectedPermissionIds)],
            });

            toast.success(response.message || "Role created successfully.");

            // The Roles listing mounts fresh and fetches GET /v1/roles again,
            // so the new role is shown without stale data
            navigate(rolesListPath);

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
        navigate(rolesListPath);

    };


    return (

        <>

            <SEO
                title="Create Role - Noor Ul Imaan Masjid"
                description="Create a role in the Noor Ul Imaan Masjid Madrassah Portal."
            />


            <section className="create-role-section">

                <div className="container-fluid">

                    <div className="row">

                        <div className="col-12">

                            {/* Page Header */}

                            <div className="create-role-page-header">

                                <Link 
                                    to={rolesListPath}
                                    className="role-back-btn"
                                >
                                    <ArrowLeft
                                        size={25}
                                        strokeWidth={2.2}
                                    />
                                </Link>


                                <div className="create-role-head">

                                    <h1 className="section-title">
                                        Create Role
                                    </h1>

                                    <p className="section-desc-para m-0">
                                        Define responsibilities and access levels for staff members.
                                    </p>

                                </div>

                            </div>


                            {/* Form */}

                            <form
                                onSubmit={
                                    handleCreateRole
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
                                            {isSubmitting ? "Creating..." : "Create Role"}
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


export default CreateNewRole;