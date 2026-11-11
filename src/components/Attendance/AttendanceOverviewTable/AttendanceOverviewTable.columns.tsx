import type { ColumnDef } from "@tanstack/react-table";

import { ChevronDown, ChevronUp, ChevronsUpDown } from "lucide-react";
import type { StudentsAttendanceOverview } from "./AttendanceOverviewTable.types";
import AttendanceDot from "./AttendanceDot";
import AvatarContent from "../../Avatar/AvatarContent";
import { resolveImageUrl } from "../../../utils/imageUrl";
import { addDays, fromYmd } from "../attendanceDates";
import type { WeekdayKey } from "../../../types/attendance.types";
import dummyImg from "../../../assets/images/student-dummy-img.png";

const WEEKDAYS: { key: WeekdayKey; label: string }[] = [
    { key: "mon", label: "Mon" },
    { key: "tue", label: "Tue" },
    { key: "wed", label: "Wed" },
    { key: "thu", label: "Thu" },
    { key: "fri", label: "Fri" },
];


// Day headers show the date of the selected week, e.g. "Mon (9)"
export const getAttendanceOverviewColumns = (
    weekStart: string
): ColumnDef<StudentsAttendanceOverview>[] => [

    /* Student */

    {
        accessorKey: "student_name",

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

                <span>
                    Student
                </span>


                {column.getIsSorted() === "asc" && (

                    <ChevronUp
                        size={14}
                    />

                )}


                {column.getIsSorted() === "desc" && (

                    <ChevronDown
                        size={14}
                    />

                )}


                {!column.getIsSorted() && (

                    <ChevronsUpDown
                        size={14}
                    />

                )}

            </button>

        ),

        cell: ({ row }) => {

            const student =
                row.original;

            return (

                <div className="table-attendance-student">

                    <AvatarContent
                        src={resolveImageUrl(student.student_image)}
                        alt={student.student_name}
                        fallback={<img src={dummyImg} alt={student.student_name} />}
                    />

                    <span className="table-attendance-student-name">

                        {student.student_name}

                    </span>

                </div>

            );

        },
    },


    /* Monday - Friday */

    ...WEEKDAYS.map(({ key, label }, index): ColumnDef<StudentsAttendanceOverview> => ({
        id: `attendance.${key}`,
        header: `${label} (${fromYmd(addDays(weekStart, index)).getDate()})`,
        enableSorting: false,
        cell: ({ row }) => <AttendanceDot status={row.original.attendance[key]} />,
    })),


    /* Rate */

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

                <span>
                    Rate
                </span>


                {column.getIsSorted() === "asc" && (

                    <ChevronUp
                        size={14}
                    />

                )}


                {column.getIsSorted() === "desc" && (

                    <ChevronDown
                        size={14}
                    />

                )}


                {!column.getIsSorted() && (

                    <ChevronsUpDown
                        size={14}
                    />

                )}

            </button>

        ),

        cell: ({ row }) => {

            const rate =
                row.original.rate;

            // Shown as returned by the API (not recalculated)
            if (rate === null) {
                return <span className="attendance-rate">—</span>;
            }

            return (

                <span
                    className={`attendance-rate ${
                        rate < 70
                            ? "low"
                            : ""
                    }`}
                >

                    {rate}%

                </span>

            );

        },
    },

];