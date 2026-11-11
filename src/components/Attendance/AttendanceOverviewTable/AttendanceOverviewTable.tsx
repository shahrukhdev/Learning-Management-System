import "../../Table/Table.css";

import { flexRender, getCoreRowModel, getPaginationRowModel, getSortedRowModel, useReactTable, type SortingState } from "@tanstack/react-table";

import { useMemo, useState } from "react";

import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";

import { getAttendanceOverviewColumns } from "./AttendanceOverviewTable.columns";
import AttendanceDot from "./AttendanceDot";
import { formatWeekRange } from "../attendanceDates";
import type { StudentsAttendanceOverview } from "./AttendanceOverviewTable.types";

import "../AttendanceStudentList/AttendanceStudentList.css";

interface AttendanceOverviewTableProps {
    records: StudentsAttendanceOverview[];
    weekStart: string; // Monday (Y-m-d)
    isLoading: boolean;
    error: string | null;
    onRetry: () => void;
    onPreviousWeek: () => void;
    onNextWeek: () => void;
    canGoToNextWeek: boolean;
    // Shown instead of the table when there is no class to show
    emptyMessage?: string | null;
}

const StudentsAttendanceOverviewTable = ({
    records,
    weekStart,
    isLoading,
    error,
    onRetry,
    onPreviousWeek,
    onNextWeek,
    canGoToNextWeek,
    emptyMessage = null,
}: AttendanceOverviewTableProps) => {

    const [sorting, setSorting] =
        useState<SortingState>([]);

    const columns = useMemo(
        () => getAttendanceOverviewColumns(weekStart),
        [weekStart]
    );


    const table = useReactTable({

        data:
            records,

        columns,

        getRowId: (row) => String(row.student_id),

        // Keep the current page when the same rows reload
        autoResetPageIndex: false,

        state: {
            sorting,
        },

        onSortingChange:
            setSorting,

        getCoreRowModel:
            getCoreRowModel(),

        getSortedRowModel:
            getSortedRowModel(),

        getPaginationRowModel:
            getPaginationRowModel(),

        initialState: {

            pagination: {

                pageSize: 10,

            },

        },

    });


    const pageIndex =
        table.getState()
            .pagination
            .pageIndex;

    const pageSize =
        table.getState()
            .pagination
            .pageSize;


    const totalResults =
        records.length;

    // Back to a valid page if the list got shorter (e.g. another class)
    const pageCount = Math.max(table.getPageCount(), 1);

    if (pageIndex > pageCount - 1) {
        table.setPageIndex(pageCount - 1);
    }


    const firstResult =
        totalResults === 0
            ? 0
            : pageIndex * pageSize + 1;


    const lastResult =
        Math.min(
            (pageIndex + 1) * pageSize,
            totalResults
        );


    return (

        <div className="attendance-table-card">

            {/* Header */}

            <div className="attendance-table-header">

                <div>

                    <h2 className="attendance-table-title">

                        Weekly Overview

                    </h2>

                    <span className="attendance-table-date">

                        {formatWeekRange(weekStart)}

                    </span>

                    <div className="attendance-legend" aria-label="Legend">
                        <span><AttendanceDot status="present" /> Present</span>
                        <span><AttendanceDot status="late" /> Late</span>
                        <span><AttendanceDot status="absent" /> Absent</span>
                        <span><AttendanceDot status="not-marked" /> Not Marked</span>
                    </div>

                </div>

                <div className="attendance-week-nav">

                    <button
                        type="button"
                        onClick={onPreviousWeek}
                        aria-label="Previous week"
                    >
                        <ChevronLeft size={16} strokeWidth={2.5} />
                    </button>

                    <button
                        type="button"
                        onClick={onNextWeek}
                        disabled={!canGoToNextWeek}
                        aria-label="Next week"
                    >
                        <ChevronRight size={16} strokeWidth={2.5} />
                    </button>

                </div>

            </div>


            {/* Table */}

            {emptyMessage ? (

                <div className="attendance-status">
                    <span className="attendance-empty-icon" aria-hidden="true">
                        <CalendarDays size={20} strokeWidth={2} />
                    </span>
                    <p className="attendance-empty-title">{emptyMessage}</p>
                </div>

            ) : (

            <>

            <div
                className={`attendance-table-wrapper ${isLoading && records.length > 0 ? "table-wrapper is-loading" : ""}`}
                aria-busy={isLoading}
            >

                <table className="data-table attendance-table">

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

                        {table
                            .getRowModel()
                            .rows
                            .length > 0 ? (

                            table
                                .getRowModel()
                                .rows
                                .map((row) => (

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
                                        columns.length
                                    }
                                    className="table-empty"
                                >

                                    {error ? (

                                        <div className="attendance-status">
                                            <span>{error}</span>
                                            <button type="button" className="table-retry-button" onClick={onRetry}>
                                                Try again
                                            </button>
                                        </div>

                                    ) : isLoading ? (

                                        <div className="attendance-status" role="status">
                                            <span className="d-inline-flex align-items-center gap-2">
                                                <span className="spinner-border spinner-border-sm" aria-hidden="true"></span>
                                                Loading weekly overview...
                                            </span>
                                        </div>

                                    ) : (

                                        <div className="attendance-status">
                                            <span className="attendance-empty-icon" aria-hidden="true">
                                                <CalendarDays size={20} strokeWidth={2} />
                                            </span>
                                            <p className="attendance-empty-title">No students found.</p>
                                            <p className="attendance-empty-hint">Students in this class will appear here.</p>
                                        </div>

                                    )}

                                </td>

                            </tr>

                        )}

                    </tbody>

                </table>

            </div>


            {/* Footer */}

            <div className="table-footer attendance-table-footer">

                {/* Rows Per Page */}

                <div className="table-rows-per-page">

                    <span>
                        Rows per page:
                    </span>

                    <select
                        value={
                            table.getState()
                                .pagination
                                .pageSize
                        }
                        onChange={(e) => {

                            table.setPageSize(
                                Number(
                                    e.target.value
                                )
                            );

                        }}
                    >

                        <option value="10">
                            10
                        </option>

                        <option value="20">
                            20
                        </option>

                        <option value="30">
                            30
                        </option>

                        <option value="50">
                            50
                        </option>

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

                    {" "}students

                </div>


                {/* Pagination */}

                <div className="table-pagination">

                    <span>

                        Page{" "}

                        {pageIndex + 1}

                        {" "}of{" "}

                        {Math.max(
                            table.getPageCount(),
                            1
                        )}

                    </span>


                    <button
                        type="button"
                        disabled={
                            !table.getCanPreviousPage()
                        }
                        onClick={() =>
                            table.previousPage()
                        }
                        aria-label="Previous page"
                    >

                        <ChevronLeft
                            size={16}
                            strokeWidth={2.5}
                        />

                    </button>


                    <button
                        type="button"
                        disabled={
                            !table.getCanNextPage()
                        }
                        onClick={() =>
                            table.nextPage()
                        }
                        aria-label="Next page"
                    >

                        <ChevronRight
                            size={16}
                            strokeWidth={2.5}
                        />

                    </button>

                </div>

            </div>

            </>

            )}

        </div>

    );

};


export default StudentsAttendanceOverviewTable;