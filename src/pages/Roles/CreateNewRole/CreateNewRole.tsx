import SEO from "../../../components/Seo/SEO";
import "./CreateNewRole.css";

const CreateNewRole = () => {
    return (
        <>
            <SEO 
                title="Create New Role - Madrasah Portal"
                description="Create a new role in the Madrasah Portal"
            />

            <section className="create-new-role-section">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-12">
                            <div className="create-role-head">
                                <h1 className="section-title">Create New Role</h1>
                                <p className="section-desc-para m-0">Define responsibilities and access levels for staff members.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

        </>
    )
}

export default CreateNewRole;