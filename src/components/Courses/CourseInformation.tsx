export interface CourseFormData {
    name: string;
    description: string;
}

interface CourseInformationProps {
    formData: CourseFormData;
    onChange: (field: keyof CourseFormData, value: string) => void;
}

const CourseInformation = ({ formData, onChange }: CourseInformationProps) => (
    <div className="col-12">
        <div className="create-role-card">
            <div className="create-role-card-header">
                <h2 className="create-role-card-title">Course Information</h2>
            </div>
            <div className="create-role-card-body">
                <div className="primary-field">
                    <label htmlFor="course-name" className="primary-label">Course Name</label>
                    <input
                        id="course-name"
                        type="text"
                        className="primary-control"
                        placeholder="e.g. Quran Studies"
                        value={formData.name}
                        onChange={(event) => onChange("name", event.target.value)}
                        required
                    />
                </div>
                <div className="primary-field mb-0">
                    <label htmlFor="course-description" className="primary-label">Description</label>
                    <textarea
                        id="course-description"
                        className="primary-textarea"
                        placeholder="Briefly describe this course..."
                        value={formData.description}
                        onChange={(event) => onChange("description", event.target.value)}
                        required
                    />
                </div>
            </div>
        </div>
    </div>
);

export default CourseInformation;
