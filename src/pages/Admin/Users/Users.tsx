import { useMemo, useRef, useState } from "react";

import { UserPlus } from "lucide-react";
import { toast } from "react-toastify";

import SEO from "../../../components/Seo/SEO";

import "./Users.css";

import UserManagementTabs from "../../../components/Users/UserTabs";
import type { UserTab } from "../../../components/Users/UserTabs";
import UserManagementTable from "../../../components/Users/UsersTable";
import FilterBar from "../../../components/FilterBar/FilterBar";
import AddUserPopup from "../../../components/Popups/AddUserPopup/AddUserPopup";
import ConfirmPopup from "../../../components/Popups/ConfirmPopup/ConfirmPopup";

import { students } from "../../../components/Attendance/Attendance.data";

import { useDebouncedValue } from "../../../hooks/useDebouncedValue";
import { useUsersList } from "../../../hooks/useUsersList";
import { deleteUser } from "../../../services/userService";
import { parseApiError } from "../../../utils/apiError";
import { toAuthUser } from "../../../utils/authUser";
import { useAuth } from "../../../hooks/useAuth";
import type { ManagedUser, SortDirection } from "../../../types/user.types";
import { usePermissions } from "../../../hooks/usePermissions";
import { PERMISSIONS } from "../../../utils/permissions";

const ALL_TAB = "all";
const SEARCH_DEBOUNCE_MS = 450;
const DEFAULT_PER_PAGE = 10; // matches the existing "Rows per page" default
const DEFAULT_SORT_DIRECTION: SortDirection = "desc";

