import { useState } from "react";
import "./HifzStudentLog.css";
import { ChevronRight } from "lucide-react";

type SabaqStatus =
    | "fluent"
    | "mistakes"
    | "repeat"
    | "needs-revision";

interface SelectOption {
    value: string;
    label: string;
}

const statusOptions: {
    value: SabaqStatus;
    label: string;
}[] = [
    {
        value: "fluent",
        label: "Fluent",
    },
    {
        value: "mistakes",
        label: "Mistakes",
    },
    {
        value: "repeat",
        label: "Repeat",
    },
    {
        value: "needs-revision",
        label: "Needs Revision",
    },
];

const surahOptions: SelectOption[] = [
    {
        value: "112",
        label: "112. Al-Ikhlas",
    },
    {
        value: "113",
        label: "113. Al-Falaq",
    },
    {
        value: "114",
        label: "114. An-Nas",
    },
];

const manzilSurahOptions: SelectOption[] = [
    {
        value: "select",
        label: "Select Surah...",
    },
    ...surahOptions,
];

const strengthOptions: SelectOption[] = [
    {
        value: "good",
        label: "Good ★★",
    },
    {
        value: "excellent",
        label: "Excellent ★★★",
    },
    {
        value: "needs-practice",
        label: "Needs Practice ★",
    },
];

const manzilStrengthOptions: SelectOption[] = [
    {
        value: "select",
        label: "Select Strength...",
    },
    ...strengthOptions,
];

