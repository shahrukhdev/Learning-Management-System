import type { AttendanceStatus } from "./AttendanceOverviewTable.types";

interface AttendanceDotProps {
    status: AttendanceStatus;
}

const AttendanceDot = ({
    status,
}: AttendanceDotProps) => {
    return (
        <span
            className={`attendance-dot ${status}`}
            title={status}
        />
    );
};

export default AttendanceDot;