import type { ColumnDef } from "@tanstack/react-table";
import { Pencil, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import type { AcademicClassItem } from "../../types/academicClass.types";

// The API has no class color, so the existing dot colors are reused by
// class ID (stable per class, purely decorative)
const CLASS_DOT_COLORS = ["#4A5D23", "#C9E7A2", "#E2E2C7", "#D4D5C5"];

const getClassDotColor = (classId: number) =>
    CLASS_DOT_COLORS[Math.abs(classId) % CLASS_DOT_COLORS.length];

interface ClassesColumnsOptions {
    onDelete: (classItem: AcademicClassItem) => void;
    // Listing query string (page, per_page, search) so Edit can return to it
    listSearch: string;
}

export const getClassesColumns = ({
    onDelete,
    listSearch,
}: ClassesColumnsOptions): ColumnDef<AcademicClassItem>[] => [
    {
        accessorKey: "name",
        header: "Class Name",
        cell: ({ row }) => (
            <div className="table-role-name">
                <span
                    className="table-role-dot"
                    style={{ backgroundColor: getClassDotColor(row.original.id) }}
                />
                <span>{row.original.name}</span>
            </div>
        ),
    },
    {
        id: "code",
        header: "Code",
        cell: ({ row }) => (
            <span className="table-role-description">
                {row.original.code || "—"}
            </span>
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
        id: "capacity",
        header: "Capacity",
        cell: ({ row }) => (
            <span className="table-role-users">
                {row.original.capacity ?? "—"}
            </span>
        ),
    },
    {
        id: "status",
        header: "Status",
        cell: ({ row }) => {
            const isActive = Boolean(row.original.is_active);

            return (
                <span className={`table-status ${isActive ? "active" : "inactive"}`}>
                    <span className="table-status-dot"></span>
                    {isActive ? "Active" : "Inactive"}
                </span>
            );
        },
    },
    {
        id: "created_at",
        header: "Created",
        // Shown exactly as the API formats it (d-m-Y)
        cell: ({ row }) => (
            <span className="table-last-login">
                {row.original.created_at || "—"}
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
                    to={`/academic/classes/${row.original.id}/edit`}
                    state={{ listSearch }}
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
