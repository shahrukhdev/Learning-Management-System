import { X } from "lucide-react";
import type { SurahStatus } from "./QuranMap.data";
import type { SelectedSurah } from "./QuranMap";
import { formatJuzNumbers, type SurahJuzRange } from "../../../../hooks/useQuranData";
import "../../../Popups/Popup.css";
import "./QuranMapPopup.css";

interface QuranMapPopupProps {
    selectedSurah: SelectedSurah;
    // Every Juz range of this Surah (from the Juz API)
    surahJuzRanges: SurahJuzRange[];
    selectedStatus: SurahStatus;
    onStatusChange: (status: SurahStatus) => void;
    onClose: () => void;
    onUpdate: () => void;
    // Saving the status (API request in flight)
    isSaving?: boolean;
    // Inline message from the API (e.g. a 422 for a duplicate Surah)
    error?: string | null;
}

export default function QuranMapPopup({
    selectedSurah,
    surahJuzRanges,
    selectedStatus,
    onStatusChange,
    onClose,
    onUpdate,
    isSaving = false,
    error = null,
}: QuranMapPopupProps) {
    const { range, juz } = selectedSurah;

    const { surah } = range;

    // Whole Surah inside this Juz, or only part of it
    const isPartial = range.start_ayah !== 1 || range.end_ayah !== surah.ayahs;

    const spansSeveralJuz = surahJuzRanges.length > 1;

    return (
        <div className="app-popup-wrapper" onClick={onClose} >
            <div
                className="app-popup-box quran-map-popup-box"
                onClick={(event) => event.stopPropagation()}
            >
                {/* =========================
                    Header
                ========================= */}

                <div className="app-popup-header">
                    <h2 className="app-popup-title">
                        {surah.number}. {surah.name}
                    </h2>

                    <button
                        type="button"
                        className="app-popup-close"
                        onClick={onClose}
                        disabled={isSaving}
                        aria-label="Close"
                    >
                        <X
                            size={19}
                            strokeWidth={2}
                        />
                    </button>
                </div>

                {/* =========================
                    Arabic
                ========================= */}

                <div className="quran-popup-arabic urdu-text" dir="rtl" lang="ar">
                    {surah.arabic}
                </div>

                {/* =========================
                    Surah Information
                ========================= */}

                <div className="quran-popup-meta">
                    <span>Juz {juz.number}</span>
                    <span>·</span>
                    <span>{surah.ayahs} ayahs</span>
                    {spansSeveralJuz && (
                        <>
                            <span>·</span>
                            <span>Spans Juz {formatJuzNumbers(surahJuzRanges)}</span>
                        </>
                    )}
                </div>

                {/* This Juz' part of the Surah (from the Juz API ranges) */}
                <div className="quran-popup-meta">
                    <span>
                        {isPartial
                            ? `Ayah ${range.start_ayah}–${range.end_ayah} in Juz ${juz.number} · ${juz.name}`
                            : `Whole Surah in Juz ${juz.number} · ${juz.name}`}
                    </span>
                </div>

                {/* =========================
                    Status
                ========================= */}

                <div className="quran-popup-status">
                    <button
                        type="button"
                        className={ selectedStatus === "memorised" ? "active memorised" : "" }
                        onClick={() => onStatusChange("memorised") }
                        disabled={isSaving}
                    >
                        Memorised
                    </button>

                    <button
                        type="button"
                        className={ selectedStatus === "progress" ? "active in-progress" : "" }
                        onClick={() => onStatusChange("progress") }
                        disabled={isSaving}
                    >
                        In Progress
                    </button>

                    <button
                        type="button"
                        className={ selectedStatus === "not-started" ? "active not-started" : "" }
                        onClick={() => onStatusChange("not-started") }
                        disabled={isSaving}
                    >
                        Not Started
                    </button>
                </div>

                {error && (
                    <span className="error-text d-block text-center mt-2" role="alert">
                        {error}
                    </span>
                )}

                {/* =========================
                    Actions
                ========================= */}

                <div className="app-popup-actions">
                    <button
                        type="button"
                        className="app-popup-btn cancel"
                        onClick={onClose}
                        disabled={isSaving}
                    >
                        Cancel
                    </button>

                    <button
                        type="button"
                        className="app-popup-btn submit"
                        onClick={onUpdate}
                        disabled={isSaving}
                        aria-busy={isSaving}
                    >
                        {isSaving ? "Updating..." : "Update"}
                    </button>
                </div>
            </div>
        </div>
    );
}
