import type { ValidationErrors } from "../../../../types/api.types";
import type { Surah } from "../../../../types/quran.types";
import type {
    HifzSession,
    NewSabaqEntryPayload,
    RevisionEntryPayload,
    RevisionSection,
    SabaqStatus,
    SabaqStrength,
    SaveHifzSessionRequest,
    SessionSection,
} from "../../../../types/hifzSession.types";

// Hifz session form (Student Log): state, validation and payload mapping.
// Select values are strings ("" = not selected); IDs are API Surah IDs.

export interface RevisionEntryForm {
    key: string; // local key for React and error mapping (never sent)
    from_surah_id: string;
    to_surah_id: string;
    status: SabaqStatus | "";
    strength: SabaqStrength | "";
    mistakes: string;
    page: string; // Old Sabaq only ("" or missing is sent as 0)
}

export interface NewSabaqEntryForm {
    key: string;
    from_surah_id: string;
    from_ayah: string;
    to_surah_id: string;
    to_ayah: string;
}

export interface HifzSessionFormData {
    notes: string;
    old_sabaq: RevisionEntryForm[];
    manzil: RevisionEntryForm[];
    new_sabaq: NewSabaqEntryForm[];
}

// Keys: "form" (general), "notes", or "<section>.<entryKey>.<field>"
export type HifzSessionFormErrors = Record<string, string>;

export const FORM_ERROR_KEY = "form";

export const entryErrorKey = (section: SessionSection, entryKey: string, field: string) =>
    `${section}.${entryKey}.${field}`;

let nextEntryKey = 0;

const newKey = () => {
    nextEntryKey += 1;
    return `entry-${nextEntryKey}`;
};

export const emptyRevisionEntry = (): RevisionEntryForm => ({
    key: newKey(),
    from_surah_id: "",
    to_surah_id: "",
    status: "",
    strength: "",
    mistakes: "0",
    page: "0",
});

export const emptyNewSabaqEntry = (): NewSabaqEntryForm => ({
    key: newKey(),
    from_surah_id: "",
    from_ayah: "",
    to_surah_id: "",
    to_ayah: "",
});

// New session: one blank entry per section, like the original form
export const createEmptySessionForm = (): HifzSessionFormData => ({
    notes: "",
    old_sabaq: [emptyRevisionEntry()],
    manzil: [emptyRevisionEntry()],
    new_sabaq: [emptyNewSabaqEntry()],
});

// Existing session -> form (Surahs preselected by ID)
export const toSessionFormData = (session: HifzSession): HifzSessionFormData => ({
    notes: session.notes ?? "",
    old_sabaq: session.old_sabaq.map((entry) => ({
        key: newKey(),
        from_surah_id: String(entry.from_surah_id),
        to_surah_id: String(entry.to_surah_id),
        status: entry.status ?? "",
        strength: entry.strength ?? "",
        mistakes: entry.mistakes !== null ? String(entry.mistakes) : "",
        page: String(entry.page ?? 0),
    })),
    manzil: session.manzil.map((entry) => ({
        key: newKey(),
        from_surah_id: String(entry.from_surah_id),
        to_surah_id: String(entry.to_surah_id),
        status: entry.status ?? "",
        strength: entry.strength ?? "",
        mistakes: entry.mistakes !== null ? String(entry.mistakes) : "",
        page: "0", // not used for Manzil
    })),
    new_sabaq: session.new_sabaq.map((entry) => ({
        key: newKey(),
        from_surah_id: String(entry.from_surah_id),
        from_ayah: String(entry.from_ayah),
        to_surah_id: String(entry.to_surah_id),
        to_ayah: String(entry.to_ayah),
    })),
});

const isZeroOrEmpty = (value: string) => value.trim() === "" || value.trim() === "0";

// An entry the user has not touched is ignored (not sent, not validated)
const isBlankRevision = (section: RevisionSection, entry: RevisionEntryForm) =>
    !entry.from_surah_id && !entry.to_surah_id && !entry.status && !entry.strength &&
    isZeroOrEmpty(entry.mistakes) &&
    (section !== "old_sabaq" || isZeroOrEmpty(entry.page));

const isBlankNewSabaq = (entry: NewSabaqEntryForm) =>
    !entry.from_surah_id && !entry.from_ayah && !entry.to_surah_id && !entry.to_ayah;

export interface SessionValidationResult {
    errors: HifzSessionFormErrors;
    payload: SaveHifzSessionRequest | null;
    // Payload index -> form entry key, per section (maps backend errors back)
    entryKeys: Record<SessionSection, string[]>;
}

