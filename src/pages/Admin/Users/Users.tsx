import { useMemo, useState } from "react";

import { UserPlus } from "lucide-react";

import SEO from "../../../components/Seo/SEO";

import "./Users.css";

import UserManagementTabs from "../../../components/Users/UserTabs";
import type { UserTab } from "../../../components/Users/UserTabs";
import UserManagementTable from "../../../components/Users/UsersTable";
import FilterBar from "../../../components/FilterBar/FilterBar";
import AddUserPopup from "../../../components/Popups/AddUserPopup/AddUserPopup";

import { students } from "../../../components/Attendance/Attendance.data";

import { useDebouncedValue } from "../../../hooks/useDebouncedValue";
import { useUsersList } from "../../../hooks/useUsersList";
import type { SortDirection } from "../../../types/user.types";

const ALL_TAB = "all";
const SEARCH_DEBOUNCE_MS = 450;
const DEFAULT_PER_PAGE = 10; // matches the existing "Rows per page" default
const DEFAULT_SORT_DIRECTION: SortDirection = "desc";

const Users = () => {

    const [isAddUserOpen, setIsAddUserOpen] = useState(false);

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

    const activeRole = roles.find((role) => role.id === roleId);

    const isStudentTab = activeRole?.name.trim().toLowerCase() === "student";

    return (
        <>
            <SEO
                title="User Management | Noor Ul Imaan Masjid"
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
                                />

                            </div>

                        </div>

                    </div>

                </div>

            </section>


            {/* =========================
                Add User Popup
            ========================= */}

            <AddUserPopup
                isOpen={isAddUserOpen}
                onClose={() =>
                    setIsAddUserOpen(false)
                }
                childrenList={students}
                onAddUser={(data) => {
                    console.log("New User:", data);
                }}
            />

        </>
    );
};

export default Users;