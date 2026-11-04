import "../Table/Table.css";

import { flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { rolesColumns } from "./RolesTable.columns";
import TablePageNumbers from "../Table/TablePageNumbers";
import type { RoleListItem } from "../../types/role.types";
import type { PaginationMeta } from "../../types/api.types";


const PAGE_SIZE_OPTIONS = [10, 20, 30, 50];


interface RolesTableProps {
    roles: RoleListItem[];
    pagination: PaginationMeta | null;
    page: number;
    perPage: number;
    isLoading: boolean;
    hasLoaded: boolean;
    error: string | null;
    onPageChange: (page: number) => void;
    onPerPageChange: (perPage: number) => void;
    onRetry: () => void;
}


const RolesTable = ({
    roles,
    pagination,
    page,
    perPage,
    isLoading,
    hasLoaded,
    error,
    onPageChange,
    onPerPageChange,
    onRetry,
}: RolesTableProps) => {


    const table = useReactTable({

        data: roles,

        columns: rolesColumns,

        getCoreRowModel:
            getCoreRowModel(),

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
                    Loading roles...
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

        return "No roles found.";
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
                                        key={
                                            row.id
                                        }
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
                                        rolesColumns.length
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

                    {" "}roles

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


                    <TablePageNumbers
                        page={page}
                        totalPages={totalPages}
                        onPageChange={onPageChange}
                    />


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


export default RolesTable;
