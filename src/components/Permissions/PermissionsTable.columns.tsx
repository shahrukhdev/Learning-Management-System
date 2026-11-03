import type { ColumnDef } from "@tanstack/react-table";
import { Pencil, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import type { Permission } from "./PermissionsTable.data";

export const permissionsColumns: ColumnDef<Permission>[] = [
    {
        accessorKey: "name",
        header: "Permission Name",
        cell: ({ row }) => (
            <div className="table-role-name">
                <span
                    className="table-role-dot"
                    style={{ backgroundColor: row.original.color }}
                />
                <span>{row.original.name}</span>
            </div>
        ),
    },
    {
        accessorKey: "description",
        header: "Description",
        cell: ({ row }) => (
            <span className="table-role-description">
                {row.original.description}
            </span>
        ),
    },
    {
        accessorKey: "modules",
        header: "Modules",
        cell: ({ row }) => (
            <span className="table-role-users">{row.original.modules}</span>
        ),
    },
    {
        id: "actions",
        header: "Actions",
        enableSorting: false,
        cell: ({ row }) => (
            <div className="table-actions">
                <Link
                    to={`/admin/dashboard/system/permissions/${row.original.id}/edit`}
                    aria-label={`Edit ${row.original.name}`}
                >
                    <Pencil size={16} strokeWidth={2.4} />
                </Link>
                <button
                    type="button"
                    aria-label={`Delete ${row.original.name}`}
                >
                    <Trash2 size={16} strokeWidth={2.4} />
                </button>
            </div>
        ),
    },
];
