import "../../../Hifz/HifzStudentDetails/HifzStudentStates/HifzStudentStates.css";

import type { HifzStatistics } from "../../../../types/hifzStatistics.types";

interface StudentHifzStatesProps {
    // From GET /v1/my-hifz `statistics` (null until loaded)
    statistics: HifzStatistics | null;
}

// Values exactly as returned by the API (percentages are not rounded)
const StudentHifzStates = ({ statistics }: StudentHifzStatesProps) => {

    const show = (value: number | undefined) => (statistics ? String(value ?? 0) : "—");

    const states = [
        {
            value: show(statistics?.memorised),
            label: "MEMORISED",
        },
        {
            value: show(statistics?.in_progress),
            label: "IN PROGRESS",
        },
        {
            value: show(statistics?.remaining),
            label: "REMAINING",
        },
        {
            value: statistics ? `${statistics.pages.completed}/${statistics.pages.total}` : "—",
            label: "PAGES",
        },
    ];

    const progress = [
        {
            label: "Surahs",
            current: statistics?.surahs.completed ?? 0,
            total: statistics?.surahs.total ?? 0,
            percentage: statistics?.surahs.percentage ?? 0,
        },
        {
            label: "Pages",
            current: statistics?.pages.completed ?? 0,
            total: statistics?.pages.total ?? 0,
            percentage: statistics?.pages.percentage ?? 0,
        },
    ];

    return (
        <div className="hifz-student-states-wrapper">

            <div className="hifz-student-states">

                {states.map((state) => (
                    <div
                        className="hifz-student-state"
                        key={state.label}
                    >
                        <h3 className="hifz-student-state-value">
                            {state.value}
                        </h3>

                        <span className="hifz-student-state-label">
                            {state.label}
                        </span>
                    </div>
                ))}

            </div>

            <div className="hifz-student-progress">

                {progress.map((item) => (
                    <div
                        className="hifz-student-progress-item"
                        key={item.label}
                    >
                        <div className="hifz-student-progress-header">

                            <span className="hifz-student-progress-label">
                                {item.label}
                            </span>

                            <span className="hifz-student-progress-value">
                                {statistics
                                    ? `${item.current}/${item.total} (${item.percentage}%)`
                                    : "—"}
                            </span>

                        </div>

                        <div className="hifz-student-progress-track">
                            <div
                                className="hifz-student-progress-bar"
                                style={{
                                    width: `${Math.min(Math.max(item.percentage, 0), 100)}%`,
                                }}
                            />
                        </div>

                    </div>
                ))}

            </div>

        </div>
    );
};

export default StudentHifzStates;
