import "../Table/Table.css";

import { flexRender, getCoreRowModel, getPaginationRowModel, getSortedRowModel, useReactTable, type SortingState } from "@tanstack/react-table";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { roles } from "./RolesTable.data";
import { rolesColumns } from "./RolesTable.columns";


const RolesTable = () => {

    const [sorting, setSorting] =
        useState<SortingState>([]);


    const table = useReactTable({

        data: roles,

        columns: rolesColumns,

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

                pageIndex: 0,

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
        roles.length;


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

        <div className="table-card">

            {/* Table */}

            <div className="table-wrapper">

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
                                        rolesColumns.length
                                    }
                                    className="table-empty"
                                >

                                    No roles found.

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

                    {" "}roles

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
                            strokeWidth={2}
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
                            strokeWidth={2}
                        />

                    </button>

                </div>

            </div>

        </div>

    );
};


export default RolesTable;