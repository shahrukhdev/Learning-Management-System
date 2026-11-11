import { useMemo, useRef, useState } from "react";
import { CirclePlus } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import SEO from "../../../components/Seo/SEO";
import PermissionsTable from "../../../components/Permissions/PermissionsTable";
import ConfirmPopup from "../../../components/Popups/ConfirmPopup/ConfirmPopup";
import { usePermissionsList } from "../../../hooks/usePermissionsList";
import { useModules } from "../../../hooks/useModules";
import { deletePermission } from "../../../services/permissionService";
import { parseApiError } from "../../../utils/apiError";
import { useAuth } from "../../../hooks/useAuth";
import type { PermissionListItem } from "../../../types/permission.types";
import "./Permissions.css";
import "../Roles/Roles.css";

const DEFAULT_PER_PAGE = 10; // matches the existing "Rows per page" default

const Permissions = () => {

    // Signed-in user (refreshed if one of their permissions is deleted)
    const { user, refreshUser } = useAuth();

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

    // Module names for the Module column (one shared GET /v1/modules request)
    const { modules } = useModules();

    const moduleNames = useMemo(
        () => new Map(modules.map((module) => [module.id, module.name])),
        [modules]
    );


    /* =========================
       Delete (confirm first), same flow as Roles/Users
    ========================= */

    // Opening the confirmation only stores the target; no request is made
    const [deleteTarget, setDeleteTarget] = useState<PermissionListItem | null>(null);

    const [isDeleting, setIsDeleting] = useState(false);

    const isDeletingRef = useRef(false);

    const handleDeletePermission = (permission: PermissionListItem) => {
        setDeleteTarget(permission);
    };

    const handleCancelDelete = () => {
        if (!isDeletingRef.current) setDeleteTarget(null);
    };

    // Only runs when the user clicks "Delete" in the confirmation popup
    const handleConfirmDelete = async () => {

        if (!deleteTarget || isDeletingRef.current) return;

        isDeletingRef.current = true;
        setIsDeleting(true);

        try {

            const response = await deletePermission(deleteTarget.id);

            toast.success(response.message || "Permission deleted successfully.");

            // The signed-in user had this permission: reload their permissions
            if (user?.permissions.includes(deleteTarget.name)) void refreshUser();

            setDeleteTarget(null);

            // If that was the last permission on this page, go to the previous
            // page; otherwise refetch the same page (GET /v1/permissions)
            if (permissions.length <= 1 && page > 1) {
                setPageState({ key: filterKey, page: page - 1 });
            }

            retry();

        } catch (deleteError) {

            const { status, message } = parseApiError(deleteError);

            // 401 is handled globally (redirect + toast)
            if (status !== 401) toast.error(message);

        } finally {

            isDeletingRef.current = false;
            setIsDeleting(false);

        }

    };

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
                            onDeletePermission={handleDeletePermission}
                            moduleNames={moduleNames}
                        />
                    </div>
                </div>
            </div>
        </section>

        {/* Delete Confirmation */}
        <ConfirmPopup
            isOpen={deleteTarget !== null}
            title="Delete Permission"
            message={
                <>
                    Are you sure you want to delete the{" "}
                    <strong>{deleteTarget?.name}</strong> permission? This action cannot be undone.
                </>
            }
            confirmLabel="Delete"
            processingLabel="Deleting..."
            isProcessing={isDeleting}
            onConfirm={handleConfirmDelete}
            onCancel={handleCancelDelete}
        />
    </>
    );
};

export default Permissions;
