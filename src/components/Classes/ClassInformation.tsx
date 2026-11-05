export interface ClassFormData {
    name: string;
    description: string;
}

interface ClassInformationProps {
    formData: ClassFormData;
    onChange: (field: keyof ClassFormData, value: string) => void;
}

const ClassInformation = ({ formData, onChange }: ClassInformationProps) => (
    <div className="col-12">
        <div className="create-role-card">
            <div className="create-role-card-header">
                <h2 className="create-role-card-title">Class Information</h2>
            </div>
            <div className="create-role-card-body">
                <div className="primary-field">
                    <label htmlFor="class-name" className="primary-label">
                        Class Name
                    </label>
                    <input
                        id="class-name"
                        type="text"
                        className="primary-control"
                        placeholder="e.g. Beginner Quran"
                        value={formData.name}
                        onChange={(event) => onChange("name", event.target.value)}
                        required
                    />
                </div>
                <div className="primary-field mb-0">
                    <label htmlFor="class-description" className="primary-label">
                        Description
                    </label>
                    <textarea
                        id="class-description"
                        className="primary-textarea"
                        placeholder="Briefly describe this class..."
                        value={formData.description}
                        onChange={(event) => onChange("description", event.target.value)}
                        required
                    />
                </div>
            </div>
        </div>
    </div>
);

export default ClassInformation;
