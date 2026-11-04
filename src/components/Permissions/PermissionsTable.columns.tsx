import type { ColumnDef } from "@tanstack/react-table";
import { Pencil, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import type { PermissionListItem } from "../../types/permission.types";

// The API has no permission color, so the existing dot colors are reused by
// permission ID (stable per permission, purely decorative)
const PERMISSION_DOT_COLORS = ["#4A5D23", "#C9E7A2", "#E2E2C7", "#D4D5C5"];

const getPermissionDotColor = (permissionId: number) =>
    PERMISSION_DOT_COLORS[Math.abs(permissionId) % PERMISSION_DOT_COLORS.length];

// Modules column is intentionally static for now (no dynamic module mapping):
// the same placeholder values as before, repeated by row position
const STATIC_MODULE_COUNTS = [4, 3, 2, 5];

export const permissionsColumns: ColumnDef<PermissionListItem>[] = [
    {
        accessorKey: "name",
        header: "Permission Name",
        cell: ({ row }) => (
            <div className="table-role-name">
                <span
                    className="table-role-dot"
                    style={{ backgroundColor: getPermissionDotColor(row.original.id) }}
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
                {row.original.description || "—"}
            </span>
        ),
    },
    {
        id: "modules",
        header: "Modules",
        cell: ({ row }) => (
            <span className="table-role-users">
                {STATIC_MODULE_COUNTS[row.index % STATIC_MODULE_COUNTS.length]}
            </span>
        ),
    },
    {
        id: "actions",
        header: "Actions",
        enableSorting: false,
        cell: ({ row }) => (
            <div className="table-actions">
                <Link
                    to={`/system/permissions/${row.original.id}/edit`}
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
