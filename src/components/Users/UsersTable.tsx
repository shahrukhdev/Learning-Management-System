import "../Table/Table.css";

import { flexRender, getCoreRowModel, useReactTable, type OnChangeFn, type SortingState } from "@tanstack/react-table";

import { useMemo } from "react";

import { ChevronLeft, ChevronRight } from "lucide-react";

import { getUserManagementColumns } from "./Users.columns";

import type { ManagedUser, SortDirection } from "../../types/user.types";
import type { PaginationMeta } from "../../types/api.types";


const PAGE_SIZE_OPTIONS = [10, 20, 30, 50];


interface UserManagementTableProps {
    users: ManagedUser[];
    pagination: PaginationMeta | null;
    page: number;
    perPage: number;
    isLoading: boolean;
    hasLoaded: boolean;
    error: string | null;
    showYear: boolean;
    isSearching: boolean;
    isRoleFiltered: boolean;
    onPageChange: (page: number) => void;
    onPerPageChange: (perPage: number) => void;
    // null = no sort (newest first, no arrow)
    sortDirection: SortDirection | null;
    onSortDirectionChange: (direction: SortDirection | null) => void;
    onRetry: () => void;
    // Omitted = action hidden ("Edit User" / "Delete User")
    onEditUser?: (user: ManagedUser) => void;
    onDeleteUser?: (user: ManagedUser) => void;
}

// Only the User (name) column is sortable, and the backend does the sorting
const SORT_COLUMN_ID = "name";


