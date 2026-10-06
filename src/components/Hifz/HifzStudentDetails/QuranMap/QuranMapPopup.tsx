import { X } from "lucide-react";
import type { Surah, SurahStatus } from "./QuranMap.data";
import "../../../Popups/Popup.css";
import "./QuranMapPopup.css";

interface SelectedSurah {
    surah: Surah;
    juzNumber: number;
}

interface QuranMapPopupProps {
    selectedSurah: SelectedSurah;
    selectedStatus: SurahStatus;
    onStatusChange: (status: SurahStatus) => void;
    onClose: () => void;
    onUpdate: () => void;
}

export default function QuranMapPopup({
    selectedSurah,
    selectedStatus,
    onStatusChange,
    onClose,
    onUpdate,
}: QuranMapPopupProps) {
    const { surah, juzNumber } = selectedSurah;

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

                <div className="quran-popup-arabic urdu-text">
                    {surah.arabic}
                </div>

                {/* =========================
                    Surah Information
                ========================= */}

                <div className="quran-popup-meta">
                    <span>Juz {juzNumber}</span>
                    <span>·</span>
                    <span>{surah.ayahs} ayahs</span>
                    <span>·</span>
                    <span>1 page</span>
                </div>

                {/* =========================
                    Status
                ========================= */}

                <div className="quran-popup-status">
                    <button
                        type="button"
                        className={ selectedStatus === "memorised" ? "active memorised" : "" }
                        onClick={() => onStatusChange("memorised") }
                    >
                        Memorised
                    </button>

                    <button
                        type="button"
                        className={ selectedStatus === "progress" ? "active in-progress" : "" }
                        onClick={() => onStatusChange("progress") }
                    >
                        In Progress
                    </button>

                    <button
                        type="button"
                        className={ selectedStatus === "not-started" ? "active not-started" : "" }
                        onClick={() => onStatusChange("not-started") }
                    >
                        Not Started
                    </button>
                </div>

                {/* =========================
                    Actions
                ========================= */}

                <div className="app-popup-actions">
                    <button
                        type="button"
                        className="app-popup-btn cancel"
                        onClick={onClose}
                    >
                        Cancel
                    </button>

                    <button
                        type="button"
                        className="app-popup-btn submit"
                        onClick={onUpdate}
                    >
                        Update
                    </button>
                </div>
            </div>
        </div>
    );
}