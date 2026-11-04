import type { ColumnDef } from "@tanstack/react-table";
import { Pencil, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import type { PermissionListItem } from "../../types/permission.types";

// The API has no permission color, so the existing dot colors are reused by
// permission ID (stable per permission, purely decorative)
const PERMISSION_DOT_COLORS = ["#4A5D23", "#C9E7A2", "#E2E2C7", "#D4D5C5"];

const getPermissionDotColor = (permissionId: number) =>
    PERMISSION_DOT_COLORS[Math.abs(permissionId) % PERMISSION_DOT_COLORS.length];

interface PermissionsColumnsOptions {
    onDelete: (permission: PermissionListItem) => void;
    // Module ID -> name, from the shared GET /v1/modules list
    moduleNames: Map<number, string>;
}

// Prefer the module embedded in the permission; otherwise look up module_id
// in the modules list (one request for the whole table, none per row)
const getModuleName = (permission: PermissionListItem, moduleNames: Map<number, string>) => {
    if (permission.module?.name) return permission.module.name;

    const moduleId = permission.module_id ?? permission.module?.id;

    return moduleId != null ? moduleNames.get(moduleId) : undefined;
};

export const getPermissionsColumns = ({
    onDelete,
    moduleNames,
}: PermissionsColumnsOptions): ColumnDef<PermissionListItem>[] => [
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
        id: "module",
        header: "Module",
        cell: ({ row }) => (
            <span className="table-role-description">
                {getModuleName(row.original, moduleNames) || "—"}
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
                    onClick={() => onDelete(row.original)}
                >
                    <Trash2 size={16} strokeWidth={2.4} />
                </button>
            </div>
        ),
    },
];
