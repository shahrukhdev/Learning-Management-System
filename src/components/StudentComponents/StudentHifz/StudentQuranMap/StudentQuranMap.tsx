import { JUZ_DATA, SURAH_DATA, type SurahStatus, type Surah } from "../../../Hifz/HifzStudentDetails/QuranMap/QuranMap.data";

import "../../../Hifz/HifzStudentDetails/QuranMap/QuranMap.css"
import "./StudentQuranMap.css";

interface StudentQuranMapProps {
    statuses: Record<number, SurahStatus>;
}

const StudentQuranMap = ({ statuses }: StudentQuranMapProps) => {

    const surahMap = new Map<number, Surah>(
        SURAH_DATA.map((surah) => [
            surah.number,
            surah,
        ])
    );

    const getStatus = (surahNumber: number): SurahStatus => {
        return statuses[surahNumber] ?? "not-started";
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

                {JUZ_DATA.map((juz) => {

                    const surahs = juz.surahNumbers
                        .map((number) => surahMap.get(number))
                        .filter(
                            (surah): surah is Surah =>
                                surah !== undefined
                        );

                    return (
                        <div
                            className="juz-map-row"
                            key={juz.number}
                        >

                            <div className="juz-label">
                                JUZ {juz.number}
                            </div>

                            <div className="juz-surahs">

                                {surahs.map((surah) => {

                                    const status = getStatus(
                                        surah.number
                                    );

                                    return (
                                        <span
                                            key={surah.number}
                                            title={`${surah.number}. ${surah.name} - ${status}`}
                                            className={`quran-surah-number ${status}`}
                                        >
                                            {surah.number}
                                        </span>
                                    );
                                })}

                            </div>

                        </div>
                    );
                })}

            </div>

        </div>
    );
};

export default StudentQuranMap;
