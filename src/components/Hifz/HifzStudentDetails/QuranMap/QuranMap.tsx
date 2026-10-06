import { useMemo, useState } from "react";
import "./QuranMap.css";

import { DEFAULT_STATUS, JUZ_DATA, SURAH_DATA, type Surah, type SurahStatus } from "./QuranMap.data";

import QuranMapPopup from "./QuranMapPopup";

interface SelectedSurah {
    surah: Surah;
    juzNumber: number;
}

export default function QuranMap() {

    const [statuses, setStatuses] = useState<Record<number, SurahStatus>>(DEFAULT_STATUS);

    const [selectedSurah, setSelectedSurah] = useState<SelectedSurah | null>(null);

    const [selectedStatus, setSelectedStatus] = useState<SurahStatus>("not-started");

    /*
     * Create a quick lookup map:
     * Surah number -> Surah data
     */
    const surahMap = useMemo(() => {
        return new Map(
            SURAH_DATA.map((surah) => [surah.number, surah])
        );
    }, []);

    /*
     * Get current status of a Surah
     */
    const getStatus = (surahNumber: number): SurahStatus => {
        return statuses[surahNumber] ?? "not-started";
    };

    /*
     * Open popup
     */
    const handleSurahClick = ( surah: Surah, juzNumber: number ) => {
        setSelectedSurah({
            surah,
            juzNumber,
        });

        setSelectedStatus(
            statuses[surah.number] ?? "not-started"
        );
    };

    /*
     * Update Surah status
     */
    const handleUpdate = () => {
        if (!selectedSurah) return;

        setStatuses((current) => ({
            ...current,
            [selectedSurah.surah.number]: selectedStatus,
        }));

        setSelectedSurah(null);
    };

    /*
     * Close popup
     */
    const handleClosePopup = () => {
        setSelectedSurah(null);
    };

    return (
        <>
            <div className="quran-map-content">

                {/* ================================
                    TOP LEGEND
                ================================= */}

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
                        Tap to edit
                    </span>

                </div>


                {/* ================================
                    JUZ MAP
                ================================= */}

                <div className="juz-map">

                    {JUZ_DATA.map((juz) => {

                        const surahs = juz.surahNumbers
                            .map((number) =>
                                surahMap.get(number)
                            )
                            .filter(Boolean) as Surah[];

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

                                        const status =
                                            getStatus(
                                                surah.number
                                            );

                                        return (
                                            <button
                                                key={surah.number}
                                                type="button"
                                                title={`${surah.number}. ${surah.name}`}
                                                className={`quran-surah-number ${status}`}
                                                onClick={() =>
                                                    handleSurahClick(
                                                        surah,
                                                        juz.number
                                                    )
                                                }
                                            >
                                                {surah.number}
                                            </button>
                                        );
                                    })}

                                </div>

                            </div>
                        );
                    })}

                </div>

            </div>


            {/* ================================
                QURAN MAP POPUP
            ================================= */}

            {selectedSurah && (
                <QuranMapPopup
                    selectedSurah={selectedSurah}
                    selectedStatus={selectedStatus}
                    onStatusChange={setSelectedStatus}
                    onClose={handleClosePopup}
                    onUpdate={handleUpdate}
                />
            )}
        </>
    );
}