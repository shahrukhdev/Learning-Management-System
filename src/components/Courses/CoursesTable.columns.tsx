import type { ColumnDef } from "@tanstack/react-table";
import { Pencil, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import type { CourseItem } from "../../types/course.types";

// The API has no course color, so the existing dot colors are reused by
// course ID (stable per course, purely decorative)
const COURSE_DOT_COLORS = ["#4A5D23", "#C9E7A2", "#E2E2C7", "#D4D5C5"];

const getCourseDotColor = (courseId: number) =>
    COURSE_DOT_COLORS[Math.abs(courseId) % COURSE_DOT_COLORS.length];

interface CoursesColumnsOptions {
    // Delete is shown only when passed; Edit only when canEdit
    onDelete?: (course: CourseItem) => void;
    canEdit: boolean;
    // Listing query string (page, per_page, search) so Edit can return to it
    listSearch: string;
}

export const getCoursesColumns = ({
    onDelete,
    canEdit,
    listSearch,
}: CoursesColumnsOptions): ColumnDef<CourseItem>[] => ([
    {
        accessorKey: "name",
        header: "Course Name",
        cell: ({ row }) => (
            <div className="table-role-name">
                <span className="table-role-dot" style={{ backgroundColor: getCourseDotColor(row.original.id) }} />
                <span>{row.original.name}</span>
            </div>
        ),
    },
    {
        id: "code",
        header: "Code",
        cell: ({ row }) => (
            <span className="table-role-description">{row.original.code || "—"}</span>
        ),
    },
    {
        id: "academic_classes",
        header: "Academic Classes",
        // Names come with each course (no per-row requests)
        cell: ({ row }) => {
            const names = (row.original.academic_classes ?? []).map((academicClass) => academicClass.name);

            return (
                <span className="table-role-description">
                    {names.length > 0 ? names.join(", ") : "—"}
                </span>
            );
        },
    },
    {
        accessorKey: "description",
        header: "Description",
        cell: ({ row }) => (
            <span className="table-role-description">{row.original.description || "—"}</span>
        ),
    },
    {
        id: "duration",
        header: "Duration",
        cell: ({ row }) => (
            <span className="table-role-users">{row.original.duration ?? "—"}</span>
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
            <span className="table-last-login">{row.original.created_at || "—"}</span>
        ),
    },
    {
        id: "actions",
        header: "Actions",
        enableSorting: false,
        cell: ({ row }) => (
            <div className="table-actions">
                {canEdit && (
                    <Link
                        to={`/academic/courses/${row.original.id}/edit`}
                        state={{ listSearch }}
                        aria-label={`Edit ${row.original.name}`}
                    >
                        <Pencil size={16} strokeWidth={2.4} />
                    </Link>
                )}
                {onDelete && (
                    <button
                        type="button"
                        aria-label={`Delete ${row.original.name}`}
                        onClick={() => onDelete(row.original)}
                    >
                        <Trash2 size={16} strokeWidth={2.4} />
                    </button>
                )}
            </div>
        ),
    },
] as ColumnDef<CourseItem>[])
    // No Actions column when no action is allowed
    .filter((column) => column.id !== "actions" || canEdit || onDelete !== undefined);
