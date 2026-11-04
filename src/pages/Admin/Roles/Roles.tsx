import { useState } from "react";
import { CirclePlus } from "lucide-react";
import { Link } from "react-router-dom";
import SEO from "../../../components/Seo/SEO";
import "./Roles.css";
import RolesTable from "../../../components/Roles/RolesTable";
import FilterBar from "../../../components/FilterBar/FilterBar";
import { useDebouncedValue } from "../../../hooks/useDebouncedValue";
import { useRolesList } from "../../../hooks/useRolesList";

const SEARCH_DEBOUNCE_MS = 450;
const DEFAULT_PER_PAGE = 10; // matches the backend default and the existing UI

const Roles = () => {

    const [search, setSearch] = useState("");

    const [perPage, setPerPage] = useState(DEFAULT_PER_PAGE);

    // Trimmed + debounced, so typing (or adding spaces) doesn't fire requests
    const debouncedSearch = useDebouncedValue(search.trim(), SEARCH_DEBOUNCE_MS);

    // The page resets to 1 whenever search or page size changes. It is derived
    // in the same render, so each change sends exactly one request.
    const filterKey = `${debouncedSearch}|${perPage}`;

    const [pageState, setPageState] = useState({ key: filterKey, page: 1 });

    const page = pageState.key === filterKey ? pageState.page : 1;

    const {
        roles,
        pagination,
        error,
        isLoading,
        hasLoaded,
        retry,
    } = useRolesList({ search: debouncedSearch, page, perPage });

    return (
        <>
            <SEO
                title="Roles Management | Noor Ul Imaan Masjid"
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
                                    to="/system/roles/create-new"
                                    className="new-notice-btn"
                                >
                                    <CirclePlus
                                        color="#fff"
                                        size={20}
                                        strokeWidth={2.5}
                                    />

                                    <span>
                                        Create New Role
                                    </span>
                                </Link>
                            </div>
                        </div>

                        <div className="col-12">

                            {/* Roles search (searches by role name) */}
                            <div className="roles-controls">
                                <FilterBar
                                    searchPlaceholder="Search roles..."
                                    searchValue={search}
                                    onSearchChange={setSearch}
                                />
                            </div>

                            <RolesTable
                                roles={roles}
                                pagination={pagination}
                                page={page}
                                perPage={perPage}
                                isLoading={isLoading}
                                hasLoaded={hasLoaded}
                                error={error}
                                isSearching={debouncedSearch !== ""}
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

export default Roles;
