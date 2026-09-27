import { Check } from "lucide-react";

import type { ColumnDef } from "@tanstack/react-table";

import type { PermissionModule } from "./PermissionMatrix.data";


export type PermissionKey =
    | "view"
    | "create"
    | "edit"
    | "delete";


export const permissionColumns = (
    togglePermission: (
        moduleId: string,
        permission: PermissionKey
    ) => void
): ColumnDef<PermissionModule>[] => [

    /* =========================
       Module
    ========================= */

    {
        accessorKey: "name",

        header: "Module",

        cell: ({ row }) => (

            <div className="permission-module">

                <span className="permission-module-dot"></span>

                <span>
                    {row.original.name}
                </span>

            </div>

        ),
    },


    /* =========================
       View
    ========================= */

    {
        id: "view",

        header: "View",

        cell: ({ row }) => {

            const module =
                row.original;

            const isChecked =
                module.view;

            return (

                <button
                    type="button"
                    className={`permission-checkbox ${
                        isChecked
                            ? "checked"
                            : ""
                    }`}
                    onClick={() =>
                        togglePermission(
                            module.id,
                            "view"
                        )
                    }
                    aria-label={`View ${module.name}`}
                    aria-pressed={isChecked}
                >

                    {isChecked && (

                        <Check
                            size={13}
                            strokeWidth={3}
                        />

                    )}

                </button>

            );

        },
    },


    /* =========================
       Create
    ========================= */

    {
        id: "create",

        header: "Create",

        cell: ({ row }) => {

            const module =
                row.original;

            const isChecked =
                module.create;

            return (

                <button
                    type="button"
                    className={`permission-checkbox ${
                        isChecked
                            ? "checked"
                            : ""
                    }`}
                    onClick={() =>
                        togglePermission(
                            module.id,
                            "create"
                        )
                    }
                    aria-label={`Create ${module.name}`}
                    aria-pressed={isChecked}
                >

                    {isChecked && (

                        <Check
                            size={13}
                            strokeWidth={3}
                        />

                    )}

                </button>

            );

        },
    },


    /* =========================
       Edit
    ========================= */

    {
        id: "edit",

        header: "Edit",

        cell: ({ row }) => {

            const module =
                row.original;

            const isChecked =
                module.edit;

            return (

                <button
                    type="button"
                    className={`permission-checkbox ${
                        isChecked
                            ? "checked"
                            : ""
                    }`}
                    onClick={() =>
                        togglePermission(
                            module.id,
                            "edit"
                        )
                    }
                    aria-label={`Edit ${module.name}`}
                    aria-pressed={isChecked}
                >

                    {isChecked && (

                        <Check
                            size={13}
                            strokeWidth={3}
                        />

                    )}

                </button>

            );

        },
    },


    /* =========================
       Delete
    ========================= */

    {
        id: "delete",

        header: "Delete",

        cell: ({ row }) => {

            const module =
                row.original;

            const isChecked =
                module.delete;

            return (

                <button
                    type="button"
                    className={`permission-checkbox ${
                        isChecked
                            ? "checked"
                            : ""
                    }`}
                    onClick={() =>
                        togglePermission(
                            module.id,
                            "delete"
                        )
                    }
                    aria-label={`Delete ${module.name}`}
                    aria-pressed={isChecked}
                >

                    {isChecked && (

                        <Check
                            size={13}
                            strokeWidth={3}
                        />

                    )}

                </button>

            );

        },
    },

];