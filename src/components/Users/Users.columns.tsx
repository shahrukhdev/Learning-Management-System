import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Pencil, Trash2 } from "lucide-react";
import type { UserManagementData } from "./Users.data";

export const userManagementColumns:
    ColumnDef<UserManagementData>[] = [

    /* User */

    {
        accessorKey: "name",

        header: ({ column }) => (

            <button
                type="button"
                className="table-sort-button"
                onClick={() =>
                    column.toggleSorting(
                        column.getIsSorted() === "asc"
                    )
                }
            >

                User

                <ArrowUpDown
                    size={14}
                    strokeWidth={2}
                />

            </button>

        ),

        cell: ({ row }) => {

            const user =
                row.original;

            return (

                <div className="table-user">

                    <div className="table-avatar">

                        {user.image ? (

                            <img
                                src={user.image}
                                alt={user.name}
                            />

                        ) : (

                            user.name.charAt(0)

                        )}

                    </div>


                    <div className="table-user-content">

                        <span className="table-user-name">
                            {user.name}
                        </span>

                        <span className="table-user-email">
                            {user.email}
                        </span>

                    </div>

                </div>

            );
        },
    },


    /* Role */

    {
        accessorKey: "role",

        header: "Role",

        cell: ({ row }) => {

            const user =
                row.original;

            return (

                <div className="table-user-role">

                    <span>
                        {user.role}
                    </span>

                    <small>
                        {user.department}
                    </small>

                </div>

            );

        },
    },


    /* Status */

    {
        accessorKey: "status",

        header: "Status",

        cell: ({ row }) => {

            const status =
                row.original.status;

            return (

                <span
                    className={`table-status ${status}`}
                >

                    <span className="table-status-dot"></span>

                    {status === "active"
                        ? "Active"
                        : "Inactive"
                    }

                </span>

            );

        },
    },


    /* Last Login */

    {
        accessorKey: "lastLogin",

        header: "Last Login",

        cell: ({ row }) => (

            <span className="table-last-login">

                {row.original.lastLogin}

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
                    aria-label="Edit user"
                >

                    <Pencil
                        size={16}
                        strokeWidth={2.4}
                    />

                </button>


                <button
                    type="button"
                    aria-label="Delete user"
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