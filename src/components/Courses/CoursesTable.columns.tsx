import type { ColumnDef } from "@tanstack/react-table";
import { Pencil, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import type { Course } from "./CoursesTable.data";

export const coursesColumns: ColumnDef<Course>[] = [
    {
        accessorKey: "name",
        header: "Course Name",
        cell: ({ row }) => (
            <div className="table-role-name">
                <span className="table-role-dot" style={{ backgroundColor: row.original.color }} />
                <span>{row.original.name}</span>
            </div>
        ),
    },
    {
        accessorKey: "description",
        header: "Description",
        cell: ({ row }) => (
            <span className="table-role-description">{row.original.description}</span>
        ),
    },
    {
        accessorKey: "lessons",
        header: "Lessons",
        cell: ({ row }) => (
            <span className="table-role-users">{row.original.lessons}</span>
        ),
    },
    {
        id: "actions",
        header: "Actions",
        enableSorting: false,
        cell: ({ row }) => (
            <div className="table-actions">
                <Link
                    to={`/admin/dashboard/academic/courses/${row.original.id}/edit`}
                    aria-label={`Edit ${row.original.name}`}
                >
                    <Pencil size={16} strokeWidth={2.4} />
                </Link>
                <button type="button" aria-label={`Delete ${row.original.name}`}>
                    <Trash2 size={16} strokeWidth={2.4} />
                </button>
            </div>
        ),
    },
];
