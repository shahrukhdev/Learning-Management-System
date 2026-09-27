import { useState } from "react";

import { ChevronLeft, ChevronRight, SlidersHorizontal } from "lucide-react";

import { flexRender, getCoreRowModel, getPaginationRowModel, useReactTable } from "@tanstack/react-table";

import { permissionModules, type PermissionModule } from "./PermissionMatrix.data";

import { permissionColumns, type PermissionKey } from "./PermissionMatrix.columns";

import "./PermissionMatrix.css";


const PermissionMatrix = () => {

    const [permissions, setPermissions] =
        useState<PermissionModule[]>(
            permissionModules
        );


    /* =========================
       Permission Toggle
    ========================= */

    const togglePermission = (moduleId: string, permission: PermissionKey) => {

        setPermissions((current) =>
            current.map((module) =>
                module.id === moduleId
                    ? {
                        ...module,
                        [permission]:
                            !module[permission],
                    }
                    : module
            )
        );

    };


    /* =========================
       Select All / Clear
    ========================= */

    const setAllPermissions = (value: boolean) => {

        setPermissions((current) =>
            current.map((module) => ({
                ...module,

                view: value,

                create: value,

                edit: value,

                delete: value,
            }))
        );

    };


    /* =========================
       Table Columns
    ========================= */

    const columns = permissionColumns(
        togglePermission
    );


    /* =========================
       TanStack Table
    ========================= */

    const table = useReactTable<PermissionModule>({

        data: permissions,

        columns,

        getCoreRowModel:
            getCoreRowModel(),

        getPaginationRowModel:
            getPaginationRowModel(),

        initialState: {

            pagination: {

                pageSize: 10,

            },

        },

    });


    /* =========================
       Pagination
    ========================= */

    const pageIndex =
        table.getState()
            .pagination
            .pageIndex;

    const pageSize =
        table.getState()
            .pagination
            .pageSize;

    const totalResults =
        permissions.length;

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

        <div className="permission-matrix-card">

            {/* =========================
                Header
            ========================= */}

            <div className="permission-matrix-header">

                <div className="permission-matrix-heading">

                    <div className="permission-matrix-title-row">

                        <div className="permission-matrix-icon">

                            <SlidersHorizontal
                                size={18}
                                strokeWidth={2}
                            />

                        </div>

                        <div>

                            <h2>
                                Permission Matrix
                            </h2>

                            <p>
                                Configure access levels across system modules.
                            </p>

                        </div>

                    </div>

                </div>


                {/* Quick Actions */}

                <div className="permission-matrix-quick-actions">

                    <span>
                        Quick Toggle:
                    </span>

                    <button
                        type="button"
                        onClick={() =>
                            setAllPermissions(true)
                        }
                    >
                        Select All
                    </button>

                    <button
                        type="button"
                        onClick={() =>
                            setAllPermissions(false)
                        }
                    >
                        Clear
                    </button>

                </div>

            </div>


            {/* =========================
                Table
            ========================= */}

            <div className="permission-matrix-wrapper">

                <table className="permission-matrix-table">

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
                                                        header
                                                            .column
                                                            .columnDef
                                                            .header,
                                                        header.getContext()
                                                    )}

                                            </th>

                                        )
                                    )}

                                </tr>

                            ))}

                    </thead>


                    <tbody>

                        {table
                            .getRowModel()
                            .rows.length > 0 ? (

                            table
                                .getRowModel()
                                .rows
                                .map((row) => (

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
                                                    className={
                                                        cell.column.id ===
                                                        "name"
                                                            ? "permission-module-cell"
                                                            : ""
                                                    }
                                                >

                                                    {flexRender(
                                                        cell
                                                            .column
                                                            .columnDef
                                                            .cell,
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
                                    className="permission-empty-row"
                                >
                                    No permission modules found.
                                </td>

                            </tr>

                        )}

                    </tbody>

                </table>

            </div>


            {/* =========================
                Footer
            ========================= */}

            <div className="permission-matrix-footer">


                {/* Rows Per Page */}

                <div className="permission-rows-per-page">

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

                        <option value="9">
                            10
                        </option>

                        <option value="18">
                            20
                        </option>

                        <option value="27">
                            30
                        </option>

                        <option value="45">
                            50
                        </option>

                    </select>

                </div>


                {/* Showing Results */}

                <div className="permission-results">

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

                    {" "}modules

                </div>


                {/* Pagination */}

                <div className="permission-pagination">

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


export default PermissionMatrix;