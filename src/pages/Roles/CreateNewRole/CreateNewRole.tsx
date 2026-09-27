import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import SEO from "../../../components/Seo/SEO";

import RoleInformation from "../../../components/Roles/CreateRole/RoleInformation";
import RolePermissions from "../../../components/Roles/CreateRole/RolePermissions";

import type { RoleFormData, RolePermission } from "../../../components/Roles/CreateRole/CreateRole.types";

import "./CreateNewRole.css";


const initialFormData: RoleFormData = {
    name: "",
    description: "",
};


const initialPermissions: RolePermission[] = [

    {
        id: "academics",
        title: "Academics",
        description: "Manage classes, syllabi, and academic calendars.",
        enabled: false,
    },
    {
        id: "students",
        title: "Students",
        description: "View profiles, attendance, and disciplinary records.",
        enabled: true,
    },
    {
        id: "finance",
        title: "Finance",
        description: "Access fee collection, payroll, and budget reports.",
        enabled: false,
    },
    {
        id: "communication",
        title: "Communication",
        description: "Send announcements to parents and staff.",
        enabled: true,
    },

];


const CreateNewRole = () => {

    const navigate = useNavigate();

    const [formData, setFormData] = useState<RoleFormData>(initialFormData);


    const [permissions, setPermissions] = useState<RolePermission[]>( initialPermissions );

    /* Form Change */

    const handleFormChange = ( field: keyof RoleFormData, value: string ) => {

        setFormData((previous) => ({
            ...previous,
            [field]: value,
        }));

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

    const handleCreateRole = (
        event: React.FormEvent<HTMLFormElement>
    ) => {

        event.preventDefault();

        const roleData = {
            ...formData,
            permissions: permissions
                .filter(
                    (permission) =>
                        permission.enabled
                )
                .map(
                    (permission) =>
                        permission.id
                ),
        };

        console.log("Role Data:", roleData);

    };


    /* Cancel */

    const handleCancel = () => {
        navigate(
            "/dashboard/system/roles"
        );

    };


    return (

        <>

            <SEO
                title="Create New Role - Madrasah Portal"
                description="Create a new role in the Madrasah Portal"
            />


            <section className="create-role-section">

                <div className="container-fluid">

                    <div className="row">

                        <div className="col-12">

                            {/* Page Header */}

                            <div className="create-role-page-header">

                                <Link 
                                    to="/dashboard/system/roles"
                                    className="role-back-btn"
                                >
                                    <ArrowLeft
                                        size={25}
                                        strokeWidth={2.2}
                                    />
                                </Link>


                                <div className="create-role-head">

                                    <h1 className="section-title">
                                        Create New Role
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
                            >

                                {/* Role Information */}

                                <RoleInformation
                                    formData={
                                        formData
                                    }
                                    onChange={
                                        handleFormChange
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
                                        >
                                            Cancel
                                        </button>


                                        <button
                                            type="submit"
                                            className="form-btn form-btn-primary"
                                        >
                                            Create Role
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