import "./UsersTable.css";

import { flexRender, getCoreRowModel, getPaginationRowModel, getSortedRowModel, useReactTable, type SortingState } from "@tanstack/react-table";

import { useMemo, useState } from "react";

import { ChevronLeft, ChevronRight } from "lucide-react";

import { users, type UserManagementData } from "./Users.data";

import { userManagementColumns } from "./Users.columns";


interface UserManagementTableProps {
    search: string;
    activeTab: string;
}

const UserManagementTable = ({
    search,
    activeTab,
}: UserManagementTableProps) => {

    const [sorting, setSorting] =
        useState<SortingState>([]);


    const filteredUsers = useMemo(() => {

        return users.filter((user) => {

            const matchesSearch =
                user.name
                    .toLowerCase()
                    .includes(search.toLowerCase()) ||
                user.email
                    .toLowerCase()
                    .includes(search.toLowerCase());


            const matchesTab =
                activeTab === "all" ||
                (activeTab === "teachers" &&
                    (
                        user.role === "Teacher" ||
                        user.role === "Senior Teacher"
                    )
                ) ||
                (activeTab === "students" &&
                    user.role === "Student"
                ) ||
                (activeTab === "admins" &&
                    user.role === "Admin"
                );


            return matchesSearch && matchesTab;

        });

    }, [search, activeTab]);


    const table = useReactTable<UserManagementData>({

        data: filteredUsers,

        columns: userManagementColumns,

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
        table.getState().pagination.pageIndex;

    const pageSize =
        table.getState().pagination.pageSize;

    const totalResults =
        filteredUsers.length;

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
        <div className="user-management-table-card">

            {/* Table */}

            <div className="user-table-wrapper">

                <table className="user-management-table">

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

                        {table.getRowModel().rows.length > 0 ? (

                            table
                                .getRowModel()
                                .rows
                                .map((row) => (

                                    <tr key={row.id}>

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
                                        userManagementColumns.length
                                    }
                                    className="user-table-empty"
                                >
                                    No users found.
                                </td>

                            </tr>

                        )}

                    </tbody>

                </table>

            </div>


            {/* Footer */}

            <div className="user-table-footer">

                {/* Rows Per Page */}

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

                <div className="user-table-results">

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

                <div className="user-table-pagination">

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

export default UserManagementTable;