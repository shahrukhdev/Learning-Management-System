import { useRef, useState } from "react";
import type { FormEvent } from "react";
import "./HifzStudentLog.css";
import { ChevronRight } from "lucide-react";
import type { Surah } from "../../../../types/quran.types";
import type { ValidationErrors } from "../../../../types/api.types";
import type {
    HifzSession,
    RevisionSection,
    SabaqStatus,
    SabaqStrength,
    SaveHifzSessionRequest,
    SessionSection,
} from "../../../../types/hifzSession.types";
import { isolateArabic } from "../../../../hooks/useQuranData";
import {
    FORM_ERROR_KEY,
    createEmptySessionForm,
    emptyNewSabaqEntry,
    emptyRevisionEntry,
    entryErrorKey,
    toSessionFormData,
    toSessionFormErrors,
    validateSessionForm,
    type HifzSessionFormData,
    type HifzSessionFormErrors,
    type NewSabaqEntryForm,
    type RevisionEntryForm,
} from "./hifzSessionForm";

interface SelectOption<T extends string> {
    value: T;
    label: string;
}

const statusOptions: SelectOption<SabaqStatus>[] = [
    { value: "fluent", label: "Fluent" },
    { value: "mistakes", label: "Mistakes" },
    { value: "repeat", label: "Repeat" },
    { value: "needs-revision", label: "Needs Revision" },
];

// Values are the exact API values
const strengthOptions: SelectOption<SabaqStrength>[] = [
    { value: "strong", label: "Strong ★★★" },
    { value: "good", label: "Good ★★" },
    { value: "needs-work", label: "Needs Work ★" },
    { value: "weak", label: "Weak ✗" },
];

const SECTION_TITLES: Record<SessionSection, string> = {
    old_sabaq: "Old Sabaq",
    manzil: "Manzil",
    new_sabaq: "New Sabaq",
};

// "112. Al-Ikhlas · الإخلاص" (Arabic isolated so the English stays LTR)
const getSurahLabel = (surah: Surah) =>
    `${surah.number}. ${surah.name}${surah.arabic ? ` · ${isolateArabic(surah.arabic)}` : ""}`;

// Ayah numbers from..total (inclusive)
const getAyahNumbers = (total: number, from = 1) =>
    Array.from({ length: Math.max(total - from + 1, 0) }, (_, index) => from + index);

// Outcome of saving the session (the parent calls the API)
export type SessionSubmitResult =
    | { outcome: "done" }
    | { outcome: "invalid"; validationErrors: ValidationErrors }
    | { outcome: "error" };

interface HifzStudentLogProps {
    // Surahs from GET /v1/surahs (shared by the whole tracker)
    surahs: Surah[];
    surahsLoading: boolean;
    surahsError: string | null;
    onRetrySurahs: () => void;

    // Create: the tracker's selected date. Edit: the session being edited.
    sessionDate: string | null;
    editingSession?: HifzSession | null;

    onSubmit: (payload: SaveHifzSessionRequest) => Promise<SessionSubmitResult>;
    onCancel: () => void;
}

