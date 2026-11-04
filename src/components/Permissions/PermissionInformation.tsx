export interface PermissionFormData {
    name: string;
    description: string;
}

// Inline validation messages (only `name` is validated/submitted for now)
export type PermissionFormErrors = Partial<Record<keyof PermissionFormData, string>>;

interface PermissionInformationProps {
    formData: PermissionFormData;
    onChange: (field: keyof PermissionFormData, value: string) => void;
    errors?: PermissionFormErrors;
}

const PermissionInformation = ({ formData, onChange, errors = {} }: PermissionInformationProps) => (

    <div className="col-12">
        <div className="create-role-card">
            <div className="create-role-card-header">
                <h2 className="create-role-card-title">Permission Information</h2>
            </div>
            <div className="create-role-card-body">
                <div className="primary-field">
                    <label htmlFor="permission-name" className="primary-label">
                        Permission Name
                    </label>
                    <input
                        id="permission-name"
                        type="text"
                        className="primary-control"
                        placeholder="e.g. Manage Students"
                        value={formData.name}
                        onChange={(event) => onChange("name", event.target.value)}
                        aria-invalid={Boolean(errors.name)}
                        required
                    />
                    {errors.name && (
                        <span className="error-text d-block">{errors.name}</span>
                    )}
                </div>
                <div className="primary-field mb-0">
                    <label htmlFor="permission-description" className="primary-label">
                        Description
                    </label>
                    {/* Optional (submitted by Edit Permission only) */}
                    <textarea
                        id="permission-description"
                        className="primary-textarea"
                        placeholder="Briefly describe this permission..."
                        value={formData.description}
                        onChange={(event) => onChange("description", event.target.value)}
                        aria-invalid={Boolean(errors.description)}
                    />
                    {errors.description && (
                        <span className="error-text d-block">{errors.description}</span>
                    )}
                </div>
            </div>
        </div>
    </div>
);

export default PermissionInformation;
