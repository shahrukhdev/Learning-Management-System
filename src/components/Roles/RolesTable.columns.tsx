import type { ColumnDef } from "@tanstack/react-table";
import { Pencil, Trash2 } from "lucide-react";
import type { RoleListItem } from "../../types/role.types";
import { Link } from "react-router-dom";

// The API has no role color, so the existing dot colors are reused by role ID
// (stable per role, purely decorative)
const ROLE_DOT_COLORS = ["#4A5D23", "#C9E7A2", "#E2E2C7", "#D4D5C5"];

const getRoleDotColor = (roleId: number) =>
    ROLE_DOT_COLORS[Math.abs(roleId) % ROLE_DOT_COLORS.length];

interface RolesColumnsOptions {
    onDelete: (role: RoleListItem) => void;
}

export const getRolesColumns = ({
    onDelete,
}: RolesColumnsOptions): ColumnDef<RoleListItem>[] => [

    /* Role Name */

    {
        accessorKey: "name",

        header: "Role Name",

        cell: ({ row }) => {

            return (

                <div className="table-role-name">

                    <span className="table-role-dot" style={{backgroundColor: getRoleDotColor(row.original.id)}}></span>

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

                {row.original.description || "—"}

            </span>

        ),
    },


    /* Users */

    {
        accessorKey: "users_count",

        header: "Users",

        // Count comes straight from the API
        cell: ({ row }) => (

            <span className="table-role-users">

                {row.original.users_count}

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

                {/* Edit Role page (name + description). The permission
                    matrix screen stays at /system/roles/:id/edit. */}
                <Link
                    to={`/system/roles/${row.original.id}/update`}
                    aria-label={`Edit ${row.original.name}`}
                >
                    <Pencil
                        size={16}
                        strokeWidth={2.4}
                    />

                </Link>


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

            </div>

        ),
    },

];
