import type { RoleFormData } from "./CreateRole.types";


interface RoleInformationProps {
    formData: RoleFormData;
    onChange: (
        field: keyof RoleFormData,
        value: string
    ) => void;
}


const RoleInformation = ({
    formData,
    onChange,
}: RoleInformationProps) => {

    return (

        <div className="col-12">

            <div className="create-role-card">

                {/* Card Header */}

                <div className="create-role-card-header">

                    <h2 className="create-role-card-title">
                        Role Information
                    </h2>

                </div>


                {/* Form Fields */}

                <div className="create-role-card-body">

                    {/* Role Name */}

                    <div className="primary-field">

                        <label
                            htmlFor="role-name"
                            className="primary-label"
                        >
                            Role Name
                        </label>

                        <input
                            id="role-name"
                            type="text"
                            className="primary-control"
                            placeholder="e.g. Senior Teacher, Registrar"
                            value={formData.name}
                            onChange={(e) =>
                                onChange(
                                    "name",
                                    e.target.value
                                )
                            }
                        />

                    </div>


                    {/* Description */}

                    <div className="primary-field mb-0">

                        <label
                            htmlFor="role-description"
                            className="primary-label"
                        >
                            Description
                        </label>

                        <textarea
                            id="role-description"
                            className="primary-textarea"
                            placeholder="Briefly describe the responsibilities..."
                            value={formData.description}
                            onChange={(e) =>
                                onChange(
                                    "description",
                                    e.target.value
                                )
                            }
                        />

                    </div>

                </div>

            </div>

        </div>

    );

};


export default RoleInformation;