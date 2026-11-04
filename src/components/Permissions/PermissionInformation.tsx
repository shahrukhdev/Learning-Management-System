import type { ModuleItem } from "../../types/module.types";

export interface PermissionFormData {
    name: string;
    description: string;
    // Selected module ID as the <select> value ("" = none); sent as a number
    module_id: string;
}

// Inline validation messages
export type PermissionFormErrors = Partial<Record<keyof PermissionFormData, string>>;

interface PermissionInformationProps {
    formData: PermissionFormData;
    onChange: (field: keyof PermissionFormData, value: string) => void;
    errors?: PermissionFormErrors;
    // Module dropdown options (from GET /v1/modules)
    modules: ModuleItem[];
    modulesLoading?: boolean;
    modulesError?: string | null;
    onRetryModules?: () => void;
}

const PermissionInformation = ({
    formData,
    onChange,
    errors = {},
    modules,
    modulesLoading = false,
    modulesError = null,
    onRetryModules,
}: PermissionInformationProps) => (

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
                <div className="primary-field">
                    <label htmlFor="permission-module" className="primary-label">
                        Module
                    </label>
                    <select
                        id="permission-module"
                        className="primary-select"
                        value={formData.module_id}
                        onChange={(event) => onChange("module_id", event.target.value)}
                        disabled={modulesLoading}
                        aria-invalid={Boolean(errors.module_id)}
                        required
                    >
                        <option value="">
                            {modulesLoading
                                ? "Loading modules..."
                                : modules.length > 0
                                    ? "Select module"
                                    : "No modules available"}
                        </option>
                        {modules.map((module) => (
                            <option key={module.id} value={String(module.id)}>
                                {module.name}
                            </option>
                        ))}
                    </select>
                    {errors.module_id && (
                        <span className="error-text d-block">{errors.module_id}</span>
                    )}
                    {modulesError && (
                        <span className="error-text d-block">
                            {modulesError}{" "}
                            {onRetryModules && (
                                <button
                                    type="button"
                                    className="btn btn-link p-0 align-baseline"
                                    onClick={onRetryModules}
                                >
                                    Try again
                                </button>
                            )}
                        </span>
                    )}
                </div>
                <div className="primary-field mb-0">
                    <label htmlFor="permission-description" className="primary-label">
                        Description
                    </label>
                    {/* Optional */}
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
