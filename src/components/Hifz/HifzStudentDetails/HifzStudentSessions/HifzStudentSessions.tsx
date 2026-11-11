import "./HifzStudentSessions.css";
import { formatSessionDate } from "./formatSessionDate";
import { CalendarDays, Pencil, Trash2 } from "lucide-react";

import type { Surah } from "../../../../types/quran.types";
import type {
    HifzSession,
    NewSabaqEntry,
    RevisionEntry,
    SabaqStatus,
    SabaqStrength,
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

    onEdit: (session: HifzSession) => void;
    onDelete: (session: HifzSession) => void;
    // Session whose edit data is being fetched (its Edit button spins)
    loadingSessionId: number | null;
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
}: HifzStudentSessionsProps) => {

    // Nested Surah from the API, else the Surah list
    const getSurahName = (surah: Surah | null, surahId: number) => {
        const item = surah ?? surahs.find((candidate) => candidate.id === surahId);

        return item ? `${item.number}. ${item.name}` : "Unknown Surah";
    };

    const describeRevision = (entry: RevisionEntry) => {
        const portion = `${getSurahName(entry.from_surah, entry.from_surah_id)} → ${getSurahName(entry.to_surah, entry.to_surah_id)}`;

        const details = [
            entry.status ? STATUS_LABELS[entry.status] : null,
            entry.strength ? ratingData[entry.strength].label : null,
            entry.mistakes !== null ? `✗ ${entry.mistakes} mistakes` : null,
        ].filter(Boolean);

        return details.length > 0 ? `${portion} · ${details.join(" · ")}` : portion;
    };

    const describeNewSabaq = (entry: NewSabaqEntry) =>
        `${getSurahName(entry.from_surah, entry.from_surah_id)}:${entry.from_ayah} → ${getSurahName(entry.to_surah, entry.to_surah_id)}:${entry.to_ayah}`;

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

                const lines = [
                    ...session.old_sabaq.map((entry) => ({ label: "Old Sabaq", text: describeRevision(entry) })),
                    ...session.manzil.map((entry) => ({ label: "Manzil", text: describeRevision(entry) })),
                    ...session.new_sabaq.map((entry) => ({ label: "New Sabaq", text: describeNewSabaq(entry) })),
                ];

                const isLoadingEdit = loadingSessionId === session.id;

                return (

                    <div className={`hifz-session-card ${ratingKey ? `hifz-session-${ratingKey}` : ""}`} key={session.id} >

                        {/* =========================
                            Left Side
                        ========================= */}

                        <div className="hifz-session-left">

                            {/* Date */}

                            <span className="hifz-session-date">
                                {formatSessionDate(session.session_date)}
                            </span>

                            {/* Rating */}

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

                        </div>

                        {/* =========================
                            Right Side
                        ========================= */}

                        <div className="hifz-session-content">

                            {/* Entries */}

                            {lines.map((line, index) => (
                                <h3 className="hifz-session-portion m-0" key={`${line.label}-${index}`}>
                                    <span className="hifz-session-entry-label">{line.label}:</span> {line.text}
                                </h3>
                            ))}

                            {/* Notes */}

                            {session.notes && (
                                <p className="hifz-session-description m-0">
                                    {session.notes}
                                </p>
                            )}

                        </div>

                        {/* Actions */}

                        <div className="table-actions hifz-session-actions">
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
                            <button
                                type="button"
                                onClick={() => onDelete(session)}
                                aria-label={`Delete session of ${formatSessionDate(session.session_date)}`}
                            >
                                <Trash2 size={16} strokeWidth={2.4} />
                            </button>
                        </div>

                    </div>

                );

            })}

        </div>

        </>

    );

};

export default HifzStudentSessions;