const Users = () => {

    // View is checked by the route; each action has its own permission
    const { hasPermission } = usePermissions();

    const canCreate = hasPermission(PERMISSIONS.CREATE_USER);

    const canEdit = hasPermission(PERMISSIONS.EDIT_USER);

    const canDelete = hasPermission(PERMISSIONS.DELETE_USER);

    const [isAddUserOpen, setIsAddUserOpen] = useState(false);

    // Signed-in user (synced after editing yourself; see handleUserUpdated)
    const { user: authUser, setUser: setAuthUser, refreshUser } = useAuth();

    // "all" or a real role ID (as a string)
    const [activeTab, setActiveTab] = useState(ALL_TAB);

    const [search, setSearch] = useState("");

    const [perPage, setPerPage] = useState(DEFAULT_PER_PAGE);

    // Server-side sort on the User (name) column
    const [sortDirection, setSortDirection] = useState<SortDirection>(DEFAULT_SORT_DIRECTION);

    // Trimmed + debounced, so typing (or adding spaces) doesn't fire requests
    const debouncedSearch = useDebouncedValue(search.trim(), SEARCH_DEBOUNCE_MS);

    const roleId = activeTab === ALL_TAB ? null : Number(activeTab);

    // The page resets to 1 whenever search, sort or page size changes: a page
    // number only applies to the query it was chosen under. It is derived in
    // the same render, so a sort/search change sends one request (never a
    // request for the old page followed by page 1). The role tab is NOT part
    // of this key, because switching tabs must not refetch or change the page.
    const filterKey = `${debouncedSearch}|${sortDirection}|${perPage}`;

    const [pageState, setPageState] = useState({ key: filterKey, page: 1 });

    const page = pageState.key === filterKey ? pageState.page : 1;

    const {
        users,
        pagination,
        error,
        isLoading,
        hasLoaded,
        roles,
        retry,
    } = useUsersList({ search: debouncedSearch, sortDirection, page, perPage });

    // Role tabs filter the currently loaded page locally (no API request).
    // Because the API is server-paginated, this only covers the loaded page.
    const visibleUsers = useMemo(
        () =>
            roleId === null
                ? users
                : users.filter((user) =>
                    (user.roles ?? []).some((role) => role.id === roleId)
                ),
        [users, roleId]
    );

    // "All Users" + one tab per role, using the roles' real IDs
    const tabs = useMemo<UserTab[]>(
        () => [
            { value: ALL_TAB, label: "All Users" },
            ...roles.map((role) => ({ value: String(role.id), label: role.name })),
        ],
        [roles]
    );
console.log("Roles received by Users.tsx:", roles);
console.table(roles);

    // After creating a user: go back to page 1 and fetch the list again, keeping
    // the current search, sort, page size and role tab. Both updates land in
    // one render, so this sends a single request.
    const handleUserCreated = () => {
        setPageState({ key: filterKey, page: 1 });
        retry();
    };

    // After editing: refetch the same page with the same search/sort/tab, and
    // if the edited user is the signed-in user, sync AuthContext so the
    // Header, Sidebar and role-based routes reflect the change right away.
    // (The token and session are untouched.)
    const handleUserUpdated = (updatedUser: ManagedUser) => {
        retry();
        void syncAuthUserIfSelf(updatedUser);
    };

    const syncAuthUserIfSelf = async (updatedUser: ManagedUser) => {

        // Editing someone else never touches the signed-in user's state
        if (!authUser || updatedUser.id !== authUser.id) return;

        // Show the PUT response straight away (permissions are kept). The
        // AuthContext keeps a single role name: the (first) assigned role.
        const updatedRoleName = updatedUser.roles?.[0]?.name;

        if (updatedRoleName) {
            setAuthUser(toAuthUser({
                id: updatedUser.id,
                name: updatedUser.name,
                initials: updatedUser.initials,
                email: updatedUser.email,
                phone_no: updatedUser.phone_no,
                image: updatedUser.image,
                role: updatedRoleName,
            }));
        }

        // A role change can change permissions: reload the profile
        // (GET /v1/profile). Non-fatal if it fails.
        await refreshUser();

    };


    /* =========================
       Edit
    ========================= */

    // The popup fetches the user's details itself (GET /v1/users/{id})
    const [editUserId, setEditUserId] = useState<number | null>(null);

    const handleEditUser = (user: ManagedUser) => {
        if (!canEdit) return;
        setEditUserId(user.id);
    };

    const handleCloseUserPopup = () => {
        setIsAddUserOpen(false);
        setEditUserId(null);
    };


    /* =========================
       Delete (confirm first)
    ========================= */

    // Opening the confirmation only stores the target; no request is made
    const [deleteTarget, setDeleteTarget] = useState<ManagedUser | null>(null);

    const [isDeleting, setIsDeleting] = useState(false);

    const isDeletingRef = useRef(false);

    const handleDeleteUser = (user: ManagedUser) => {
        if (!canDelete) return;
        setDeleteTarget(user);
    };

    const handleCancelDelete = () => {
        if (!isDeletingRef.current) setDeleteTarget(null);
    };

    // Only runs when the user clicks "Delete" in the confirmation popup
    const handleConfirmDelete = async () => {

        if (!deleteTarget || isDeletingRef.current || !canDelete) return;

        isDeletingRef.current = true;
        setIsDeleting(true);

        try {

            const response = await deleteUser(deleteTarget.id);

            toast.success(response.message || "User deleted successfully.");

            setDeleteTarget(null);

            // If that was the last record on this page, go to the previous
            // page; otherwise refetch the same page. Search, sort and the role
            // tab are untouched. (Uses the loaded page, not the tab-filtered
            // rows, since the API page is what changes.)
            const wasLastOnPage = users.length <= 1 && page > 1;

            if (wasLastOnPage) {
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

    const activeRole = roles.find((role) => role.id === roleId);

    const isStudentTab = activeRole?.name.trim().toLowerCase() === "student";

    return (
        <>
            <SEO
                title="Users Management - Noor Ul Imaan Masjid"
                description="Manage users in Noor Ul Imaan Masjid Madrassah Portal."
            />

            <section className="user-management-section">

                <div className="container-fluid">

                    <div className="row">

                        {/* =========================
                            Page Header
                        ========================= */}

                        <div className="col-12">

                            <div className="section-head">

                                <div>

                                    <h1 className="section-title">
                                        User Management
                                    </h1>

                                    <p className="section-desc-para m-0">
                                        Manage staff, students, and system access.
                                    </p>

                                </div>


                                {canCreate && (
                                    <button
                                        type="button"
                                        className="new-notice-btn"
                                        onClick={() =>
                                            setIsAddUserOpen(true)
                                        }
                                    >

                                        <UserPlus
                                            color="#fff"
                                            size={20}
                                            strokeWidth={2.5}
                                        />

                                        <span>
                                            Add New User
                                        </span>

                                    </button>
                                )}

                            </div>

                        </div>


                        {/* =========================
                            Main Card
                        ========================= */}

                        <div className="col-12">

                            <div className="user-management-card">

                                {/* =========================
                                    Top Controls
                                ========================= */}

                                <div className="user-management-controls">

                                    <UserManagementTabs
                                        tabs={tabs}
                                        activeTab={activeTab}
                                        onTabChange={setActiveTab}
                                    />


                                    <FilterBar
                                        searchPlaceholder="Search users..."
                                        searchValue={search}
                                        onSearchChange={setSearch}
                                    />

                                </div>


                                {/* =========================
                                    Table
                                ========================= */}

                                <UserManagementTable
                                    users={visibleUsers}
                                    pagination={pagination}
                                    page={page}
                                    perPage={perPage}
                                    isLoading={isLoading}
                                    hasLoaded={hasLoaded}
                                    error={error}
                                    showYear={isStudentTab}
                                    isSearching={debouncedSearch !== ""}
                                    isRoleFiltered={roleId !== null}
                                    onPageChange={(nextPage) =>
                                        setPageState({ key: filterKey, page: nextPage })
                                    }
                                    onPerPageChange={setPerPage}
                                    sortDirection={sortDirection}
                                    onSortDirectionChange={setSortDirection}
                                    onRetry={retry}
                                    onEditUser={canEdit ? handleEditUser : undefined}
                                    onDeleteUser={canDelete ? handleDeleteUser : undefined}
                                />

                            </div>

                        </div>

                    </div>

                </div>

            </section>


            {/* =========================
                Add / Edit User Popup (same popup)
            ========================= */}

            <AddUserPopup
                // Opens only with the matching permission (Add / Edit)
                isOpen={(isAddUserOpen && canCreate) || (editUserId !== null && canEdit)}
                editUserId={canEdit ? editUserId : null}
                onClose={handleCloseUserPopup}
                childrenList={students}
                roleOptions={roles}
                onUserCreated={handleUserCreated}
                onUserUpdated={handleUserUpdated}
            />


            {/* =========================
                Delete Confirmation
            ========================= */}

            <ConfirmPopup
                isOpen={deleteTarget !== null && canDelete}
                title="Delete User"
                message={
                    <>
                        Are you sure you want to delete{" "}
                        <strong>{deleteTarget?.name}</strong>? This action cannot be undone.
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

export default Users;