import type { ColumnDef } from "@tanstack/react-table";
import { Pencil, Trash2 } from "lucide-react";
import type { Role } from "./RolesTable.data";

export const rolesColumns:
    ColumnDef<Role>[] = [

    /* Role Name */

    {
        accessorKey: "name",

        header: "Role Name",

        cell: ({ row }) => {

            return (

                <div className="table-role-name">

                    <span className="table-role-dot" style={{backgroundColor: row.original.color}}></span>

                    <span>
                        {row.original.name}
                    </span>

                </div>

            );

        },
    },


    /* Description */

    {
        accessorKey: "description",

        header: "Description",

        cell: ({ row }) => (

            <span className="table-role-description">

                {row.original.description}

            </span>

        ),
    },


    /* Users */

    {
        accessorKey: "users",

        header: "Users",

        cell: ({ row }) => (

            <span className="table-role-users">

                {row.original.users}

            </span>

        ),
    },


    /* Actions */

    {
        id: "actions",

        header: "Actions",

        enableSorting: false,

        cell: () => (

            <div className="table-actions">

                <button
                    type="button"
                    aria-label="Edit role"
                >

                    <Pencil
                        size={16}
                        strokeWidth={2.4}
                    />

                </button>


                <button
                    type="button"
                    aria-label="Delete role"
                >

                    <Trash2
                        size={16}
                        strokeWidth={2.4}
                    />

                </button>

            </div>

        ),
    },

];