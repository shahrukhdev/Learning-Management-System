import type { Juz, SurahStatus, SurahStatuses } from "../../../Hifz/HifzStudentDetails/QuranMap/QuranMap.data";

import "../../../Hifz/HifzStudentDetails/QuranMap/QuranMap.css"
import "./StudentQuranMap.css";

interface StudentQuranMapProps {
    // Juz rows built from the API's `juz_ranges`
    juz: Juz[];
    // Surah ID -> status (from GET /v1/my-hifz `quran_map`)
    statuses: SurahStatuses;
}

// Read only: no tap-to-edit for students
const StudentQuranMap = ({ juz, statuses }: StudentQuranMapProps) => {

    const getStatus = (surahId: number): SurahStatus => {
        return statuses[surahId] ?? "not-started";
    };

    return (
        <div className="quran-map-content">

            <div className="quran-map-toolbar">

                <div className="quran-map-legend">

                    <span>
                        <i className="map-legend-dot memorised" />
                        Memorised
                    </span>

                    <span>
                        <i className="map-legend-dot progress" />
                        In Progress
                    </span>

                    <span>
                        <i className="map-legend-dot not-started" />
                        Not Started
                    </span>

                </div>

                <span className="tap-to-edit">
                    Your Hifz Progress
                </span>

            </div>

            <div className="juz-map">

                {juz.map((row) => (
                    <div
                        className="juz-map-row"
                        key={row.number}
                    >

                        <div className="juz-label">
                            JUZ {row.number}
                        </div>

                        <div className="juz-surahs">

                            {row.surah_ranges.map(({ surah }) => {

                                const status = getStatus(surah.id);

                                return (
                                    <span
                                        key={`${row.number}-${surah.id}`}
                                        title={`${surah.number}. ${surah.name} - ${status}`}
                                        className={`quran-surah-number ${status}`}
                                    >
                                        {surah.number}
                                    </span>
                                );
                            })}

                        </div>

                    </div>
                ))}

            </div>

        </div>
    );
};

export default StudentQuranMap;
