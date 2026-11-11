import { useState } from "react";
import type { Juz, JuzSurahRange, Surah, SurahStatus, SurahStatuses } from "./QuranMap.data";
import type { SurahJuzRange } from "../../../../hooks/useQuranData";
import QuranMapPopup from "./QuranMapPopup";
import "./QuranMap.css";

// The Surah range that was tapped, with the Juz row it was tapped in
export interface SelectedSurah {
    range: JuzSurahRange;
    juz: Juz;
}

// Outcome of saving a status from the popup
export type SurahStatusSaveResult =
    | { outcome: "done" } // saved (or nothing to change): close the popup
    | { outcome: "confirm" } // a delete confirmation was opened: close the popup
    | { outcome: "error"; message: string | null }; // stay open (inline message, if any)

interface QuranMapProps {
    juz: Juz[];
    // Surah ID -> every Juz range it appears in (for Surahs spanning Juz)
    surahJuzRanges: Map<number, SurahJuzRange[]>;
    // Surah ID -> the selected student's status (from the progress API)
    statuses: SurahStatuses;
    // False until the student's progress has loaded (avoids duplicate adds)
    canEdit: boolean;
    onSaveStatus: (surah: Surah, status: SurahStatus) => Promise<SurahStatusSaveResult>;
}

export default function QuranMap({
    juz,
    surahJuzRanges,
    statuses,
    canEdit,
    onSaveStatus,
}: QuranMapProps) {
    const [selectedSurah, setSelectedSurah] =
        useState<SelectedSurah | null>(null);

    const [selectedStatus, setSelectedStatus] =
        useState<SurahStatus>("not-started");

    const [isSaving, setIsSaving] = useState(false);

    const [saveError, setSaveError] = useState<string | null>(null);

    const getStatus = (surahId: number): SurahStatus => {
        return statuses[surahId] ?? "not-started";
    };

    const handleSurahClick = (range: JuzSurahRange, juzItem: Juz) => {
        if (!canEdit) return;

        setSelectedSurah({
            range,
            juz: juzItem,
        });

        setSelectedStatus(
            statuses[range.surah.id] ?? "not-started"
        );

        setSaveError(null);
    };

    const handleStatusChange = (status: SurahStatus) => {
        setSelectedStatus(status);

        // Clear the inline error once the choice is changed
        setSaveError(null);
    };

    const handleUpdate = async () => {
        if (!selectedSurah || isSaving) return;

        setIsSaving(true);
        setSaveError(null);

        const result = await onSaveStatus(selectedSurah.range.surah, selectedStatus);

        setIsSaving(false);

        if (result.outcome === "error") {
            setSaveError(result.message);
            return;
        }

        setSelectedSurah(null);
    };

    const handleClosePopup = () => {
        if (isSaving) return;

        setSelectedSurah(null);
    };

    return (
        <>
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

                    {canEdit && (
                        <span className="tap-to-edit">
                            Tap to edit
                        </span>
                    )}
                </div>

                <div className="juz-map">
                    {juz.map((juzItem) => (
                        <div className="juz-map-row" key={juzItem.id} >

                            <div className="juz-label" title={juzItem.name}>
                                JUZ {juzItem.number}
                            </div>

                            {/* Every Surah range in this Juz (a Surah that
                                spans several Juz appears in each of them) */}
                            <div className="juz-surahs">
                                {juzItem.surah_ranges.map((range) => {
                                    const { surah } = range;

                                    const status = getStatus(surah.id);

                                    return (
                                        <button
                                            key={`${range.id}-${surah.id}-${range.start_ayah}`}
                                            type="button"
                                            title={`${surah.number}. ${surah.name} (Ayah ${range.start_ayah}–${range.end_ayah})`}
                                            className={`quran-surah-number ${status}`}
                                            onClick={() =>
                                                handleSurahClick(
                                                    range,
                                                    juzItem
                                                )
                                            }
                                            disabled={!canEdit}
                                        >
                                            {surah.number}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {selectedSurah && (
                <QuranMapPopup
                    selectedSurah={selectedSurah}
                    surahJuzRanges={surahJuzRanges.get(selectedSurah.range.surah.id) ?? []}
                    selectedStatus={selectedStatus}
                    onStatusChange={handleStatusChange}
                    onClose={handleClosePopup}
                    onUpdate={handleUpdate}
                    isSaving={isSaving}
                    error={saveError}
                />
            )}
        </>
    );
}
