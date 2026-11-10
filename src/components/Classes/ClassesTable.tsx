import "../Table/Table.css";

import {
    flexRender,
    getCoreRowModel,
    useReactTable,
} from "@tanstack/react-table";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo } from "react";
import { getClassesColumns } from "./ClassesTable.columns";
import TablePageNumbers from "../Table/TablePageNumbers";
import type { AcademicClassItem } from "../../types/academicClass.types";
import type { PaginationMeta } from "../../types/api.types";

const PAGE_SIZE_OPTIONS = [10, 20, 30, 50];

interface ClassesTableProps {
    classes: AcademicClassItem[];
    pagination: PaginationMeta | null;
    page: number;
    perPage: number;
    isLoading: boolean;
    hasLoaded: boolean;
    error: string | null;
    isFiltered: boolean;
    listSearch: string;
    onPageChange: (page: number) => void;
    onPerPageChange: (perPage: number) => void;
    onRetry: () => void;
    onDeleteClass: (classItem: AcademicClassItem) => void;
}

const ClassesTable = ({
    classes,
    pagination,
    page,
    perPage,
    isLoading,
    hasLoaded,
    error,
    isFiltered,
    listSearch,
    onPageChange,
    onPerPageChange,
    onRetry,
    onDeleteClass,
}: ClassesTableProps) => {
    const classesColumns = useMemo(
        () => getClassesColumns({ onDelete: onDeleteClass, listSearch }),
        [onDeleteClass, listSearch]
    );

    const table = useReactTable({
        data: classes,
        columns: classesColumns,
        getCoreRowModel: getCoreRowModel(),
        // Pagination is done by the API
        manualPagination: true,
    });

    // Footer numbers come from the API's pagination metadata
    const totalResults = pagination?.total ?? 0;
    const resultsPerPage = pagination?.per_page ?? perPage;
    const currentPage = pagination?.current_page ?? page;
    const totalPages = Math.max(pagination?.last_page ?? 1, 1);
    const firstResult = totalResults === 0 ? 0 : (currentPage - 1) * resultsPerPage + 1;
    const lastResult = Math.min(currentPage * resultsPerPage, totalResults);

    const rows = table.getRowModel().rows;
    const showRows = !error && rows.length > 0;

    // Body state when there are no rows to show: loading, error, or empty.
    // (While loading with existing rows, those rows stay visible, dimmed.)
    const renderStatusRow = () => {
        if (isLoading) {
            return (
                <span className="d-inline-flex align-items-center gap-2">
                    <span className="spinner-border spinner-border-sm" aria-hidden="true" />
                    Loading classes...
                </span>
            );
        }

        if (error) {
            return (
                <span className="d-inline-flex flex-column align-items-center gap-2">
                    <span>{error}</span>
                    <button type="button" className="table-retry-button" onClick={onRetry}>
                        Try again
                    </button>
                </span>
            );
        }

        return isFiltered ? "No classes match your filters." : "No classes found.";
    };

    return (
        <div className="table-card">
            <div
                className={`table-wrapper ${isLoading && hasLoaded ? "is-loading" : ""}`}
                aria-busy={isLoading}
            >
                <table className="data-table">
                    <thead>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <tr key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <th key={header.id}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody>
                        {showRows ? (
                            rows.map((row) => (
                                <tr key={row.id}>
                                    {row.getVisibleCells().map((cell) => (
                                        <td key={cell.id}>
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
                                <td colSpan={classesColumns.length} className="table-empty">
                                    {renderStatusRow()}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            <div className="table-footer">
                <div className="table-rows-per-page">
                    <span>Rows per page:</span>
                    <select
                        value={perPage}
                        onChange={(event) => onPerPageChange(Number(event.target.value))}
                    >
                        {PAGE_SIZE_OPTIONS.map((size) => (
                            <option key={size} value={size}>{size}</option>
                        ))}
                    </select>
                </div>
                <div className="table-results">
                    Showing <strong>{firstResult}</strong>–<strong>{lastResult}</strong> of{" "}
                    <strong>{totalResults}</strong> classes
                </div>
                <div className="table-pagination">
                    <span>
                        Page {page} of {totalPages}
                    </span>
                    <button
                        type="button"
                        disabled={page <= 1}
                        onClick={() => onPageChange(page - 1)}
                        aria-label="Previous page"
                    >
                        <ChevronLeft size={16} strokeWidth={2} />
                    </button>
                    <TablePageNumbers
                        page={page}
                        totalPages={totalPages}
                        onPageChange={onPageChange}
                    />
                    <button
                        type="button"
                        disabled={page >= totalPages}
                        onClick={() => onPageChange(page + 1)}
                        aria-label="Next page"
                    >
                        <ChevronRight size={16} strokeWidth={2} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ClassesTable;
