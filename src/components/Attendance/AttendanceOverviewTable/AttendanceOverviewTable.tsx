import "./AttendanceOverviewTable.css";

import {
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
    type SortingState,
} from "@tanstack/react-table";

import { useState } from "react";

import { studentsAttendanceOverview } from "./AttendanceOverviewTable.data";

import { attendanceOverviewColumns } from "./AttendanceOverviewTable.columns";

import { ChevronLeft,  ChevronRight, ArrowRight } from "lucide-react";


const StudentsAttendanceOverviewTable = () => {

    const [sorting, setSorting] = useState<SortingState>([]);

    const table = useReactTable({
        
        data: studentsAttendanceOverview,
        columns: attendanceOverviewColumns,

        state: {
            sorting
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

    })

    return (
        <div className="students-attendance-overview">

            {/* Header */}
            <div className="attendance-overview-header">

                <div className="attendance-overview-header-content">
                    <h2 className="attendance-overview-title">
                        Weekly Overview
                    </h2>

                    <span className="attendance-overview-date">
                        7 April - 13 April
                    </span>
                </div>

                <button 
                    type="button" 
                    className="view-history-btn"
                >
                    View Full History
                    <ArrowRight size={16} strokeWidth={2.4} color="#33452F" />
                </button>

            </div>


            {/* Table */}
            <div className="attendance-overview-table-wrapper">

                <table className="attendance-overview-table">

                    <thead>
                        {table.getHeaderGroups().map(
                            (headerGroup) => (
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
                                                    )}
                                            </th>
                                        )
                                    )}

                                </tr>
                            )
                        )}
                    </thead>


                    <tbody>

                        {table.getRowModel().rows.map(
                            (row) => (
                                <tr key={row.id}>

                                    {row.getVisibleCells().map(
                                        (cell) => (
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
                                        )
                                    )}

                                </tr>
                            )
                        )}

                    </tbody>

                </table>

            </div>


            {/* Pagination */}
            <div className="attendance-table-footer">

                <div className="rows-per-page">

                    <span>
                        Rows per page:
                    </span>

                    <select
                        value={
                            table.getState()
                                .pagination.pageSize
                        }
                        onChange={(e) => {
                            table.setPageSize(
                                Number(e.target.value)
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


                <div className="table-pagination">

                    <span>
                        Page{" "}
                        {table.getState().pagination.pageIndex + 1}
                        {" "}of{" "}
                        {table.getPageCount()}
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
                        <ChevronLeft size={16} strokeWidth={2.5} />
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
                        <ChevronRight size={16} strokeWidth={2.5} />
                    </button>

                </div>

            </div>

        </div>
    );

};

export default StudentsAttendanceOverviewTable;