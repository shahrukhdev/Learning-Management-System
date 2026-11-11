import { useRef, useState } from "react";
import { CirclePlus } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import SEO from "../../../components/Seo/SEO";
import "./Roles.css";
import RolesTable from "../../../components/Roles/RolesTable";
import ConfirmPopup from "../../../components/Popups/ConfirmPopup/ConfirmPopup";
import { useRolesList } from "../../../hooks/useRolesList";
import { deleteRole } from "../../../services/roleService";
import { parseApiError } from "../../../utils/apiError";
import { useAuth } from "../../../hooks/useAuth";
import type { RoleListItem } from "../../../types/role.types";

const DEFAULT_PER_PAGE = 10; // matches the backend default and the existing UI

const Roles = () => {

    // Signed-in user (refreshed if their own role is deleted)
    const { user, refreshUser } = useAuth();

    const [perPage, setPerPage] = useState(DEFAULT_PER_PAGE);

    // The page resets to 1 whenever the page size changes. It is derived in
    // the same render, so each change sends exactly one request.
    const filterKey = `${perPage}`;

    const [pageState, setPageState] = useState({ key: filterKey, page: 1 });

    const page = pageState.key === filterKey ? pageState.page : 1;

    const {
        roles,
        pagination,
        error,
        isLoading,
        hasLoaded,
        retry,
    } = useRolesList({ search: "", page, perPage });


    /* =========================
       Delete (confirm first), same flow as Users
    ========================= */

    // Opening the confirmation only stores the target; no request is made
    const [deleteTarget, setDeleteTarget] = useState<RoleListItem | null>(null);

    const [isDeleting, setIsDeleting] = useState(false);

    const isDeletingRef = useRef(false);

    const handleDeleteRole = (role: RoleListItem) => {
        setDeleteTarget(role);
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

            const response = await deleteRole(deleteTarget.id);

            toast.success(response.message || "Role deleted successfully.");

            // The signed-in user's role was deleted: reload their permissions
            if (user && user.role.trim().toLowerCase() === deleteTarget.name.trim().toLowerCase()) {
                void refreshUser();
            }

            setDeleteTarget(null);

            // If that was the last role on this page, go to the previous page;
            // otherwise refetch the same page (GET /v1/roles)
            if (roles.length <= 1 && page > 1) {
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
                title="Roles Management - Noor Ul Imaan Masjid"
                description="Define and control access levels across the Madrasah portal."
            />

            <section className="roles-section">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-12">
                            <div className="section-head">
                                <div className="">
                                    <h1 className="section-title">
                                        Manage User Roles
                                    </h1>
                                    <p className="section-desc-para m-0">Define and control access levels across the Madrasah portal.</p>
                                </div>
                                <Link
                                    to="/system/roles/create"
                                    className="new-notice-btn"
                                >
                                    <CirclePlus
                                        color="#fff"
                                        size={20}
                                        strokeWidth={2.5}
                                    />

                                    <span>
                                        Create Role
                                    </span>
                                </Link>
                            </div>
                        </div>

                        <div className="col-12">
                            <RolesTable
                                roles={roles}
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
                                onDeleteRole={handleDeleteRole}
                            />
                        </div>
                    </div>
                </div>
            </section>


            {/* Delete Confirmation */}

            <ConfirmPopup
                isOpen={deleteTarget !== null}
                title="Delete Role"
                message={
                    <>
                        Are you sure you want to delete the{" "}
                        <strong>{deleteTarget?.name}</strong> role? This action cannot be undone.
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

export default Roles;
