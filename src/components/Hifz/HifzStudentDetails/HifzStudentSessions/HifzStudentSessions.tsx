import "./HifzStudentSessions.css";
import { formatSessionDate } from "./formatSessionDate";
import { CalendarDays, Pencil, Trash2, UserRound } from "lucide-react";

import type { Surah } from "../../../../types/quran.types";
import type {
    HifzSession,
    NewSabaqEntry,
    OldSabaqEntry,
    RevisionEntry,
    SabaqStatus,
    SabaqStrength,
    SessionSection,
} from "../../../../types/hifzSession.types";

/* ================================
   Rating
================================ */

const ratingData: Record<SabaqStrength, { label: string; stars: string }> = {
    strong: {
        label: "Strong",
        stars: "★★★",
    },

    good: {
        label: "Good",
        stars: "★★",
    },

    "needs-work": {
        label: "Needs Work",
        stars: "★",
    },

    weak: {
        label: "Weak",
        stars: "✗",
    },

};

const STATUS_LABELS: Record<SabaqStatus, string> = {
    fluent: "Fluent",
    mistakes: "Mistakes",
    repeat: "Repeat",
    "needs-revision": "Needs Revision",
};

const SECTION_LABELS: Record<SessionSection, string> = {
    old_sabaq: "Old Sabaq",
    manzil: "Manzil",
    new_sabaq: "New Sabaq",
};

// Weakest first: the card shows the weakest strength recorded in the session
const STRENGTH_ORDER: SabaqStrength[] = ["weak", "needs-work", "good", "strong"];

const getSessionRating = (session: HifzSession): SabaqStrength | null => {
    const strengths = [...session.old_sabaq, ...session.manzil]
        .map((entry) => entry.strength)
        .filter((strength): strength is SabaqStrength => strength !== null);

    return STRENGTH_ORDER.find((strength) => strengths.includes(strength)) ?? null;
};

interface HifzStudentSessionsProps {
    sessions: HifzSession[];
    isLoading: boolean;
    error: string | null;
    onRetry: () => void;

    // The tracker's date (filters the list); null = all dates
    date: string | null;
    onShowAllDates: () => void;

    // Surah lookup for entries returned without nested Surah objects
    surahs: Surah[];

    // Each action is shown only when passed ("Edit Hifz Session" /
    // "Delete Hifz Session")
    onEdit?: (session: HifzSession) => void;
    onDelete?: (session: HifzSession) => void;
    // Session whose edit data is being fetched (its Edit button spins)
    loadingSessionId: number | null;

    // Session whose page is shown in the statistics (latest by default)
    selectedSessionId: number | null;
    onSelect: (session: HifzSession) => void;
}

/* ================================
   Component
================================ */

