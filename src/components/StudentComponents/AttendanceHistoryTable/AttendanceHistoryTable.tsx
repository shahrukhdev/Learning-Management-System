
import { useState } from "react";

import { ChevronDown, ChevronLeft, ChevronRight, ArrowUpDown } from "lucide-react";

import { flexRender, getCoreRowModel, getPaginationRowModel, getSortedRowModel, useReactTable, type ColumnDef, type SortingState, type PaginationState } from "@tanstack/react-table";

import type { AttendanceHistoryTableProps, StudentAttendanceRecord } from "./Attendance.types";

import "./AttendanceHistoryTable.css";

// --------------------------------------------------
// Helper Function
// --------------------------------------------------

const formatDate = (date: string): string => {
    return new Date(`${date}T00:00:00`).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
};

// --------------------------------------------------
// Table Columns
// --------------------------------------------------

const attendanceColumns: ColumnDef<StudentAttendanceRecord>[] = [
    {
        accessorKey: "date",

        header: ({ column }) => (
            <button
                type="button"
                className="attendance-sort-button"
                onClick={() =>
                    column.toggleSorting(column.getIsSorted() === "asc")
                }
            >
                Date
                <ArrowUpDown size={14} />
            </button>
        ),

        cell: ({ row }) => (
            <span className="student-attendance-date">
                {formatDate(row.original.date)}
            </span>
        ),
    },

    {
        accessorKey: "day",

        header: "Day",

        cell: ({ row }) => (
            <span className="student-attendance-day">
                {row.original.day}
            </span>
        ),
    },

    {
        accessorKey: "status",

        header: "Status",

        cell: ({ row }) => {
            const status = row.original.status;

            return (
                <div className="student-attendance-status p-0">
                    <span className={`attendance-dot ${status}`} />

                    <span className={`student-attendance-status-text ${status}`}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                    </span>
                </div>
            );
        },
    },
];

// --------------------------------------------------
// Attendance History Table Component
// --------------------------------------------------

const AttendanceHistoryTable = ({
    records,
    period,
    onPeriodChange,
}: AttendanceHistoryTableProps) => {

    const [sorting, setSorting] = useState<SortingState>([
        {
            id: "date",
            desc: true,
        },
    ]);

    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    });

    // ----------------------------------------------
    // TanStack Table
    // ----------------------------------------------

    const table = useReactTable({
        data: records,
        columns: attendanceColumns,

        state: {
            sorting,
            pagination,
        },

        onSortingChange: setSorting,
        onPaginationChange: setPagination,

        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
    });

    // ----------------------------------------------
    // Pagination Values
    // ----------------------------------------------

    const currentPage = table.getState().pagination.pageIndex;
    const totalPages = table.getPageCount();

    const startResult =
        records.length === 0
            ? 0
            : currentPage * pagination.pageSize + 1;

    const endResult = Math.min(
        (currentPage + 1) * pagination.pageSize,
        records.length
    );

    // ----------------------------------------------
    // Render
    // ----------------------------------------------

    return (
        <div className="attendance-table-card student-attendance-table-card">

            {/* Table Header */}

            <div className="attendance-table-header">
                <div>
                    <h3 className="attendance-table-title">
                        Attendance History
                    </h3>

                    <p className="attendance-table-date">
                        Your daily attendance records
                    </p>
                </div>

                {/* Period Filter */}

                <div className="student-attendance-filter">
                    <select
                        value={period}
                        onChange={(event) => {
                            onPeriodChange(
                                event.target.value as AttendanceHistoryTableProps["period"]
                            );

                            setPagination((previous) => ({
                                ...previous,
                                pageIndex: 0,
                            }));
                        }}
                        aria-label="Filter attendance period"
                    >
                        <option value="7days">Last 7 Days</option>
                        <option value="30days">Last 30 Days</option>
                        <option value="3months">Last 3 Months</option>
                    </select>

                    <ChevronDown
                        size={16}
                        className="student-attendance-filter-icon"
                    />
                </div>
            </div>

            {/* Table */}

            <div className="attendance-table-wrapper">
                <table className="data-table attendance-table student-attendance-table">

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
                        {table.getRowModel().rows.length > 0 ? (
                            table.getRowModel().rows.map((row) => (
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
                                <td
                                    colSpan={attendanceColumns.length}
                                    className="student-attendance-empty"
                                >
                                    No attendance records found.
                                </td>
                            </tr>
                        )}
                    </tbody>

                </table>
            </div>

            {/* Table Footer */}

            <div className="table-footer attendance-table-footer">

                {/* Rows Per Page */}

                <div className="table-rows-per-page">
                    <span>Rows per page:</span>

                    <select
                        value={pagination.pageSize}
                        onChange={(event) => {
                            setPagination({
                                pageIndex: 0,
                                pageSize: Number(event.target.value),
                            });
                        }}
                    >
                        {[10, 20, 30, 50].map((size) => (
                            <option key={size} value={size}>
                                {size}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Results */}

                <div className="table-results">
                    Showing {startResult}–{endResult} of {records.length}
                </div>

                {/* Pagination */}

                <div className="table-pagination">

                    <span>
                        Page{" "}
                        {currentPage + 1}
                        {" "}of{" "}
                        {Math.max(totalPages, 1)}
                    </span>

                    <button
                        type="button"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                        aria-label="Previous page"
                    >
                        <ChevronLeft
                            size={16}
                            strokeWidth={2.5}
                        />
                    </button>

                    <button
                        type="button"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                        aria-label="Next page"
                    >
                        <ChevronRight
                            size={16}
                            strokeWidth={2.5}
                        />
                    </button>

                </div>

            </div>
        </div>
    );
};

export default AttendanceHistoryTable;
