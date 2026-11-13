import { useMemo, useRef, useState } from "react";
import { BookOpen } from "lucide-react";
import { toast } from "react-toastify";

import "./HifzStudentDetails.css";

import HifzStudentHeader from "./HifzStudentHeader/HifzStudentHeader";
import HifzStudentStates from "./HifzStudentStates/HifzStudentStates";

import HifzStudentTabs, { type HifzStudentTab } from "./HifzTabs/HifzTabs";

import HifzStudentLog, { type SessionSubmitResult } from "./HifzStudentLog/HifzStudentLog";
import HifzStudentSessions from "./HifzStudentSessions/HifzStudentSessions";
import { formatSessionDate } from "./HifzStudentSessions/formatSessionDate";
import QuranMap, { type SurahStatusSaveResult } from "./QuranMap/QuranMap";
import SurahList from "./SurahList/SurahList";
import ConfirmPopup from "../../Popups/ConfirmPopup/ConfirmPopup";

import type { Juz, Surah, SurahStatus, SurahStatuses } from "./QuranMap/QuranMap.data";
import { useQuranData, type SurahJuzRange } from "../../../hooks/useQuranData";
import { useStudentSurahProgress } from "../../../hooks/useStudentSurahProgress";
import { useStudentQuranMap } from "../../../hooks/useStudentQuranMap";
import { useHifzSessions } from "../../../hooks/useHifzSessions";
import { useHifzStatistics } from "../../../hooks/useHifzStatistics";
import {
    createSurahProgress,
    deleteSurahProgress,
    updateSurahProgress,
} from "../../../services/surahProgressService";
import {
    createHifzSession,
    deleteHifzSession,
    getHifzSession,
    updateHifzSession,
} from "../../../services/hifzSessionService";
import { parseApiError } from "../../../utils/apiError";
import type { SurahProgressRecord } from "../../../types/surahProgress.types";
import type { HifzSession, SaveHifzSessionRequest } from "../../../types/hifzSession.types";
import { usePermissions } from "../../../hooks/usePermissions";
import { PERMISSIONS } from "../../../utils/permissions";

interface HifzStudentDetailsProps {
    // The student selected in the tracker's student list
    studentId: number;
    // Same number as the student's card in the list
    studentNumber?: number | null;
    // Same name as the student's card in the list
    studentName?: string;
    // The tracker's date (header date picker), owned by the Hifz page so the
    // student list shows attendance for the same date. null = all sessions.
    date: string | null;
    onDateChange: (date: string | null) => void;
}

// First 422 message for the given fields, else the general message
const getValidationMessage = (
    validationErrors: Record<string, string[]> | null,
    fields: string[],
    fallback: string
) => {
    for (const field of fields) {
        const messages = validationErrors?.[field];
        if (Array.isArray(messages) && messages.length > 0) return messages[0];
    }

    return fallback;
};

