import "./QuranProgressOverview.css";

interface QuranProgress {
    id: number;
    title: string;
    progress: number;
    status: "on-track" | "needs-attension";
}

const quranProgress: QuranProgress[] =[
    {
        id: 1,
        title: "Hifz Class A",
        progress: 88,
        status: "on-track",
    },
    {
        id: 2,
        title: "Noorani Qaida 1",
        progress: 72,
        status: "on-track",
    },
    {
        id: 3,
        title: "Islamic Studies - Adv",
        progress: 50,
        status: "needs-attension",
    }
]

const QuranProgressOverview = () => {
    return (
        <div className="quran-progress-overview dashboard-box">

            {/* Header */}
            <div className="quran-progress-header">

                <div className="quran-progress-heading">
                    <h2 className="dash-box-title ">
                        Quran Progress Overview
                    </h2>

                    <p className="quran-progress-subtitle m-0">
                        Class-wise proficiency tracking
                    </p>
                </div>

                {/* Legend */}
                <div className="quran-progress-legend">

                    <span className="progress-legend-item">
                        <span className="progress-legend-dot on-track"></span>
                        On Track
                    </span>

                    <span className="progress-legend-item">
                        <span className="progress-legend-dot needs-attention"></span>
                        Needs Attention
                    </span>

                </div>

            </div>

            {/* Progress List */}
            <div className="quran-progress-list">

                {quranProgress.map((item) => (
                    <div
                        className="quran-progress-item"
                        key={item.id}
                    >

                        {/* Item Header */}
                        <div className="quran-progress-item-header">

                            <h3 className="quran-progress-title sm-title">
                                {item.title}
                            </h3>

                            <span className="quran-progress-value">
                                {item.progress}% {item.status}
                            </span>

                        </div>

                        {/* Progress Bar */}
                        <div className="quran-progress-bar">

                            <div
                                className="quran-progress-fill"
                                style={{
                                    width: `${item.progress}%`,
                                }}
                            />

                        </div>

                    </div>
                ))}

            </div>

        </div>
    );
};

export default QuranProgressOverview;