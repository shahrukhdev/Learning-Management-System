import type { ColumnDef } from "@tanstack/react-table";

import {
    ArrowUpDown,
    Pencil,
    Trash2,
} from "lucide-react";

import type {
    UserManagementData,
} from "./Users.data";

export const userManagementColumns: ColumnDef<UserManagementData>[] = [

    {
        accessorKey: "name",

        header: ({ column }) => (
            <button
                type="button"
                className="user-table-sort-button"
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

            const user = row.original;

            return (
                <div className="user-table-user">

                    <div className="user-table-avatar">
                        {user.image ? (
                            <img
                                src={user.image}
                                alt={user.name}
                            />
                        ) : (
                            user.name.charAt(0)
                        )}
                    </div>

                    <div className="user-table-user-content">

                        <span className="user-table-user-name">
                            {user.name}
                        </span>

                        <span className="user-table-user-email">
                            {user.email}
                        </span>

                    </div>

                </div>
            );
        },
    },


    {
        accessorKey: "role",

        header: "Role",

        cell: ({ row }) => {

            const user = row.original;

            return (
                <div className="user-table-role">

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


    {
        accessorKey: "status",

        header: "Status",

        cell: ({ row }) => {

            const status = row.original.status;

            return (
                <span
                    className={`user-status ${status}`}
                >

                    <span className="user-status-dot"></span>

                    {status === "active"
                        ? "Active"
                        : "Inactive"
                    }

                </span>
            );
        },
    },


    {
        accessorKey: "lastLogin",

        header: "Last Login",

        cell: ({ row }) => (
            <span className="user-last-login">
                {row.original.lastLogin}
            </span>
        ),
    },


    {
        id: "actions",

        header: "Actions",

        enableSorting: false,

        cell: () => (
            <div className="user-table-actions">

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