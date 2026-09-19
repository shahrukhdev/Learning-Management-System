import "./HifzStudentStates.css";

const states = [
    {
        value: "25",
        label: "MEMORISED",
    },
    {
        value: "12",
        label: "IN PROGRESS",
    },
    {
        value: "77",
        label: "REMAINING",
    },
    {
        value: "25/604",
        label: "PAGES",
    },
];

const progress = [
    {
        label: "Surahs",
        current: 25,
        total: 114,
    },
    {
        label: "Pages",
        current: 25,
        total: 604,
    },
];

const HifzStudentStates = () => {
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

            {/* Student Progress */}
            <div className="hifz-student-progress">

                {progress.map((item) => {

                    const percentage = Math.round(
                        (item.current / item.total) * 100
                    );

                    return (
                        <div
                            className="hifz-student-progress-item"
                            key={item.label}
                        >

                            <div className="hifz-student-progress-header">

                                <span className="hifz-student-progress-label">
                                    {item.label}
                                </span>

                                <span className="hifz-student-progress-value">
                                    {item.current}/{item.total} ({percentage}%)
                                </span>

                            </div>

                            <div className="hifz-student-progress-track">

                                <div
                                    className="hifz-student-progress-bar"
                                    style={{
                                        width: `${percentage}%`,
                                    }}
                                />

                            </div>

                        </div>
                    );
                })}

            </div>

        </div>
    );
};

export default HifzStudentStates;