const HifzStudentSessions = ({
    sessions,
    isLoading,
    error,
    onRetry,
    date,
    onShowAllDates,
    surahs,
    onEdit,
    onDelete,
    loadingSessionId,
    selectedSessionId,
    onSelect,
}: HifzStudentSessionsProps) => {

    // Nested Surah from the API, else the Surah list
    const getSurahName = (surah: Surah | null, surahId: number) => {
        const item = surah ?? surahs.find((candidate) => candidate.id === surahId);

        return item ? `${item.number}. ${item.name}` : "Unknown Surah";
    };

    // Same Surah on both sides: show it once
    const describeRange = (from: string, to: string) => (from === to ? from : `${from} → ${to}`);

    const describeNewSabaq = (entry: NewSabaqEntry) =>
        describeRange(
            `${getSurahName(entry.from_surah, entry.from_surah_id)}:${entry.from_ayah}`,
            `${getSurahName(entry.to_surah, entry.to_surah_id)}:${entry.to_ayah}`
        );

    // Old Sabaq with ayahs: same as New Sabaq; without (older sessions) or
    // Manzil: Surah names only
    const describeRevision = (section: SessionSection, entry: RevisionEntry) => {
        const { from_ayah: fromAyah = null, to_ayah: toAyah = null } =
            section === "old_sabaq" ? (entry as OldSabaqEntry) : {};

        if (fromAyah !== null && toAyah !== null) {
            return describeRange(
                `${getSurahName(entry.from_surah, entry.from_surah_id)}:${fromAyah}`,
                `${getSurahName(entry.to_surah, entry.to_surah_id)}:${toAyah}`
            );
        }

        return describeRange(
            getSurahName(entry.from_surah, entry.from_surah_id),
            getSurahName(entry.to_surah, entry.to_surah_id)
        );
    };

    // Old Sabaq / Manzil entry: portion + status, strength and mistakes
    const renderRevisionEntry = (section: SessionSection, entry: RevisionEntry, index: number) => (
        <li className="hifz-session-entry" key={`${section}-${entry.id ?? index}`}>

            <span className={`hifz-session-entry-label ${section}`}>
                {SECTION_LABELS[section]}
            </span>

            <div className="hifz-session-entry-body">

                <h3 className="hifz-session-portion m-0">
                    {describeRevision(section, entry)}
                </h3>

                <div className="hifz-session-entry-meta">

                    {entry.status && (
                        <span className={`hifz-session-chip status-${entry.status}`}>
                            {STATUS_LABELS[entry.status]}
                        </span>
                    )}

                    {entry.strength && (
                        <span className={`hifz-session-chip strength-${entry.strength}`}>
                            {ratingData[entry.strength].label} {ratingData[entry.strength].stars}
                        </span>
                    )}

                    {section === "old_sabaq" && (
                        <span className="hifz-session-chip page">
                            Page {entry.page ?? 0}
                        </span>
                    )}

                    {entry.mistakes !== null && entry.mistakes > 0 && (
                        <span className="hifz-session-mistakes">
                            ✗ {entry.mistakes} {entry.mistakes === 1 ? "mistake" : "mistakes"}
                        </span>
                    )}

                    {entry.mistakes === 0 && (
                        <span className="hifz-session-no-mistakes">
                            ✓ No mistakes
                        </span>
                    )}

                </div>

            </div>

        </li>
    );

    const dateFilter = date && (
        <div className="hifz-sessions-filter">
            <span>Sessions on {formatSessionDate(date)}</span>
            <button type="button" onClick={onShowAllDates}>
                Show all dates
            </button>
        </div>
    );

    if (error) {
        return (
            <>
                {dateFilter}
                <div className="hifz-data-status">
                    <span>{error}</span>
                    <button type="button" className="table-retry-button" onClick={onRetry}>
                        Try again
                    </button>
                </div>
            </>
        );
    }

    if (sessions.length === 0) {
        return (
            <>
                {dateFilter}
                <div className="hifz-data-status" role={isLoading ? "status" : undefined}>
                    {isLoading ? (
                        <span className="d-inline-flex align-items-center gap-2">
                            <span className="spinner-border spinner-border-sm" aria-hidden="true"></span>
                            Loading sessions...
                        </span>
                    ) : (
                        <>
                            <span className="hifz-data-empty-icon" aria-hidden="true">
                                <CalendarDays size={20} strokeWidth={2} />
                            </span>
                            <p className="hifz-data-empty-title">
                                {date ? "No sessions on this date." : "No sessions recorded yet."}
                            </p>
                        </>
                    )}
                </div>
            </>
        );
    }

    return (

        <>

        {dateFilter}

        <div className={`hifz-student-sessions ${isLoading ? "is-loading" : ""}`} aria-busy={isLoading}>

            {sessions.map((session) => {

                const ratingKey = getSessionRating(session);

                const rating = ratingKey ? ratingData[ratingKey] : null;

                const totalMistakes = [...session.old_sabaq, ...session.manzil]
                    .reduce((sum, entry) => sum + (entry.mistakes ?? 0), 0);

                const hasEntries =
                    session.old_sabaq.length + session.manzil.length + session.new_sabaq.length > 0;

                const isLoadingEdit = loadingSessionId === session.id;

                const recorderName = session.recorded_by_user?.name;

                const isSelected = selectedSessionId === session.id;

                return (

                    <article
                        className={`hifz-session-card ${ratingKey ? `hifz-session-${ratingKey}` : ""} ${isSelected ? "selected" : ""}`}
                        key={session.id}
                        // Clicking anywhere on the card selects it (the date
                        // button is the keyboard-accessible control)
                        onClick={() => onSelect(session)}
                    >

                        {/* =========================
                            Header: date, rating, total mistakes, actions
                        ========================= */}

                        <header className="hifz-session-header">

                            <div className="hifz-session-left">

                                <button
                                    type="button"
                                    className="hifz-session-date"
                                    aria-pressed={isSelected}
                                    aria-label={`Show page progress of the session of ${formatSessionDate(session.session_date)}`}
                                >
                                    <CalendarDays size={15} strokeWidth={2} aria-hidden="true" />
                                    {formatSessionDate(session.session_date)}
                                </button>

                                {isSelected && (
                                    <span className="hifz-session-selected-tag">Selected</span>
                                )}

                                {rating && (
                                    <div className="hifz-session-rating">

                                        <span className="hifz-session-rating-label">
                                            {rating.label}
                                        </span>

                                        <span className="hifz-session-rating-symbol">
                                            {rating.stars}
                                        </span>

                                    </div>
                                )}

                                {totalMistakes > 0 && (
                                    <span className="hifz-session-mistakes total">
                                        ✗ {totalMistakes} {totalMistakes === 1 ? "mistake" : "mistakes"}
                                    </span>
                                )}

                            </div>

                            {/* Edit / Delete do not select the card */}
                            {(onEdit || onDelete) && (
                                <div className="table-actions hifz-session-actions" onClick={(event) => event.stopPropagation()}>
                                    {onEdit && (
                                        <button
                                            type="button"
                                            onClick={() => onEdit(session)}
                                            disabled={loadingSessionId !== null}
                                            aria-label={`Edit session of ${formatSessionDate(session.session_date)}`}
                                        >
                                            {isLoadingEdit ? (
                                                <span className="spinner-border spinner-border-sm" aria-hidden="true"></span>
                                            ) : (
                                                <Pencil size={16} strokeWidth={2.4} />
                                            )}
                                        </button>
                                    )}
                                    {onDelete && (
                                        <button
                                            type="button"
                                            onClick={() => onDelete(session)}
                                            aria-label={`Delete session of ${formatSessionDate(session.session_date)}`}
                                        >
                                            <Trash2 size={16} strokeWidth={2.4} />
                                        </button>
                                    )}
                                </div>
                            )}

                        </header>

                        {/* =========================
                            Entries
                        ========================= */}

                        {hasEntries && (
                            <ul className="hifz-session-entries">

                                {session.old_sabaq.map((entry, index) => renderRevisionEntry("old_sabaq", entry, index))}

                                {session.manzil.map((entry, index) => renderRevisionEntry("manzil", entry, index))}

                                {session.new_sabaq.map((entry, index) => (
                                    <li className="hifz-session-entry" key={`new_sabaq-${entry.id ?? index}`}>

                                        <span className="hifz-session-entry-label new_sabaq">
                                            {SECTION_LABELS.new_sabaq}
                                        </span>

                                        <div className="hifz-session-entry-body">
                                            <h3 className="hifz-session-portion m-0">
                                                {describeNewSabaq(entry)}
                                            </h3>
                                        </div>

                                    </li>
                                ))}

                            </ul>
                        )}

                        {/* =========================
                            Notes + recorder
                        ========================= */}

                        {session.notes && (
                            <p className="hifz-session-description m-0">
                                {session.notes}
                            </p>
                        )}

                        {recorderName && (
                            <div className="hifz-session-footer">
                                <UserRound size={14} strokeWidth={2} aria-hidden="true" />
                                <span>
                                    Recorded by <strong>{recorderName}</strong>
                                </span>
                            </div>
                        )}

                    </article>

                );

            })}

        </div>

        </>

    );

};

export default HifzStudentSessions;
