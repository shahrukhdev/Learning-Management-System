import type { AttendanceStatus } from "./AttendanceOverviewTable.types";

const STATUS_LABELS: Record<AttendanceStatus, string> = {
    present: "Present",
    absent: "Absent",
    late: "Late",
    "not-marked": "Not Marked",
};

interface AttendanceDotProps {
    status: AttendanceStatus;
}

const AttendanceDot = ({
    status,
}: AttendanceDotProps) => {
    return (
        <span
            className={`attendance-dot ${status}`}
            title={STATUS_LABELS[status]}
            role="img"
            aria-label={STATUS_LABELS[status]}
        />
    );
};

export default AttendanceDot;
