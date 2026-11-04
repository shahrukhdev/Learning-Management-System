import { useState } from "react";
import { CirclePlus } from "lucide-react";
import { Link } from "react-router-dom";
import SEO from "../../../components/Seo/SEO";
import PermissionsTable from "../../../components/Permissions/PermissionsTable";
import { usePermissionsList } from "../../../hooks/usePermissionsList";
import "./Permissions.css";
import "../Roles/Roles.css";

const DEFAULT_PER_PAGE = 10; // matches the existing "Rows per page" default

const Permissions = () => {

    const [perPage, setPerPage] = useState(DEFAULT_PER_PAGE);

    const filterKey = `${perPage}`;

    const [pageState, setPageState] = useState({ key: filterKey, page: 1 });

    const page = pageState.key === filterKey ? pageState.page : 1;

    const {
        permissions,
        pagination,
        error,
        isLoading,
        hasLoaded,
        retry,
    } = usePermissionsList({ page, perPage });

    return (
    <>
        <SEO
            title="Permissions Management - Noor Ul Imaan Masjid"
            description="Define and control permissions across the Madrasah portal."
        />
        <section className="admin permissions-section">
            <div className="container-fluid">
                <div className="row">
                    <div className="col-12">
                        <div className="section-head">
                            <div>
                                <h1 className="section-title">Manage Permissions</h1>
                                <p className="section-desc-para m-0">
                                    Define and control permissions across the Madrasah portal.
                                </p>
                            </div>
                            <Link
                                to="/system/permissions/create"
                                className="new-notice-btn"
                            >
                                <CirclePlus color="#fff" size={20} strokeWidth={2.5} />
                                <span>Create Permission</span>
                            </Link>
                        </div>
                    </div>
                    <div className="col-12">
                        <PermissionsTable
                            permissions={permissions}
                            pagination={pagination}
                            page={page}
                            perPage={perPage}
                            isLoading={isLoading}
                            hasLoaded={hasLoaded}
                            error={error}
                            onPageChange={(nextPage) =>
                                setPageState({ key: filterKey, page: nextPage })
                            }
                            onPerPageChange={setPerPage}
                            onRetry={retry}
                        />
                    </div>
                </div>
            </div>
        </section>
    </>
    );
};

export default Permissions;