// Session form: Old Sabaq, Manzil and New Sabaq entries + notes. Used for
// creating a session and for editing one (remounted per session).
const HifzStudentLog = ({
    surahs,
    surahsLoading,
    surahsError,
    onRetrySurahs,
    sessionDate,
    editingSession = null,
    onSubmit,
    onCancel,
}: HifzStudentLogProps) => {

    const isEditing = editingSession !== null;

    // Every section always shows at least one entry (there is no Add Entry);
    // a blank entry is ignored on submit, so the payload is unchanged
    const [formData, setFormData] = useState<HifzSessionFormData>(() => {
        if (!editingSession) return createEmptySessionForm();

        const data = toSessionFormData(editingSession);

        return {
            ...data,
            old_sabaq: data.old_sabaq.length > 0 ? data.old_sabaq : [emptyRevisionEntry()],
            manzil: data.manzil.length > 0 ? data.manzil : [emptyRevisionEntry()],
            new_sabaq: data.new_sabaq.length > 0 ? data.new_sabaq : [emptyNewSabaqEntry()],
        };
    });

    const [errors, setErrors] = useState<HifzSessionFormErrors>({});

    const [isSubmitting, setIsSubmitting] = useState(false);

    // Synchronous guard against double submits
    const isSubmittingRef = useRef(false);

    const findSurah = (id: string) => surahs.find((surah) => String(surah.id) === id);

    const surahSelectDisabled = surahsLoading || surahs.length === 0 || isSubmitting;

    const surahPlaceholder = surahsLoading
        ? "Loading surahs..."
        : surahs.length === 0
            ? "No surahs available"
            : "Select Surah...";

    // Ending Surah options start at the starting Surah
    const renderSurahOptions = (minNumber = 0) => (
        <>
            <option value="">{surahPlaceholder}</option>
            {surahs
                .filter((surah) => surah.number >= minNumber)
                .map((surah) => (
                    <option key={surah.id} value={surah.id}>
                        {getSurahLabel(surah)}
                    </option>
                ))}
        </>
    );

    /* --------------------------------
       Errors
    -------------------------------- */

    const getError = (section: SessionSection, entryKey: string, field: string) =>
        errors[entryErrorKey(section, entryKey, field)];

    // Clears the given errors (plus the general one) once a field is edited
    const clearErrors = (keys: string[]) => {
        setErrors((current) => {
            if (!keys.some((key) => current[key]) && !current[FORM_ERROR_KEY]) return current;

            const next = { ...current };
            keys.forEach((key) => delete next[key]);
            delete next[FORM_ERROR_KEY];
            return next;
        });
    };

    const renderError = (message: string | undefined) =>
        message ? <span className="error-text d-block">{message}</span> : null;

    /* --------------------------------
       Old Sabaq / Manzil entries
    -------------------------------- */

    const updateRevision = (section: RevisionSection, entryKey: string, field: keyof RevisionEntryForm, value: string) => {
        const cleared = [field];

        setFormData((current) => ({
            ...current,
            [section]: current[section].map((entry) => {
                if (entry.key !== entryKey) return entry;

                const next = { ...entry, [field]: value } as RevisionEntryForm;

                // Old Sabaq: a different Surah has a different ayah range
                if (section === "old_sabaq") {
                    if (field === "from_surah_id") next.from_ayah = "";
                    if (field === "to_surah_id") next.to_ayah = "";
                }

                // The ending Surah cannot be before the new starting Surah
                if (field === "from_surah_id") {
                    const from = findSurah(value);
                    const to = findSurah(next.to_surah_id);

                    if (from && to && to.number < from.number) {
                        next.to_surah_id = "";
                        next.to_ayah = "";
                    }
                }

                // Old Sabaq: within one Surah the end cannot be before the start
                if (section === "old_sabaq") {
                    const from = findSurah(next.from_surah_id);
                    const to = findSurah(next.to_surah_id);

                    if (
                        from && to && from.id === to.id &&
                        next.from_ayah && next.to_ayah &&
                        Number(next.to_ayah) < Number(next.from_ayah)
                    ) {
                        next.to_ayah = "";
                    }
                }

                return next;
            }),
        }));

        if (field === "from_surah_id") cleared.push("to_surah_id");

        if (section === "old_sabaq" && ["from_surah_id", "to_surah_id", "from_ayah", "to_ayah"].includes(field)) {
            cleared.push("from_surah_id", "to_surah_id", "from_ayah", "to_ayah");
        }

        clearErrors(cleared.map((name) => entryErrorKey(section, entryKey, name)));
    };

    /* --------------------------------
       New Sabaq entries
    -------------------------------- */

    const updateNewSabaq = (entryKey: string, field: keyof NewSabaqEntryForm, value: string) => {
        setFormData((current) => ({
            ...current,
            new_sabaq: current.new_sabaq.map((entry) => {
                if (entry.key !== entryKey) return entry;

                const next = { ...entry, [field]: value } as NewSabaqEntryForm;

                // A different Surah has a different ayah range: clear its ayah
                if (field === "from_surah_id") next.from_ayah = "";
                if (field === "to_surah_id") next.to_ayah = "";

                const from = findSurah(next.from_surah_id);
                const to = findSurah(next.to_surah_id);

                // The end cannot be before the start
                if (field === "from_surah_id" && from && to && to.number < from.number) {
                    next.to_surah_id = "";
                    next.to_ayah = "";
                }

                if (
                    from && to && from.id === to.id &&
                    next.from_ayah && next.to_ayah &&
                    Number(next.to_ayah) < Number(next.from_ayah)
                ) {
                    next.to_ayah = "";
                }

                return next;
            }),
        }));

        clearErrors(
            ["from_surah_id", "from_ayah", "to_surah_id", "to_ayah"].map((name) =>
                entryErrorKey("new_sabaq", entryKey, name)
            )
        );
    };

    /* --------------------------------
       Submit
    -------------------------------- */

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (isSubmittingRef.current) return;

        const { errors: clientErrors, payload, entryKeys } = validateSessionForm(formData, sessionDate, surahs);

        if (!payload) {
            setErrors(clientErrors);
            return;
        }

        isSubmittingRef.current = true;
        setIsSubmitting(true);
        setErrors({});

        const result = await onSubmit(payload);

        isSubmittingRef.current = false;
        setIsSubmitting(false);

        if (result.outcome === "invalid") {
            setErrors(toSessionFormErrors(result.validationErrors, entryKeys));
        }
        // "done": the parent remounts this form (reset / leaves edit mode)
    };

    const handleCancel = () => {
        if (isSubmitting) return;

        if (isEditing) {
            onCancel();
            return;
        }

        // Create: discard what was entered
        setFormData(createEmptySessionForm());
        setErrors({});
    };

    /* --------------------------------
       Render helpers
    -------------------------------- */

    // Status tabs (Fluent / Mistakes / Repeat / Needs Revision) of one entry
    const renderStatusGroup = (section: RevisionSection, entry: RevisionEntryForm) => {

        const fieldId = (name: string) => `${section}-${entry.key}-${name}`;

        return (
            <div className="hifz-log-status-group" role="radiogroup" aria-label={`${SECTION_TITLES[section]} status`}>

                {statusOptions.map((status) => (
                    <label
                        className="hifz-log-radio"
                        key={status.value}
                    >

                        <input
                            type="radio"
                            id={fieldId(`status-${status.value}`)}
                            name={fieldId("status")}
                            value={status.value}
                            checked={entry.status === status.value}
                            onChange={() => updateRevision(section, entry.key, "status", status.value)}
                            disabled={isSubmitting}
                        />

                        <span className="hifz-log-radio-label">
                            {status.label}
                        </span>

                    </label>
                ))}

            </div>
        );
    };

    // Old Sabaq / Manzil: status tabs beside the section heading (status of
    // the first entry). Extra entries of a loaded session keep their own tabs.
    const renderRevisionSection = (section: RevisionSection) => (
        <div className="hifz-log-section">

            <div className="hifz-log-section-header">

                <h3 className="tab-content-title">
                    {SECTION_TITLES[section]}
                </h3>

                {formData[section][0] && renderStatusGroup(section, formData[section][0])}

            </div>

            {formData[section].map((entry, index) => {

                const fieldId = (name: string) => `${section}-${entry.key}-${name}`;

                const fromSurah = findSurah(entry.from_surah_id);

                const isOldSabaq = section === "old_sabaq";

                return (
                    <div className="hifz-log-entry" key={entry.key}>

                        {index > 0 && (
                            <div className="hifz-log-entry-header">
                                {renderStatusGroup(section, entry)}
                            </div>
                        )}

                        {renderError(getError(section, entry.key, "status"))}

                        <div className="hifz-log-form">

                            <div className="row">

                                {/* Old Sabaq: From / To Surah + Ayah (same as New Sabaq) */}

                                {isOldSabaq && (
                                    <>
                                        <div className="col-12 col-md-6">
                                            {renderSurahAyahPosition("old_sabaq", entry, "from", (field, value) =>
                                                updateRevision("old_sabaq", entry.key, field, value)
                                            )}
                                        </div>

                                        <div className="col-12 col-md-6">
                                            {renderSurahAyahPosition("old_sabaq", entry, "to", (field, value) =>
                                                updateRevision("old_sabaq", entry.key, field, value)
                                            )}
                                        </div>
                                    </>
                                )}

                                {/* Manzil: From Surah */}

                                {!isOldSabaq && (
                                <div className="col-12 col-md-6">

                                    <div className="primary-field">

                                        <label className="primary-label" htmlFor={fieldId("from")}>
                                            FROM SURAH
                                        </label>

                                        <select
                                            id={fieldId("from")}
                                            className="primary-select"
                                            value={entry.from_surah_id}
                                            onChange={(event) => updateRevision(section, entry.key, "from_surah_id", event.target.value)}
                                            disabled={surahSelectDisabled}
                                            aria-invalid={Boolean(getError(section, entry.key, "from_surah_id"))}
                                        >
                                            {renderSurahOptions()}
                                        </select>

                                        {renderError(getError(section, entry.key, "from_surah_id"))}

                                    </div>

                                </div>
                                )}


                                {/* Manzil: To Surah (not before the starting Surah) */}

                                {!isOldSabaq && (
                                <div className="col-12 col-md-6">

                                    <div className="primary-field">

                                        <label className="primary-label" htmlFor={fieldId("to")}>
                                            TO SURAH
                                        </label>

                                        <select
                                            id={fieldId("to")}
                                            className="primary-select"
                                            value={entry.to_surah_id}
                                            onChange={(event) => updateRevision(section, entry.key, "to_surah_id", event.target.value)}
                                            disabled={surahSelectDisabled}
                                            aria-invalid={Boolean(getError(section, entry.key, "to_surah_id"))}
                                        >
                                            {renderSurahOptions(fromSurah?.number ?? 0)}
                                        </select>

                                        {renderError(getError(section, entry.key, "to_surah_id"))}

                                    </div>

                                </div>
                                )}


                                {/* Strength */}

                                <div className="col-12 col-md-6">

                                    <div className="primary-field">

                                        <label className="primary-label" htmlFor={fieldId("strength")}>
                                            STRENGTH
                                        </label>

                                        <select
                                            id={fieldId("strength")}
                                            className="primary-select"
                                            value={entry.strength}
                                            onChange={(event) => updateRevision(section, entry.key, "strength", event.target.value)}
                                            disabled={isSubmitting}
                                            aria-invalid={Boolean(getError(section, entry.key, "strength"))}
                                        >
                                            <option value="">Select Strength...</option>
                                            {strengthOptions.map((option) => (
                                                <option key={option.value} value={option.value}>
                                                    {option.label}
                                                </option>
                                            ))}
                                        </select>

                                        {renderError(getError(section, entry.key, "strength"))}

                                    </div>

                                </div>


                                {/* Mistakes (shares its half with Page in Old Sabaq) */}

                                <div className={isOldSabaq ? "col-6 col-md-3" : "col-12 col-md-6"}>

                                    <div className="primary-field">

                                        <label className="primary-label" htmlFor={fieldId("mistakes")}>
                                            MISTAKES
                                        </label>

                                        <input
                                            id={fieldId("mistakes")}
                                            type="number"
                                            className="primary-control"
                                            value={entry.mistakes}
                                            onChange={(event) => updateRevision(section, entry.key, "mistakes", event.target.value)}
                                            min={0}
                                            step={1}
                                            inputMode="numeric"
                                            disabled={isSubmitting}
                                            aria-invalid={Boolean(getError(section, entry.key, "mistakes"))}
                                        />

                                        {renderError(getError(section, entry.key, "mistakes"))}

                                    </div>

                                </div>


                                {/* Page Number (Old Sabaq only; optional, 0 by default) */}

                                {isOldSabaq && (
                                    <div className="col-6 col-md-3">

                                        <div className="primary-field">

                                            <label className="primary-label" htmlFor={fieldId("page")}>
                                                PAGE NO.
                                            </label>

                                            <input
                                                id={fieldId("page")}
                                                type="number"
                                                className="primary-control"
                                                value={entry.page}
                                                onChange={(event) => updateRevision(section, entry.key, "page", event.target.value)}
                                                min={0}
                                                step={1}
                                                inputMode="numeric"
                                                placeholder="0"
                                                disabled={isSubmitting}
                                                aria-invalid={Boolean(getError(section, entry.key, "page"))}
                                            />

                                            {renderError(getError(section, entry.key, "page"))}

                                        </div>

                                    </div>
                                )}

                            </div>

                        </div>

                    </div>
                );
            })}

        </div>
    );

    // Surah + Ayah picker for one side of an entry (New Sabaq and Old Sabaq)
    type PositionField = "from_surah_id" | "from_ayah" | "to_surah_id" | "to_ayah";

    const renderSurahAyahPosition = (
        section: "old_sabaq" | "new_sabaq",
        entry: Pick<NewSabaqEntryForm, "key" | PositionField>,
        side: "from" | "to",
        onChange: (field: PositionField, value: string) => void
    ) => {

        const surahField = side === "from" ? "from_surah_id" : "to_surah_id";
        const ayahField = side === "from" ? "from_ayah" : "to_ayah";

        const fromSurah = findSurah(entry.from_surah_id);
        const surah = findSurah(entry[surahField]);

        // Within one Surah the end cannot be before the start
        const ayahStart =
            side === "to" && fromSurah && surah && fromSurah.id === surah.id && entry.from_ayah
                ? Number(entry.from_ayah)
                : 1;

        const id = `${section}-${entry.key}-${side}`;

        return (
            <div className="primary-field">

                <label className="primary-label" htmlFor={`${id}-surah`}>
                    {side === "from" ? "FROM SURAH/AYAH" : "TO SURAH/AYAH"}
                </label>

                <div className="d-flex gap-2">

                    <select
                        id={`${id}-surah`}
                        className="primary-select"
                        value={entry[surahField]}
                        onChange={(event) => onChange(surahField, event.target.value)}
                        disabled={surahSelectDisabled}
                        aria-invalid={Boolean(getError(section, entry.key, surahField))}
                    >
                        {renderSurahOptions(side === "to" ? fromSurah?.number ?? 0 : 0)}
                    </select>

                    <select
                        id={`${id}-ayah`}
                        className="primary-select hifz-ayah-select"
                        aria-label={side === "from" ? "From ayah" : "To ayah"}
                        value={entry[ayahField]}
                        onChange={(event) => onChange(ayahField, event.target.value)}
                        disabled={!surah || isSubmitting}
                        aria-invalid={Boolean(getError(section, entry.key, ayahField))}
                    >
                        <option value="">Ayah</option>
                        {surah && getAyahNumbers(surah.ayahs, ayahStart).map((ayah) => (
                            <option key={ayah} value={ayah}>
                                {ayah}
                            </option>
                        ))}
                    </select>

                </div>

                {renderError(getError(section, entry.key, surahField) ?? getError(section, entry.key, ayahField))}

            </div>
        );
    };

    return (
        <form className="hifz-student-log" onSubmit={handleSubmit} noValidate>

            {surahsError && (
                <span className="error-text d-block mb-3">
                    {surahsError}{" "}
                    <button
                        type="button"
                        className="btn btn-link p-0 align-baseline"
                        onClick={onRetrySurahs}
                    >
                        Try again
                    </button>
                </span>
            )}

            {/* =========================
                Old Sabaq
            ========================= */}

            {renderRevisionSection("old_sabaq")}


            {/* =========================
                Manzil
            ========================= */}

            {renderRevisionSection("manzil")}


            {/* =========================
                New Sabaq
            ========================= */}

            <div className="hifz-log-section">

                <div className="hifz-log-section-header">

                    <h3 className="tab-content-title">
                        {SECTION_TITLES.new_sabaq}
                    </h3>

                </div>

                {formData.new_sabaq.map((entry) => (
                    <div className="hifz-log-entry" key={entry.key}>

                        <div className="hifz-log-form">

                            <div className="row">

                                {/* From Surah / Ayah */}

                                <div className="col-12 col-md-6">
                                    {renderSurahAyahPosition("new_sabaq", entry, "from", (field, value) =>
                                        updateNewSabaq(entry.key, field, value)
                                    )}
                                </div>


                                {/* To Surah / Ayah */}

                                <div className="col-12 col-md-6">
                                    {renderSurahAyahPosition("new_sabaq", entry, "to", (field, value) =>
                                        updateNewSabaq(entry.key, field, value)
                                    )}
                                </div>

                            </div>

                        </div>

                    </div>
                ))}


                {/* Notes */}

                <div className="hifz-log-form">

                    <div className="row">

                        <div className="col-12">

                            <div className="hifz-log-notes">

                                <label
                                    className="primary-label"
                                    htmlFor="hifzNotes"
                                >
                                    NOTES & OBSERVATIONS
                                </label>

                                <textarea
                                    id="hifzNotes"
                                    name="hifzNotes"
                                    className="primary-textarea"
                                    placeholder="General observations for this session..."
                                    value={formData.notes}
                                    onChange={(event) => {
                                        const { value } = event.target;
                                        setFormData((current) => ({ ...current, notes: value }));
                                        clearErrors(["notes"]);
                                    }}
                                    disabled={isSubmitting}
                                    aria-invalid={Boolean(errors.notes)}
                                />

                                {renderError(errors.notes)}

                            </div>

                        </div>

                    </div>

                </div>

            </div>


            {/* General errors (date, at least one entry, backend messages) */}

            {errors[FORM_ERROR_KEY] && (
                <span className="error-text d-block mt-3" role="alert">
                    {errors[FORM_ERROR_KEY]}
                </span>
            )}


            {/* =========================
                Actions
            ========================= */}

            <div className="form-actions">

                <button
                    type="button"
                    className="form-btn form-btn-cancel"
                    onClick={handleCancel}
                    disabled={isSubmitting}
                >
                    Cancel
                </button>

                <button
                    type="submit"
                    className="form-btn form-btn-primary"
                    disabled={isSubmitting || surahsLoading}
                    aria-busy={isSubmitting}
                >
                    {isSubmitting
                        ? (isEditing ? "Updating..." : "Saving...")
                        : (isEditing ? "Update Session" : "Save Session")}

                    {isSubmitting ? (
                        <span className="spinner-border spinner-border-sm" aria-hidden="true"></span>
                    ) : (
                        <ChevronRight
                            size={12}
                            strokeWidth={2}
                            color="white"
                        />
                    )}

                </button>

            </div>

        </form>
    );
};

export default HifzStudentLog;
