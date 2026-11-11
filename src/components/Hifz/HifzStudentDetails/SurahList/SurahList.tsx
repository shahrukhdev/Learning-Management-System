import { CheckCircle2, Circle } from "lucide-react";

import type { Surah, SurahStatus, SurahStatuses } from "../QuranMap/QuranMap.data";
import { formatJuzNumbers, type SurahJuzRange } from "../../../../hooks/useQuranData";

import "./SurahList.css";


interface SurahListProps {
    surahs: Surah[];
    // Surah ID -> Juz ranges (from the Juz API)
    surahJuzRanges: Map<number, SurahJuzRange[]>;
    statuses: SurahStatuses;
}

const getStatusLabel = (status: SurahStatus) => {
    switch (status) {
        case "memorised": return "Memorised";
        case "progress": return "In Progress";
        default: return "Not Started";
    }
};

const SurahList = ({ surahs, surahJuzRanges, statuses }: SurahListProps) => {

    return (
        <div className="table-card surah-list-card">

            <div className="table-wrapper surah-list-wrapper">

                <table className="data-table surah-list-table">

                    <thead>
                        <tr>
                            <th className="surah-number-column">
                                #
                            </th>

                            <th>
                                Surah
                            </th>

                            <th className="surah-arabic-column">
                                Arabic
                            </th>

                            <th className="surah-juz-column">
                                Juz
                            </th>

                            <th className="surah-ayahs-column">
                                Ayahs
                            </th>

                            <th className="surah-status-column">
                                Status
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {surahs.map((surah) => {

                            const status = statuses[surah.id] ?? "not-started";

                            return (
                                <tr key={surah.id}>

                                    {/* Number */}

                                    <td className="surah-number">
                                        {surah.number}
                                    </td>


                                    {/* Surah */}

                                    <td className="surah-name">
                                        {surah.name}
                                    </td>


                                    {/* Arabic */}

                                    <td className="surah-arabic" dir="rtl" lang="ar">
                                        {surah.arabic}
                                    </td>


                                    {/* Juz */}

                                    <td className="surah-juz">
                                        {formatJuzNumbers(
                                            surahJuzRanges.get(surah.id)
                                        )}
                                    </td>


                                    {/* Ayahs */}

                                    <td className="surah-ayahs">
                                        {surah.ayahs}
                                    </td>


                                    {/* Status */}

                                    <td className="surah-status-cell">

                                        <span
                                            className={`surah-status-badge ${status}`}
                                        >

                                            {status === "memorised" && (
                                                <CheckCircle2
                                                    size={14}
                                                    strokeWidth={2.5}
                                                />
                                            )}

                                            {status === "progress" && (
                                                <Circle
                                                    size={12}
                                                    strokeWidth={2.5}
                                                />
                                            )}

                                            {status === "not-started" && (
                                                <span className="surah-status-dot" />
                                            )}

                                            {getStatusLabel(status)}

                                        </span>

                                    </td>

                                </tr>
                            );
                        })}
                    </tbody>

                </table>

                <div className="surah-list-scroll-text">
                    ... scrolling ...
                </div>

            </div>

        </div>
    );
};

export default SurahList;