// Client-side rules (the backend validates again)
export const validateSessionForm = (
    data: HifzSessionFormData,
    sessionDate: string | null,
    surahs: Surah[]
): SessionValidationResult => {

    const errors: HifzSessionFormErrors = {};

    const byId = new Map(surahs.map((surah) => [String(surah.id), surah]));

    const entryKeys: Record<SessionSection, string[]> = { old_sabaq: [], manzil: [], new_sabaq: [] };

    const revisionPayload = (section: RevisionSection): RevisionEntryPayload[] => {
        const result: RevisionEntryPayload[] = [];

        data[section].forEach((entry) => {
            if (isBlankRevision(section, entry)) return;

            const err = (field: string, message: string) => {
                errors[entryErrorKey(section, entry.key, field)] = message;
            };

            const from = byId.get(entry.from_surah_id);
            const to = byId.get(entry.to_surah_id);

            if (!from) err("from_surah_id", "Select the starting Surah.");
            if (!to) err("to_surah_id", "Select the ending Surah.");
            if (from && to && to.number < from.number) {
                err("to_surah_id", "The ending Surah cannot be before the starting Surah.");
            }
            if (!entry.status) err("status", "Select a status.");
            if (!entry.strength) err("strength", "Select a strength.");

            const mistakesText = entry.mistakes.trim();
            const mistakes = mistakesText === "" ? null : Number(mistakesText);

            if (mistakes !== null && (!Number.isInteger(mistakes) || mistakes < 0)) {
                err("mistakes", "Mistakes must be a whole number of 0 or more.");
            }

            // Old Sabaq page: optional, empty = 0
            const pageText = entry.page.trim();
            const page = pageText === "" ? 0 : Number(pageText);

            if (section === "old_sabaq" && (!Number.isInteger(page) || page < 0)) {
                err("page", "Page must be a whole number of 0 or more.");
            }

            if (from && to && entry.status && entry.strength) {
                result.push({
                    from_surah_id: from.id,
                    to_surah_id: to.id,
                    status: entry.status,
                    strength: entry.strength,
                    mistakes: mistakes !== null && Number.isInteger(mistakes) ? mistakes : null,
                    ...(section === "old_sabaq"
                        ? { page: Number.isInteger(page) && page >= 0 ? page : 0 }
                        : {}),
                });
                entryKeys[section].push(entry.key);
            }
        });

        return result;
    };

    const oldSabaq = revisionPayload("old_sabaq");
    const manzil = revisionPayload("manzil");

    const newSabaq: NewSabaqEntryPayload[] = [];

    data.new_sabaq.forEach((entry) => {
        if (isBlankNewSabaq(entry)) return;

        const err = (field: string, message: string) => {
            errors[entryErrorKey("new_sabaq", entry.key, field)] = message;
        };

        const from = byId.get(entry.from_surah_id);
        const to = byId.get(entry.to_surah_id);
        const fromAyah = Number(entry.from_ayah);
        const toAyah = Number(entry.to_ayah);

        if (!from) err("from_surah_id", "Select the starting Surah.");
        else if (!entry.from_ayah) err("from_ayah", "Select the starting ayah.");
        else if (!Number.isInteger(fromAyah) || fromAyah < 1 || fromAyah > from.ayahs) {
            err("from_ayah", `The ayah must be between 1 and ${from.ayahs}.`);
        }

        if (!to) err("to_surah_id", "Select the ending Surah.");
        else if (!entry.to_ayah) err("to_ayah", "Select the ending ayah.");
        else if (!Number.isInteger(toAyah) || toAyah < 1 || toAyah > to.ayahs) {
            err("to_ayah", `The ayah must be between 1 and ${to.ayahs}.`);
        }

        if (from && to) {
            if (to.number < from.number) {
                err("to_surah_id", "The ending Surah cannot be before the starting Surah.");
            } else if (to.id === from.id && entry.from_ayah && entry.to_ayah && toAyah < fromAyah) {
                err("to_ayah", "The ending ayah cannot be before the starting ayah.");
            }
        }

        const hasEntryError = Object.keys(errors).some((key) => key.startsWith(`new_sabaq.${entry.key}.`));

        if (from && to && !hasEntryError) {
            newSabaq.push({
                from_surah_id: from.id,
                from_ayah: fromAyah,
                to_surah_id: to.id,
                to_ayah: toAyah,
            });
            entryKeys.new_sabaq.push(entry.key);
        }
    });

    if (!sessionDate) {
        errors[FORM_ERROR_KEY] = "Select a session date in the date picker above.";
    } else if (
        Object.keys(errors).length === 0 &&
        oldSabaq.length === 0 && manzil.length === 0 && newSabaq.length === 0
    ) {
        errors[FORM_ERROR_KEY] = "Add at least one Old Sabaq, Manzil or New Sabaq entry.";
    }

    if (Object.keys(errors).length > 0 || !sessionDate) {
        return { errors, payload: null, entryKeys };
    }

    const notes = data.notes.trim();

    return {
        errors,
        entryKeys,
        payload: {
            session_date: sessionDate,
            notes: notes || null,
            // Always all three arrays (the update endpoint requires them)
            old_sabaq: oldSabaq,
            manzil,
            new_sabaq: newSabaq,
        },
    };
};

const SECTIONS: SessionSection[] = ["old_sabaq", "manzil", "new_sabaq"];

// Laravel 422 -> form errors. "old_sabaq.0.to_surah_id" goes to that entry's
// field; "old_sabaq" / "session_date" / anything else becomes a form error.
export const toSessionFormErrors = (
    validationErrors: ValidationErrors,
    entryKeys: Record<SessionSection, string[]>
): HifzSessionFormErrors => {

    const errors: HifzSessionFormErrors = {};

    const general: string[] = [];

    Object.entries(validationErrors).forEach(([key, messages]) => {
        const message = Array.isArray(messages) ? messages[0] : undefined;

        if (!message) return;

        const [section, index, field] = key.split(".");

        if (SECTIONS.includes(section as SessionSection) && index !== undefined && field) {
            const entryKey = entryKeys[section as SessionSection][Number(index)];

            if (entryKey) {
                errors[entryErrorKey(section as SessionSection, entryKey, field)] ??= message;
                return;
            }
        }

        if (key === "notes") {
            errors.notes ??= message;
            return;
        }

        if (!general.includes(message)) general.push(message);
    });

    if (general.length > 0) errors[FORM_ERROR_KEY] = general.join(" ");

    return errors;
};
