import type { ColumnDef } from "@tanstack/react-table";
import { ArrowDown, ArrowUp, Pencil, Trash2 } from "lucide-react";

import AvatarContent from "../Avatar/AvatarContent";
import { resolveImageUrl } from "../../utils/imageUrl";
import type { ManagedUser } from "../../types/user.types";

interface UserColumnsOptions {
    // Year line under the role is only shown on the Student tab
    showYear: boolean;
    // Each action is shown only when its handler is passed
    // ("Edit User" / "Delete User")
    onEdit?: (user: ManagedUser) => void;
    onDelete?: (user: ManagedUser) => void;
}

export const getUserManagementColumns = ({
    showYear,
    onEdit,
    onDelete,
}: UserColumnsOptions): ColumnDef<ManagedUser>[] => ([

    /* User */

    {
        accessorKey: "name",

        header: ({ column }) => {

            const sortState = column.getIsSorted();

            // Same size/stroke as before; the icon shows the active direction
            // (no icon while unsorted)
            const SortIcon =
                sortState === "asc"
                    ? ArrowUp
                    : sortState === "desc"
                        ? ArrowDown
                        : null;

            return (

                <button
                    type="button"
                    className="table-sort-button"
                    // None -> A to Z -> Z to A -> none (newest first)
                    onClick={() => {
                        if (!sortState) column.toggleSorting(false);
                        else if (sortState === "asc") column.toggleSorting(true);
                        else column.clearSorting();
                    }}
                    aria-label={
                        sortState === "asc"
                            ? "Sort users by name, currently A to Z"
                            : sortState === "desc"
                                ? "Sort users by name, currently Z to A"
                                : "Sort users by name, currently newest first"
                    }
                >

                    User

                    {SortIcon && (
                        <SortIcon
                            size={14}
                            strokeWidth={2}
                        />
                    )}

                </button>

            );

        },

        cell: ({ row }) => {

            const user =
                row.original;

            return (

                <div className="table-user">

                    <div className="table-avatar">

                        <AvatarContent
                            src={resolveImageUrl(user.image)}
                            alt={user.name}
                            // API-provided initials (UserResource `initials`)
                            fallback={user.initials}
                        />

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
        id: "role",

        header: "Role",

        cell: ({ row }) => {

            const roleNames =
                row.original.roles.map((role) => role.name);

            return (

                <div className="table-user-role">

                    <span>
                        {roleNames.length > 0 ? roleNames.join(", ") : "—"}
                    </span>

                    {/* Student tab: the API's `year` ("—" when not set,
                        e.g. students created before the field existed) */}
                    {showYear && (
                        <small>
                            Year: {row.original.year ?? "—"}
                        </small>
                    )}

                </div>

            );

        },
    },


    /* Status */

    {
        id: "status",

        header: "Status",

        cell: ({ row }) => {

            const status =
                row.original.is_active ? "active" : "inactive";

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
        id: "lastLogin",

        header: "Last Login",

        // Shown exactly as the API formats it; "-" only if the field is missing
        cell: ({ row }) => (

            <span className="table-last-login">

                {row.original.last_login || "-"}

            </span>

        ),
    },


    /* Actions */

    {
        id: "actions",

        header: "Actions",

        enableSorting: false,

        cell: ({ row }) => (

            <div className="table-actions">

                {onEdit && (
                    <button
                        type="button"
                        aria-label={`Edit ${row.original.name}`}
                        onClick={() => onEdit(row.original)}
                    >

                        <Pencil
                            size={16}
                            strokeWidth={2.4}
                        />

                    </button>
                )}


                {onDelete && (
                    <button
                        type="button"
                        aria-label={`Delete ${row.original.name}`}
                        onClick={() => onDelete(row.original)}
                    >

                        <Trash2
                            size={16}
                            strokeWidth={2.4}
                        />

                    </button>
                )}

            </div>

        ),
    },

] as ColumnDef<ManagedUser>[])
    // No Actions column when no action is allowed
    .filter((column) => column.id !== "actions" || onEdit !== undefined || onDelete !== undefined);
