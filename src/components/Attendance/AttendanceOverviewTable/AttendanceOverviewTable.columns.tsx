import type { ColumnDef } from "@tanstack/react-table";

import { ChevronDown, ChevronUp, ChevronsUpDown } from "lucide-react";

import type { StudentsAttendanceOverview } from "./AttendanceOverviewTable.types";

import AttendanceDot from "./AttendanceDot";

export const attendanceOverviewColumns: ColumnDef<StudentsAttendanceOverview>[] = [
    {
        accessorKey: "studentName",

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
                <span>Student</span>

                {column.getIsSorted() === "asc" && (
                    <ChevronUp size={14} />
                )}

                {column.getIsSorted() === "desc" && (
                    <ChevronDown size={14} />
                )}

                {!column.getIsSorted() && (
                    <ChevronsUpDown size={14} />
                )}
            </button>
        ),

        cell: ({ row }) => {
            const student = row.original;

            return (
                <div className="overview-student">
                    <img
                        className="student-img"
                        src={student.studentImage}
                        alt={student.studentName}
                    />

                    <span className="student-name">
                        {student.studentName}
                    </span>
                </div>
            );
        },
    },

    {
        accessorKey: "attendance.mon",
        header: "Mon (7)",
        cell: ({ row }) => (
            <AttendanceDot
                status={row.original.attendance.mon}
            />
        ),
    },

    {
        accessorKey: "attendance.tue",
        header: "Tue (8)",
        cell: ({ row }) => (
            <AttendanceDot
                status={row.original.attendance.tue}
            />
        ),
    },

    {
        accessorKey: "attendance.wed",
        header: "Wed (9)",
        cell: ({ row }) => (
            <AttendanceDot
                status={row.original.attendance.wed}
            />
        ),
    },

    {
        accessorKey: "attendance.thu",
        header: "Thu (10)",
        cell: ({ row }) => (
            <AttendanceDot
                status={row.original.attendance.thu}
            />
        ),
    },

    {
        accessorKey: "attendance.fri",
        header: "Fri (11)",
        cell: ({ row }) => (
            <AttendanceDot
                status={row.original.attendance.fri}
            />
        ),
    },

    {
        accessorKey: "rate",

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
                <span>Rate</span>

                {column.getIsSorted() === "asc" && (
                    <ChevronUp size={14} />
                )}

                {column.getIsSorted() === "desc" && (
                    <ChevronDown size={14} />
                )}

                {!column.getIsSorted() && (
                    <ChevronsUpDown size={14} />
                )}
            </button>
        ),

        cell: ({ row }) => {
            const rate = row.original.rate;

            return (
                <span
                    className={`attendance-rate ${
                        rate < 70 ? "low" : ""
                    }`}
                >
                    {rate}%
                </span>
            );
        },
    },
];