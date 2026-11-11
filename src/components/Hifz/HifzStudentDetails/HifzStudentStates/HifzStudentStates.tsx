import "./HifzStudentStates.css";
import type { HifzStatistics } from "../../../../types/hifzStatistics.types";

interface HifzStudentStatesProps {
    // GET /v1/students/{id}/hifz-statistics, shown exactly as returned.
    // null while loading or after an error (never shown as zeros).
    statistics: HifzStatistics | null;
    isLoading: boolean;
    error: string | null;
    onRetry: () => void;
}

const PLACEHOLDER = "—";

const HifzStudentStates = ({
    statistics,
    isLoading,
    error,
    onRetry,
}: HifzStudentStatesProps) => {

    const show = (value: number | undefined) =>
        value === undefined ? PLACEHOLDER : String(value);

    // Page figures are unchanged (no API provides page data)
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
            value: "25/604",
            label: "PAGES",
        },
    ];

    const surahs = statistics?.surahs ?? null;

    const progress = [
        {
            label: "Surahs",
            // API values: completed / total (percentage)
            text: surahs
                ? `${surahs.completed}/${surahs.total} (${surahs.percentage}%)`
                : PLACEHOLDER,
            percentage: surahs ? surahs.percentage : 0,
        },
        {
            label: "Pages",
            text: `25/604 (${Math.round((25 / 604) * 100)}%)`,
            percentage: Math.round((25 / 604) * 100),
        },
    ];

    return (

        <div
            className={`hifz-student-states-wrapper ${isLoading && !statistics ? "is-loading" : ""}`}
            aria-busy={isLoading}
        >

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

            {error && (
                <div className="hifz-student-states-error" role="alert">
                    <span>{error}</span>
                    <button type="button" className="table-retry-button" onClick={onRetry}>
                        Try again
                    </button>
                </div>
            )}

            {/* Student Progress */}
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
                                {item.text}
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

export default HifzStudentStates;