const UserManagementTable = ({
    users,
    pagination,
    page,
    perPage,
    isLoading,
    hasLoaded,
    error,
    showYear,
    isSearching,
    isRoleFiltered,
    onPageChange,
    onPerPageChange,
    sortDirection,
    onSortDirectionChange,
    onRetry,
    onEditUser,
    onDeleteUser,
}: UserManagementTableProps) => {

    // Table sort state mirrors the server-side sort direction
    const sorting: SortingState =
        sortDirection === null ? [] : [{ id: SORT_COLUMN_ID, desc: sortDirection === "desc" }];

    // The existing header button calls column.toggleSorting(); turn the
    // resulting state into a sort direction for the API
    const handleSortingChange: OnChangeFn<SortingState> = (updater) => {
        const next = typeof updater === "function" ? updater(sorting) : updater;
        const nameSort = next.find((entry) => entry.id === SORT_COLUMN_ID);

        const nextDirection: SortDirection | null =
            nameSort ? (nameSort.desc ? "desc" : "asc") : null;

        if (nextDirection !== sortDirection) {
            onSortDirectionChange(nextDirection);
        }
    };

    const columns = useMemo(
        () => getUserManagementColumns({ showYear, onEdit: onEditUser, onDelete: onDeleteUser }),
        [showYear, onEditUser, onDeleteUser]
    );


    const table =
        useReactTable<ManagedUser>({

            data: users,

            columns,

            state: {
                sorting,
            },

            onSortingChange:
                handleSortingChange,

            getCoreRowModel:
                getCoreRowModel(),

            // Rows arrive already sorted by the API
            manualSorting: true,

            // Third click clears the sort (back to newest first)
            enableSortingRemoval: true,

            // Pagination is done by the API
            manualPagination: true,

        });


    // Footer numbers come from the API's pagination metadata
    const totalResults =
        pagination?.total ?? 0;

    const resultsPerPage =
        pagination?.per_page ?? perPage;

    const currentPage =
        pagination?.current_page ?? page;

    const totalPages =
        Math.max(pagination?.last_page ?? 1, 1);


    const firstResult =
        totalResults === 0
            ? 0
            : (currentPage - 1) * resultsPerPage + 1;


    const lastResult =
        Math.min(
            currentPage * resultsPerPage,
            totalResults
        );


    const canPreviousPage =
        page > 1;

    const canNextPage =
        page < totalPages;


    const rows =
        table.getRowModel().rows;


    // Body state when there are no rows to show: loading, error, or empty.
    // (While loading with existing rows, those rows stay visible, dimmed.)
    const renderStatusRow = () => {

        if (isLoading) {
            return (
                <span className="d-inline-flex align-items-center gap-2">
                    <span className="spinner-border spinner-border-sm" aria-hidden="true"></span>
                    Loading users...
                </span>
            );
        }

        if (error) {
            return (
                <span className="d-inline-flex flex-column align-items-center gap-2">
                    <span>{error}</span>
                    <button
                        type="button"
                        className="table-retry-button"
                        onClick={onRetry}
                    >
                        Try again
                    </button>
                </span>
            );
        }

        // Role tabs only filter the loaded page, so say so
        if (isRoleFiltered) {
            return "No users with this role on this page.";
        }

        return isSearching
            ? "No users match your search."
            : "No users found.";
    };

    const showRows =
        !error && rows.length > 0;


    return (

        <div className="table-card">

            {/* Table */}

            <div
                className={`table-wrapper ${isLoading && hasLoaded ? "is-loading" : ""}`}
                aria-busy={isLoading}
            >

                <table className="data-table">

                    <thead>

                        {table
                            .getHeaderGroups()
                            .map((headerGroup) => (

                                <tr
                                    key={
                                        headerGroup.id
                                    }
                                >

                                    {headerGroup.headers.map(
                                        (header) => (

                                            <th
                                                key={
                                                    header.id
                                                }
                                                aria-sort={
                                                    header.column.id === SORT_COLUMN_ID
                                                        ? (sortDirection === null
                                                            ? "none"
                                                            : sortDirection === "asc" ? "ascending" : "descending")
                                                        : undefined
                                                }
                                            >

                                                {header.isPlaceholder
                                                    ? null
                                                    : flexRender(
                                                        header.column.columnDef.header,
                                                        header.getContext()
                                                    )
                                                }

                                            </th>

                                        )
                                    )}

                                </tr>

                            ))}

                    </thead>


                    <tbody>

                        {showRows ? (

                            rows.map((row) => (

                                <tr
                                    key={row.id}
                                >

                                    {row
                                        .getVisibleCells()
                                        .map((cell) => (

                                            <td
                                                key={
                                                    cell.id
                                                }
                                            >

                                                {flexRender(
                                                    cell.column.columnDef.cell,
                                                    cell.getContext()
                                                )}

                                            </td>

                                        ))}

                                </tr>

                            ))

                        ) : (

                            <tr>

                                <td
                                    colSpan={
                                        columns.length
                                    }
                                    className="table-empty"
                                >
                                    {renderStatusRow()}
                                </td>

                            </tr>

                        )}

                    </tbody>

                </table>

            </div>


            {/* Footer */}

            <div className="table-footer">

                {/* Rows Per Page */}

                <div className="table-rows-per-page">

                    <span>
                        Rows per page:
                    </span>

                    <select
                        value={perPage}
                        onChange={(e) => {

                            onPerPageChange(
                                Number(
                                    e.target.value
                                )
                            );

                        }}
                    >

                        {PAGE_SIZE_OPTIONS.map((size) => (

                            <option
                                key={size}
                                value={size}
                            >
                                {size}
                            </option>

                        ))}

                    </select>

                </div>


                {/* Showing Results */}

                <div className="table-results">

                    Showing{" "}

                    <strong>
                        {firstResult}
                    </strong>

                    {"–"}

                    <strong>
                        {lastResult}
                    </strong>

                    {" "}of{" "}

                    <strong>
                        {totalResults}
                    </strong>

                    {" "}users

                </div>


                {/* Pagination */}

                <div className="table-pagination">

                    <span>

                        Page{" "}

                        {page}

                        {" "}of{" "}

                        {totalPages}

                    </span>


                    <button
                        type="button"
                        disabled={
                            !canPreviousPage
                        }
                        onClick={() =>
                            onPageChange(page - 1)
                        }
                        aria-label="Previous page"
                    >

                        <ChevronLeft
                            size={16}
                            strokeWidth={2}
                        />

                    </button>


                    <button
                        type="button"
                        disabled={
                            !canNextPage
                        }
                        onClick={() =>
                            onPageChange(page + 1)
                        }
                        aria-label="Next page"
                    >

                        <ChevronRight
                            size={16}
                            strokeWidth={2}
                        />

                    </button>

                </div>

            </div>

        </div>

    );
};


export default UserManagementTable;
