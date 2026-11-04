import { useRef, useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
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

import { createRole } from "../../../../services/roleService";
import { parseApiError } from "../../../../utils/apiError";

import "./CreateNewRole.css";


const CreateNewRole = () => {

    const navigate = useNavigate();

    const [formData, setFormData] = useState<RoleFormData>(EMPTY_ROLE_FORM);

    const [errors, setErrors] = useState<RoleFormErrors>({});

    const [isSubmitting, setIsSubmitting] = useState(false);

    // Synchronous guard against double submits
    const isSubmittingRef = useRef(false);


    // Static for now: toggles stay local and are not submitted
    const [permissions, setPermissions] = useState<RolePermission[]>( INITIAL_PERMISSIONS );

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

    /* Permission Toggle */

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


    /* Create Role */

    const handleCreateRole = async (
        event: FormEvent<HTMLFormElement>
    ) => {

        event.preventDefault();

        if (isSubmittingRef.current) return;

        const clientErrors = validateRoleForm(formData);

        if (Object.keys(clientErrors).length > 0) {
            setErrors(clientErrors);
            return;
        }

        isSubmittingRef.current = true;
        setIsSubmitting(true);
        setErrors({});

        try {

            // Only name + description for now; permissions are not sent yet
            const description = formData.description.trim();

            const response = await createRole({
                name: formData.name.trim(),
                ...(description ? { description } : {}),
            });

            toast.success(response.message || "Role created successfully.");

            // The Roles listing mounts fresh and fetches GET /v1/roles again,
            // so the new role is shown without stale data
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
                                    to="/system/roles"
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


                                {/* Permissions */}

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