const HifzStudentDetails = ({
    studentId,
    studentNumber = null,
    studentName = "",
    date,
    onDateChange: setDate,
}: HifzStudentDetailsProps) => {
    const [activeTab, setActiveTab] = useState<HifzStudentTab>("student-log");

    /* --------------------------------
       Permissions ("View Hifz" is checked by the /hifz route)
    -------------------------------- */

    const { hasPermission } = usePermissions();

    const canViewSessions = hasPermission(PERMISSIONS.VIEW_HIFZ_SESSIONS);

    const canCreateSession = hasPermission(PERMISSIONS.CREATE_HIFZ_SESSION);

    const canEditSession = hasPermission(PERMISSIONS.EDIT_HIFZ_SESSION);

    const canDeleteSession = hasPermission(PERMISSIONS.DELETE_HIFZ_SESSION);

    // The tracker's date (props): filters the Sessions tab and is the date of
    // a new session. Cleared = all sessions.

    // Surahs (selectors) + Juz (names), loaded once and shared
    const quran = useQuranData();

    /* --------------------------------
       Quran map of the selected student (read-only, source of truth for
       statuses + statistics)
    -------------------------------- */

    const quranMap = useStudentQuranMap(studentId);

    const { reload: reloadQuranMap } = quranMap;

    const mapSurahs = useMemo(() => quranMap.map?.surahs ?? [], [quranMap.map]);

    const statuses = useMemo(() => {
        const map: SurahStatuses = {};
        mapSurahs.forEach((surah) => {
            map[surah.id] = surah.status;
        });
        return map;
    }, [mapSurahs]);

    // Juz rows built from each Surah's `juz_ranges` (names from the Juz API)
    const { mapJuz, mapSurahJuzRanges } = useMemo(() => {
        const juzByNumber = new Map(quran.juz.map((item) => [item.number, item]));

        const rows = new Map<number, Juz>();
        const rangesBySurah = new Map<number, SurahJuzRange[]>();

        mapSurahs.forEach((surah) => {
            surah.juz_ranges.forEach((range) => {
                let row = rows.get(range.juz_number);

                if (!row) {
                    const known = juzByNumber.get(range.juz_number);
                    row = {
                        id: known?.id ?? range.juz_number,
                        number: range.juz_number,
                        name: known?.name ?? "",
                        surah_ranges: [],
                    };
                    rows.set(range.juz_number, row);
                }

                row.surah_ranges.push({
                    id: 0,
                    surah,
                    start_ayah: range.start_ayah,
                    end_ayah: range.end_ayah,
                });

                const list = rangesBySurah.get(surah.id) ?? [];
                list.push({ juz: row, start_ayah: range.start_ayah, end_ayah: range.end_ayah });
                rangesBySurah.set(surah.id, list);
            });
        });

        return {
            mapJuz: [...rows.values()].sort((a, b) => a.number - b.number),
            mapSurahJuzRanges: rangesBySurah,
        };
    }, [mapSurahs, quran.juz]);

    /* --------------------------------
       Hifz statistics (stats block; refreshed after Surah progress changes,
       not after session changes)
    -------------------------------- */

    const statistics = useHifzStatistics(studentId);

    const { reload: reloadStatistics } = statistics;

    /* --------------------------------
       Surah progress (record IDs for add / update / delete)
    -------------------------------- */

    const progress = useStudentSurahProgress(studentId);

    const { reload: reloadProgress, updateRecords } = progress;

    const recordsBySurahId = useMemo(
        () => new Map(progress.records.map((record) => [record.surah.id, record])),
        [progress.records]
    );

    const upsertRecord = (forStudentId: number, record: SurahProgressRecord) => {
        updateRecords(forStudentId, (records) => [
            ...records.filter((item) => item.id !== record.id && item.surah.id !== record.surah.id),
            record,
        ]);
    };

    // Surahs with a request in flight (blocks duplicate requests per Surah)
    const savingSurahIds = useRef(new Set<number>());

    const handleSaveStatus = async (surah: Surah, status: SurahStatus): Promise<SurahStatusSaveResult> => {

        const record = recordsBySurahId.get(surah.id);

        const currentStatus: SurahStatus = record?.status ?? "not-started";

        if (status === currentStatus) return { outcome: "done" };

        // Not Started = remove the record (after confirmation)
        if (status === "not-started") {
            if (record) setDeleteProgressTarget({ studentId, record });
            return { outcome: record ? "confirm" : "done" };
        }

        if (savingSurahIds.current.has(surah.id)) return { outcome: "error", message: null };

        savingSurahIds.current.add(surah.id);

        const forStudentId = studentId;

        try {
            const response = record
                ? await updateSurahProgress(record.id, { status })
                : await createSurahProgress(forStudentId, { surah_id: surah.id, status });

            toast.success(response.message || (record ? "Surah progress updated successfully." : "Surah progress added successfully."));

            if (response.record) {
                upsertRecord(forStudentId, response.record);
            } else {
                reloadProgress();
            }

            // Quran map statuses + Hifz statistics change with progress
            reloadQuranMap();
            reloadStatistics();

            return { outcome: "done" };
        } catch (error) {
            const { status: httpStatus, message, validationErrors } = parseApiError(error);

            if (httpStatus === 422) {
                return {
                    outcome: "error",
                    message: getValidationMessage(validationErrors, ["surah_id", "status"], message),
                };
            }

            if (httpStatus !== 401) toast.error(message);

            if (httpStatus === 404) {
                reloadProgress();
                reloadQuranMap();
                reloadStatistics();
            }

            return { outcome: "error", message: null };
        } finally {
            savingSurahIds.current.delete(surah.id);
        }
    };

    const [deleteProgressTarget, setDeleteProgressTarget] =
        useState<{ studentId: number; record: SurahProgressRecord } | null>(null);

    const [isDeletingProgress, setIsDeletingProgress] = useState(false);

    const isDeletingProgressRef = useRef(false);

    const activeDeleteProgress = deleteProgressTarget?.studentId === studentId ? deleteProgressTarget : null;

    const handleConfirmDeleteProgress = async () => {
        if (!activeDeleteProgress || isDeletingProgressRef.current) return;

        const { studentId: forStudentId, record } = activeDeleteProgress;

        isDeletingProgressRef.current = true;
        setIsDeletingProgress(true);

        try {
            const response = await deleteSurahProgress(record.id);

            toast.success(response.message || "Surah progress deleted successfully.");

            updateRecords(forStudentId, (records) => records.filter((item) => item.id !== record.id));

            reloadQuranMap();
            reloadStatistics();

            setDeleteProgressTarget(null);
        } catch (error) {
            const { status, message } = parseApiError(error);

            if (status !== 401) toast.error(message);

            if (status === 404) {
                reloadProgress();
                reloadQuranMap();
                reloadStatistics();
                setDeleteProgressTarget(null);
            }
        } finally {
            isDeletingProgressRef.current = false;
            setIsDeletingProgress(false);
        }
    };

    /* --------------------------------
       Hifz sessions (selected student + date)
    -------------------------------- */

    // Requested only with "View Hifz Sessions"
    const sessions = useHifzSessions(canViewSessions ? studentId : null, date);

    const { reload: reloadSessions, removeSession } = sessions;

    /* --------------------------------
       Selected session (page progress)
    -------------------------------- */

    // Picked session, tied to its student (null = the latest session)
    const [pickedSession, setPickedSession] = useState<{ studentId: number; sessionId: number } | null>(null);

    // Latest loaded session: newest date, then highest ID
    const latestSession = useMemo(
        () =>
            sessions.sessions.reduce<HifzSession | null>((latest, session) => {
                if (!latest) return session;
                if (session.session_date !== latest.session_date) {
                    return session.session_date > latest.session_date ? session : latest;
                }
                return session.id > latest.id ? session : latest;
            }, null),
        [sessions.sessions]
    );

    // The picked session while it is still listed, else the latest one
    const selectedSession =
        (pickedSession?.studentId === studentId
            ? sessions.sessions.find((session) => session.id === pickedSession.sessionId)
            : undefined) ?? latestSession;

    // Pages: completed = page of the selected session's last Old Sabaq entry,
    // total from the statistics API. With no session listed (e.g. none on the
    // filtered date) the API's own figure (latest session overall) is used.
    const pageProgress = useMemo(() => {
        const pages = statistics.statistics?.pages;

        if (!pages) return null;

        if (!selectedSession) return pages;

        const lastOldSabaq = selectedSession.old_sabaq[selectedSession.old_sabaq.length - 1];

        const completed = lastOldSabaq?.page ?? 0;

        const percentage = pages.total > 0 ? Math.round((completed / pages.total) * 10000) / 100 : 0;

        return { completed, total: pages.total, percentage };
    }, [statistics.statistics, selectedSession]);

    const handleSelectSession = (session: HifzSession) => {
        setPickedSession({ studentId, sessionId: session.id });
    };

    // Session being edited in the Student Log (only for its own student)
    const [editing, setEditing] = useState<{ studentId: number; session: HifzSession } | null>(null);

    const activeEditing = editing?.studentId === studentId && canEditSession ? editing : null;

    // Remounts the create form after a successful save (clears it)
    const [formVersion, setFormVersion] = useState(0);

    const [loadingSession, setLoadingSession] = useState<{ studentId: number; id: number } | null>(null);

    const loadingSessionId = loadingSession?.studentId === studentId ? loadingSession.id : null;

    // Edit: fetch the session, then open it in the Student Log
    const handleEditSession = async (session: HifzSession) => {
        if (loadingSession || !canEditSession) return;

        const forStudentId = studentId;

        setLoadingSession({ studentId: forStudentId, id: session.id });

        try {
            const fresh = await getHifzSession(forStudentId, session.id);

            setEditing({ studentId: forStudentId, session: fresh ?? session });

            setActiveTab("student-log");
        } catch (error) {
            const { status, message } = parseApiError(error);

            if (status !== 401) toast.error(message);

            if (status === 404) reloadSessions();
        } finally {
            setLoadingSession(null);
        }
    };

    /* --------------------------------
       Tabs allowed for this user. Student Log is the session form: shown
       with "Create Hifz Session", or while editing ("Edit Hifz Session").
    -------------------------------- */

    const visibleTabs: HifzStudentTab[] = [
        ...(canCreateSession || activeEditing ? (["student-log"] as const) : []),
        "quran-map",
        "surah-list",
        ...(canViewSessions ? (["sessions"] as const) : []),
    ];

    // Never stay on a hidden tab: fall back to the first allowed one
    const currentTab = visibleTabs.includes(activeTab) ? activeTab : visibleTabs[0];

    const handleCancelEdit = () => {
        setEditing(null);
        setActiveTab("sessions");
    };

    // Create or update (the form validates first)
    const handleSubmitSession = async (payload: SaveHifzSessionRequest): Promise<SessionSubmitResult> => {

        const forStudentId = studentId;

        const editingSession = activeEditing?.session ?? null;

        // Saving needs the matching permission (edit or create)
        if (editingSession ? !canEditSession : !canCreateSession) return { outcome: "error" };

        try {
            let message: string;

            if (editingSession) {
                // An updated session stays selected
                ({ message } = await updateHifzSession(forStudentId, editingSession.id, payload));
            } else {
                const created = await createHifzSession(forStudentId, payload);

                message = created.message;

                // A new session becomes the selected one (the latest when
                // the response does not include it)
                setPickedSession(
                    created.session ? { studentId: forStudentId, sessionId: created.session.id } : null
                );
            }

            toast.success(message || (editingSession ? "Session updated successfully." : "Session created successfully."));

            reloadSessions();

            // Page figures in the statistics come from the latest session
            reloadStatistics();

            if (editingSession) {
                setEditing(null);
                setActiveTab("sessions");
            } else {
                setFormVersion((version) => version + 1);
            }

            return { outcome: "done" };
        } catch (error) {
            const { status, message, validationErrors } = parseApiError(error);

            if (status === 422 && validationErrors) {
                return { outcome: "invalid", validationErrors };
            }

            // 403 = not allowed (backend message), 404 = session gone, etc.
            if (status !== 401) toast.error(message);

            if (status === 404 && editingSession) {
                setEditing(null);
                reloadSessions();
            }

            return { outcome: "error" };
        }
    };

    const [deleteSessionTarget, setDeleteSessionTarget] =
        useState<{ studentId: number; session: HifzSession } | null>(null);

    const [isDeletingSession, setIsDeletingSession] = useState(false);

    const isDeletingSessionRef = useRef(false);

    const activeDeleteSession = deleteSessionTarget?.studentId === studentId ? deleteSessionTarget : null;

    const handleConfirmDeleteSession = async () => {
        if (!activeDeleteSession || isDeletingSessionRef.current || !canDeleteSession) return;

        const { studentId: forStudentId, session } = activeDeleteSession;

        isDeletingSessionRef.current = true;
        setIsDeletingSession(true);

        try {
            const response = await deleteHifzSession(forStudentId, session.id);

            toast.success(response.message || "Session deleted successfully.");

            removeSession(forStudentId, session.id);

            // Deleting the selected session selects the latest remaining one
            setPickedSession((current) =>
                current && current.studentId === forStudentId && current.sessionId === session.id ? null : current
            );

            reloadStatistics();

            // Stop editing a session that no longer exists
            setEditing((current) =>
                current && current.studentId === forStudentId && current.session.id === session.id ? null : current
            );

            setDeleteSessionTarget(null);
        } catch (error) {
            const { status, message } = parseApiError(error);

            if (status !== 401) toast.error(message);

            if (status === 404) {
                reloadSessions();
                setDeleteSessionTarget(null);
            }
        } finally {
            isDeletingSessionRef.current = false;
            setIsDeletingSession(false);
        }
    };

    /* --------------------------------
       Loading / error / empty states
    -------------------------------- */

    // Quran Map and Surah List come from the student's Quran map
    const renderQuranMapStatus = (emptyText: string) => {

        if (quranMap.error) {
            return (
                <div className="hifz-data-status">
                    <span>{quranMap.error}</span>
                    <button type="button" className="table-retry-button" onClick={reloadQuranMap}>
                        Try again
                    </button>
                </div>
            );
        }

        if (!quranMap.map) {
            return (
                <div className="hifz-data-status" role="status">
                    <span className="d-inline-flex align-items-center gap-2">
                        <span className="spinner-border spinner-border-sm" aria-hidden="true"></span>
                        Loading Quran map...
                    </span>
                </div>
            );
        }

        if (mapSurahs.length === 0) {
            return (
                <div className="hifz-data-status">
                    <span className="hifz-data-empty-icon" aria-hidden="true">
                        <BookOpen size={20} strokeWidth={2} />
                    </span>
                    <p className="hifz-data-empty-title">{emptyText}</p>
                </div>
            );
        }

        return null;
    };

    // Compact note above the Quran Map about the Surah progress
    const renderProgressNote = () => {

        if (progress.error) {
            return (
                <div className="hifz-progress-note error" role="alert">
                    <span>{progress.error}</span>
                    <button type="button" className="table-retry-button" onClick={reloadProgress}>
                        Try again
                    </button>
                </div>
            );
        }

        if (progress.isLoading || quranMap.isLoading) {
            return (
                <div className="hifz-progress-note" role="status">
                    <span className="spinner-border spinner-border-sm" aria-hidden="true"></span>
                    {progress.isLoading ? "Loading progress..." : "Updating Quran map..."}
                </div>
            );
        }

        if (progress.hasLoaded && progress.records.length === 0) {
            return (
                <div className="hifz-progress-note">
                    No Surah progress recorded yet. Tap a Surah to add it.
                </div>
            );
        }

        return null;
    };

    // Editable once the student's progress and Quran map have loaded
    const canEditProgress = progress.hasLoaded && !progress.isLoading && quranMap.map !== null;

    return (
        <div className="hifz-student-details hifz-box">
            <HifzStudentHeader date={date} onDateChange={setDate} studentNumber={studentNumber} studentName={studentName} />

            <HifzStudentStates
                statistics={statistics.statistics}
                pageProgress={pageProgress}
                isLoading={statistics.isLoading}
                error={statistics.error}
                onRetry={reloadStatistics}
            />

            <HifzStudentTabs
                activeTab={currentTab}
                onTabChange={setActiveTab}
                visibleTabs={visibleTabs}
            />

            <div className="hifz-student-tab-content">
                {currentTab === "student-log" && (
                    <>
                        {activeEditing && (
                            <div className="hifz-edit-banner">
                                <span>
                                    Editing session of <strong>{formatSessionDate(activeEditing.session.session_date)}</strong>
                                </span>
                                <button type="button" className="table-retry-button" onClick={handleCancelEdit}>
                                    Cancel editing
                                </button>
                            </div>
                        )}

                        <HifzStudentLog
                            key={
                                activeEditing
                                    ? `edit-${studentId}-${activeEditing.session.id}`
                                    : `create-${studentId}-${formVersion}`
                            }
                            surahs={quran.surahs}
                            surahsLoading={quran.isLoading}
                            surahsError={quran.error}
                            onRetrySurahs={quran.retry}
                            sessionDate={activeEditing ? activeEditing.session.session_date : date}
                            editingSession={activeEditing?.session ?? null}
                            onSubmit={handleSubmitSession}
                            onCancel={handleCancelEdit}
                        />
                    </>
                )}

                {currentTab === "quran-map" && (
                    renderQuranMapStatus("No Surahs found.") ?? (
                        <>
                            {renderProgressNote()}
                            <QuranMap
                                juz={mapJuz}
                                surahJuzRanges={mapSurahJuzRanges}
                                statuses={statuses}
                                canEdit={canEditProgress}
                                onSaveStatus={handleSaveStatus}
                            />
                        </>
                    )
                )}

                {currentTab === "surah-list" && (
                    renderQuranMapStatus("No Surahs found.") ?? (
                        <SurahList
                            surahs={mapSurahs}
                            surahJuzRanges={mapSurahJuzRanges}
                            statuses={statuses}
                        />
                    )
                )}

                {currentTab === "sessions" && (
                    <HifzStudentSessions
                        sessions={sessions.sessions}
                        isLoading={sessions.isLoading}
                        error={sessions.error}
                        onRetry={reloadSessions}
                        date={date}
                        onShowAllDates={() => setDate(null)}
                        surahs={quran.surahs}
                        onEdit={canEditSession ? handleEditSession : undefined}
                        onDelete={
                            canDeleteSession
                                ? (session) => setDeleteSessionTarget({ studentId, session })
                                : undefined
                        }
                        loadingSessionId={loadingSessionId}
                        selectedSessionId={selectedSession?.id ?? null}
                        onSelect={handleSelectSession}
                    />
                )}
            </div>

            <ConfirmPopup
                isOpen={activeDeleteProgress !== null}
                title="Remove Surah Progress"
                message={
                    <>
                        Are you sure you want to remove{" "}
                        <strong>
                            {activeDeleteProgress?.record.surah.number}. {activeDeleteProgress?.record.surah.name}
                        </strong>{" "}
                        from this student&apos;s progress? It will show as Not Started.
                    </>
                }
                confirmLabel="Remove"
                processingLabel="Removing..."
                isProcessing={isDeletingProgress}
                onConfirm={handleConfirmDeleteProgress}
                onCancel={() => setDeleteProgressTarget(null)}
            />

            <ConfirmPopup
                isOpen={activeDeleteSession !== null && canDeleteSession}
                title="Delete Session"
                message={
                    <>
                        Are you sure you want to delete the session of{" "}
                        <strong>
                            {activeDeleteSession ? formatSessionDate(activeDeleteSession.session.session_date) : ""}
                        </strong>
                        ? This action cannot be undone.
                    </>
                }
                confirmLabel="Delete"
                processingLabel="Deleting..."
                isProcessing={isDeletingSession}
                onConfirm={handleConfirmDeleteSession}
                onCancel={() => setDeleteSessionTarget(null)}
            />
        </div>
    );
};

export default HifzStudentDetails;