const HifzStudentLog = () => {

    const [oldSabaqStatus, setOldSabaqStatus] =
        useState<SabaqStatus | null>(null);

    const [manzilStatus, setManzilStatus] =
        useState<SabaqStatus | null>(null);

    return (
        <form className="hifz-student-log">

            {/* =========================
                Old Sabaq
            ========================= */}

            <div className="hifz-log-section">

                <div className="hifz-log-section-header">

                    <h3 className="tab-content-title">
                        Old Sabaq
                    </h3>

                    <div className="hifz-log-status-group">

                        {statusOptions.map((status) => (
                            <label
                                className="hifz-log-radio"
                                key={status.value}
                            >

                                <input
                                    type="radio"
                                    id={`old-sabaq-status-${status.value}`}
                                    name="oldSabaqStatus"
                                    value={status.value}
                                    checked={
                                        oldSabaqStatus === status.value
                                    }
                                    onChange={() =>
                                        setOldSabaqStatus(
                                            status.value
                                        )
                                    }
                                />

                                <span className="hifz-log-radio-label">
                                    {status.label}
                                </span>

                            </label>
                        ))}

                    </div>

                </div>


                <div className="hifz-log-form">

                    <div className="row">

                        {/* From Surah */}

                        <div className="col-12 col-md-6">

                            <div className="hifz-log-field">

                                <label
                                    className="hifz-log-label"
                                    htmlFor="oldSabaqFromSurah"
                                >
                                    FROM SURAH
                                </label>

                                <select
                                    id="oldSabaqFromSurah"
                                    name="oldSabaqFromSurah"
                                    className="hifz-log-select"
                                >

                                    {surahOptions.map((option) => (
                                        <option
                                            key={option.value}
                                            value={option.value}
                                        >
                                            {option.label}
                                        </option>
                                    ))}

                                </select>

                            </div>

                        </div>


                        {/* To Surah */}

                        <div className="col-12 col-md-6">

                            <div className="hifz-log-field">

                                <label
                                    className="hifz-log-label"
                                    htmlFor="oldSabaqToSurah"
                                >
                                    TO SURAH
                                </label>

                                <select
                                    id="oldSabaqToSurah"
                                    name="oldSabaqToSurah"
                                    className="hifz-log-select"
                                >

                                    {surahOptions.map((option) => (
                                        <option
                                            key={option.value}
                                            value={option.value}
                                        >
                                            {option.label}
                                        </option>
                                    ))}

                                </select>

                            </div>

                        </div>


                        {/* Strength */}

                        <div className="col-12 col-md-6">

                            <div className="hifz-log-field">

                                <label
                                    className="hifz-log-label"
                                    htmlFor="oldSabaqStrength"
                                >
                                    STRENGTH
                                </label>

                                <select
                                    id="oldSabaqStrength"
                                    name="oldSabaqStrength"
                                    className="hifz-log-select"
                                >

                                    {strengthOptions.map((option) => (
                                        <option
                                            key={option.value}
                                            value={option.value}
                                        >
                                            {option.label}
                                        </option>
                                    ))}

                                </select>

                            </div>

                        </div>


                        {/* Mistakes */}

                        <div className="col-12 col-md-6">

                            <div className="hifz-log-field">

                                <label
                                    className="hifz-log-label"
                                    htmlFor="oldSabaqMistakes"
                                >
                                    MISTAKES
                                </label>

                                <input
                                    id="oldSabaqMistakes"
                                    name="oldSabaqMistakes"
                                    type="number"
                                    className="hifz-log-input"
                                    defaultValue={0}
                                    min={0}
                                />

                            </div>

                        </div>

                    </div>

                </div>

            </div>


            {/* =========================
                Manzil
            ========================= */}

            <div className="hifz-log-section">

                <div className="hifz-log-section-header">

                    <h3 className="tab-content-title">
                        Manzil
                    </h3>


                    <div className="hifz-log-status-group">

                        {statusOptions.map((status) => (
                            <label
                                className="hifz-log-radio"
                                key={status.value}
                            >

                                <input
                                    type="radio"
                                    id={`manzil-status-${status.value}`}
                                    name="manzilStatus"
                                    value={status.value}
                                    checked={
                                        manzilStatus === status.value
                                    }
                                    onChange={() =>
                                        setManzilStatus(
                                            status.value
                                        )
                                    }
                                />

                                <span className="hifz-log-radio-label">
                                    {status.label}
                                </span>

                            </label>
                        ))}

                    </div>

                </div>


                <div className="hifz-log-form">

                    <div className="row">

                        {/* From Surah */}

                        <div className="col-12 col-md-6">

                            <div className="hifz-log-field">

                                <label
                                    className="hifz-log-label"
                                    htmlFor="manzilFromSurah"
                                >
                                    FROM SURAH
                                </label>

                                <select
                                    id="manzilFromSurah"
                                    name="manzilFromSurah"
                                    className="hifz-log-select"
                                >

                                    {manzilSurahOptions.map((option) => (
                                        <option
                                            key={option.value}
                                            value={option.value}
                                        >
                                            {option.label}
                                        </option>
                                    ))}

                                </select>

                            </div>

                        </div>


                        {/* To Surah */}

                        <div className="col-12 col-md-6">

                            <div className="hifz-log-field">

                                <label
                                    className="hifz-log-label"
                                    htmlFor="manzilToSurah"
                                >
                                    TO SURAH
                                </label>

                                <select
                                    id="manzilToSurah"
                                    name="manzilToSurah"
                                    className="hifz-log-select"
                                >

                                    {manzilSurahOptions.map((option) => (
                                        <option
                                            key={option.value}
                                            value={option.value}
                                        >
                                            {option.label}
                                        </option>
                                    ))}

                                </select>

                            </div>

                        </div>


                        {/* Strength */}

                        <div className="col-12 col-md-6">

                            <div className="hifz-log-field">

                                <label
                                    className="hifz-log-label"
                                    htmlFor="manzilStrength"
                                >
                                    STRENGTH
                                </label>

                                <select
                                    id="manzilStrength"
                                    name="manzilStrength"
                                    className="hifz-log-select"
                                >

                                    {manzilStrengthOptions.map((option) => (
                                        <option
                                            key={option.value}
                                            value={option.value}
                                        >
                                            {option.label}
                                        </option>
                                    ))}

                                </select>

                            </div>

                        </div>


                        {/* Mistakes */}

                        <div className="col-12 col-md-6">

                            <div className="hifz-log-field">

                                <label
                                    className="hifz-log-label"
                                    htmlFor="manzilMistakes"
                                >
                                    MISTAKES
                                </label>

                                <input
                                    id="manzilMistakes"
                                    name="manzilMistakes"
                                    type="number"
                                    className="hifz-log-input"
                                    defaultValue={0}
                                    min={0}
                                />

                            </div>

                        </div>

                    </div>

                </div>

            </div>


            {/* =========================
                New Sabaq
            ========================= */}

            <div className="hifz-log-section">

                <div className="hifz-log-section-header">

                    <h3 className="tab-content-title">
                        New Sabaq
                    </h3>

                </div>


                <div className="hifz-log-form">

                    <div className="row">

                        {/* From Surah / Ayah */}

                        <div className="col-12 col-md-6">

                            <div className="hifz-log-field">

                                <label
                                    className="hifz-log-label"
                                    htmlFor="newSabaqFromAyah"
                                >
                                    FROM SURAH/AYAH
                                </label>

                                <input
                                    id="newSabaqFromAyah"
                                    name="newSabaqFromAyah"
                                    type="text"
                                    className="hifz-log-input"
                                    placeholder="e.g. 2:1"
                                />

                            </div>

                        </div>


                        {/* To Surah / Ayah */}

                        <div className="col-12 col-md-6">

                            <div className="hifz-log-field">

                                <label
                                    className="hifz-log-label"
                                    htmlFor="newSabaqToAyah"
                                >
                                    TO SURAH/AYAH
                                </label>

                                <input
                                    id="newSabaqToAyah"
                                    name="newSabaqToAyah"
                                    type="text"
                                    className="hifz-log-input"
                                    placeholder="e.g. 2:10"
                                />

                            </div>

                        </div>


                        {/* Notes */}

                        <div className="col-12">

                            <div className="hifz-log-notes">

                                <label
                                    className="hifz-log-label"
                                    htmlFor="hifzNotes"
                                >
                                    NOTES & OBSERVATIONS
                                </label>

                                <textarea
                                    id="hifzNotes"
                                    name="hifzNotes"
                                    className="hifz-log-textarea"
                                    placeholder="General observations for this session..."
                                />

                            </div>

                        </div>

                    </div>

                </div>

            </div>


            {/* =========================
                Actions
            ========================= */}

            <div className="hifz-log-actions">

                <button
                    type="button"
                    className="hifz-log-cancel-btn"
                >
                    Cancel
                </button>

                <button
                    type="submit"
                    className="hifz-log-save-btn"
                >
                    Save & Next Student

                    <ChevronRight
                        size={12}
                        strokeWidth={2}
                        color="white"
                    />

                </button>

            </div>

        </form>
    );
};

export default HifzStudentLog;