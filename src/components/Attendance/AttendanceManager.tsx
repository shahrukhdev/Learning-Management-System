import { useMemo, useRef, useState } from "react";
import { toast } from "react-toastify";

import AttendanceControls from "./AttendanceControls/AttendanceControls";
import type { AttendanceTab } from "./AttendanceTabs/AttendanceTabs";
import AttendanceStudentList from "./AttendanceStudentList/AttendanceStudentList";
import AttendanceOverviewTable from "./AttendanceOverviewTable/AttendanceOverviewTable";
import { addDays, getWeekStart, todayYmd } from "./attendanceDates";

import FilterBar from "../FilterBar/FilterBar";
import SEO from "../Seo/SEO";

import { useAcademicClassOptions } from "../../hooks/useAcademicClassOptions";
import { useClassAttendance } from "../../hooks/useClassAttendance";
import { useAttendanceOverview } from "../../hooks/useAttendanceOverview";
import { useDebouncedValue } from "../../hooks/useDebouncedValue";
import { saveAttendance } from "../../services/attendanceService";
import { parseApiError } from "../../utils/apiError";
import type { AttendanceStatus, MarkedAttendanceStatus } from "../../types/attendance.types";

// Same as Users Management
const SEARCH_DEBOUNCE_MS = 450;

// Stable empty value (keeps the memoized status map from recomputing)
const NO_EDITS: Record<number, MarkedAttendanceStatus> = {};

interface AttendanceManagerProps {
    // e.g. "teacher attendance-section" on the teacher page
    sectionClassName?: string;
}

// Attendance page (shared by the Admin and Teacher routes):
// - Mark Attendance: students of the selected class on the selected date
//   (GET /v1/attendances), marked in bulk and saved as one batch
//   (POST /v1/attendances).
// - Attendance Overview: Mon-Fri of a week for the same class
//   (GET /v1/attendances/overview).
const AttendanceManager = ({ sectionClassName = "attendance-section" }: AttendanceManagerProps) => {

    const [activeTab, setActiveTab] = useState<AttendanceTab>("mark-attendance");

    const [search, setSearch] = useState("");

    // Filters: the class dropdown and date picker change a draft; the Filter
    // button applies it (only applied values are requested)

    // Applied date (the attendance shown / saved)
    const [date, setDate] = useState(todayYmd);

    // Date picked but not applied yet
    const [draftDate, setDraftDate] = useState(todayYmd);

    // Overview week (Monday); follows the applied date, or prev/next
    const [weekStart, setWeekStart] = useState(() => getWeekStart(todayYmd()));

    /* --------------------------------
       Classes (Academic Classes API)
    -------------------------------- */

    const {
        classes,
        isLoading: classesLoading,
        error: classesError,
        retry: retryClasses,
    } = useAcademicClassOptions();

    // Applied class (null = the first class once they load)
    const [chosenClassId, setChosenClassId] = useState<number | null>(null);

    // Class picked but not applied yet (null = same as applied)
    const [draftClassId, setDraftClassId] = useState<number | null>(null);

    const isKnownClass = (id: number | null) => id !== null && classes.some((item) => item.id === id);

    // The applied class, or the first class once they load
    const selectedClassId = isKnownClass(chosenClassId) ? chosenClassId : classes[0]?.id ?? null;

    // Shown in the class dropdown
    const pendingClassId = isKnownClass(draftClassId) ? draftClassId : selectedClassId;

    /* --------------------------------
       Daily attendance (selected class + date)
    -------------------------------- */

    const {
        records,
        isLoading: attendanceLoading,
        error: attendanceError,
        selectionKey,
        reload: reloadAttendance,
        replaceRecords,
    } = useClassAttendance(selectedClassId, date);

    // Unsaved changes for the current class/date (student ID -> status)
    const [edits, setEdits] = useState<{ key: string | null; statuses: Record<number, MarkedAttendanceStatus> }>({
        key: null,
        statuses: {},
    });

    const [selection, setSelection] = useState<{ key: string | null; ids: number[] }>({ key: null, ids: [] });

    // Edits/selection only apply to the class/date they were made for
    const currentEdits = edits.key === selectionKey ? edits.statuses : NO_EDITS;

    const selectedStudents = selection.key === selectionKey ? selection.ids : [];

    // Saved status from the API, overridden by unsaved changes
    const attendance = useMemo(() => {
        const map: Record<number, AttendanceStatus> = {};

        records.forEach((record) => {
            map[record.student_id] = currentEdits[record.student_id] ?? record.status;
        });

        return map;
    }, [records, currentEdits]);

    /* --------------------------------
       Weekly overview (same class)
    -------------------------------- */

    const overview = useAttendanceOverview(
        selectedClassId,
        weekStart,
        activeTab === "attendance-overview"
    );

    const currentWeekStart = getWeekStart(todayYmd());

    /* --------------------------------
       Search (client-side, loaded students only)
    -------------------------------- */

    // Debounced like Users Management (loaded students only)
    const debouncedSearch = useDebouncedValue(search.trim(), SEARCH_DEBOUNCE_MS);

    const term = debouncedSearch.toLowerCase();

    const visibleStudents = term
        ? records.filter((record) =>
            record.name.toLowerCase().includes(term) ||
            (record.admission_number ?? "").toLowerCase().includes(term)
        )
        : records;

    const visibleOverview = term
        ? overview.records.filter((record) => record.student_name.toLowerCase().includes(term))
        : overview.records;

    /* --------------------------------
       Attendance Summary (whole class)
    -------------------------------- */

    const summary = useMemo(() => {

        const statuses = Object.values(attendance);

        return {
            total: records.length,
            present: statuses.filter((status) => status === "present").length,
            late: statuses.filter((status) => status === "late").length,
            absent: statuses.filter((status) => status === "absent").length,
            notMarked: statuses.filter((status) => status === "not-marked").length,
        };

    }, [attendance, records.length]);

    /* --------------------------------
       Select / Unselect Student
    -------------------------------- */

    const handleStudentSelect = (studentId: number) => {
        const ids = selectedStudents.includes(studentId)
            ? selectedStudents.filter((id) => id !== studentId)
            : [...selectedStudents, studentId];

        setSelection({ key: selectionKey, ids });
    };

    /* --------------------------------
       Select All / Deselect All (visible students)
    -------------------------------- */

    const visibleIds = visibleStudents.map((student) => student.student_id);

    const allVisibleSelected =
        visibleIds.length > 0 && visibleIds.every((id) => selectedStudents.includes(id));

    const handleSelectAll = () => {
        setSelection({ key: selectionKey, ids: allVisibleSelected ? [] : visibleIds });
    };

    /* --------------------------------
       Mark Attendance (local until saved)
    -------------------------------- */

    const handleMarkAttendance = (status: AttendanceStatus) => {

        if (selectedStudents.length === 0 || status === "not-marked") {
            return;
        }

        const statuses = { ...currentEdits };

        selectedStudents.forEach((studentId) => {
            statuses[studentId] = status;
        });

        setEdits({ key: selectionKey, statuses });

        setSelection({ key: selectionKey, ids: [] });
    };

    /* --------------------------------
       Class / Date Change
    -------------------------------- */

    const resetLocalChanges = () => {
        setEdits({ key: null, statuses: NO_EDITS });
        setSelection({ key: null, ids: [] });
    };

    // Picking a class or date only updates the draft (no request)
    const handleClassChange = (classId: number) => {
        setDraftClassId(classId);
    };

    const handleDateChange = (value: string) => {
        setDraftDate(value);
    };

    // Filter button: apply the picked class + date and load their data. With
    // nothing changed, the same data is requested again.
    const handleApplyFilters = () => {
        const nextClassId = pendingClassId;

        const isUnchanged = nextClassId === selectedClassId && draftDate === date;

        if (isUnchanged) {
            reloadAttendance();
            overview.invalidate();
            return;
        }

        setChosenClassId(nextClassId);
        setDraftClassId(null);
        setDate(draftDate);
        // Keep the overview on the week of the applied date
        setWeekStart(getWeekStart(draftDate));
        resetLocalChanges();
    };

    /* --------------------------------
       Save Attendance (batch)
    -------------------------------- */

    const [isSaving, setIsSaving] = useState(false);

    // Synchronous guard against double submits (state updates are async)
    const isSavingRef = useRef(false);

    const handleSave = async () => {

        if (isSavingRef.current || selectedClassId === null || selectionKey === null) return;

        // "not-marked" students are never submitted
        const attendances = records
            .map((record) => ({ student_id: record.student_id, status: attendance[record.student_id] }))
            .filter((item): item is { student_id: number; status: MarkedAttendanceStatus } =>
                item.status !== "not-marked"
            );

        if (attendances.length === 0) {
            toast.error("Please mark attendance for at least one student before saving.");
            return;
        }

        isSavingRef.current = true;
        setIsSaving(true);

        const savedKey = selectionKey;

        try {
            const response = await saveAttendance({
                academic_class_id: selectedClassId,
                attendance_date: date,
                attendances,
            });

            toast.success(response.message || "Attendance saved successfully.");

            // Saved values become the API values; unsaved changes are cleared
            if (response.records) {
                replaceRecords(savedKey, response.records);
            } else {
                reloadAttendance();
            }

            setEdits((current) => (current.key === savedKey ? { key: null, statuses: NO_EDITS } : current));

            // The weekly overview reloads with the saved attendance
            overview.invalidate();
        } catch (error) {
            const { status, message, validationErrors } = parseApiError(error);

            if (status === 422 && validationErrors) {
                // No per-field inputs here: show the first backend message
                const firstMessage = Object.values(validationErrors).find(
                    (messages) => Array.isArray(messages) && messages.length > 0
                )?.[0];

                toast.error(firstMessage || message);
            } else if (status !== 401) {
                toast.error(message);
            }
        } finally {
            isSavingRef.current = false;
            setIsSaving(false);
        }
    };

    // Options for the Filter Bar class select (commented out below; the class
    // dropdown above the student list is used instead)
    // const classFilterOptions =
    //     classes.length > 0
    //         ? classes.map((item) => ({ value: String(item.id), label: item.name }))
    //         : [{ value: "", label: classesLoading ? "Loading classes..." : "No classes" }];

    const overviewEmptyMessage = classesError
        ? classesError
        : classesLoading
            ? "Loading classes..."
            : selectedClassId === null
                ? "No classes found."
                : null;

    return (
        <>
            <SEO
                title="Attendance | Noor Ul Imaan Masjid"
                description="Manage your Noor Ul Imaan Masjid Madrassah Portal attendance."
            />

            <section className={sectionClassName}>
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-12">
                            <h1 className="section-title">
                                Attendance
                            </h1>
                        </div>

                        {/* Filter Bar: search (debounced), date, and Filter (applies
                            the class + date; class is picked below) */}
                        <div className="col-12">

                            <FilterBar
                                searchPlaceholder="Search students..."
                                searchValue={search}
                                onSearchChange={setSearch}
                                // Spinner until the typed text is applied (450ms)
                                isSearching={search.trim() !== debouncedSearch}
                                isSearchApplied={debouncedSearch !== ""}

                                // Class select hidden for now (the class dropdown
                                // above the student list is used). Uncomment to
                                // bring it back, together with classFilterOptions.
                                // classValue={pendingClassId !== null ? String(pendingClassId) : ""}
                                // onClassChange={(value) => {
                                //     if (value) handleClassChange(Number(value));
                                // }}
                                // classOptions={classFilterOptions}

                                dateValue={draftDate}
                                onDateChange={handleDateChange}

                                filterButtonLabel="Filter"
                                onFilterClick={handleApplyFilters}
                            />

                        </div>


                        {/* Attendance Controls */}
                        <div className="col-12">
                            <AttendanceControls
                                summary={summary}
                                selectedStudents={selectedStudents}
                                totalStudents={visibleStudents.length}
                                onSelectAll={handleSelectAll}
                                onMarkAttendance={handleMarkAttendance}
                                attendance={attendance}
                                activeTab={activeTab}
                                onTabChange={setActiveTab}
                            />
                        </div>

                        {activeTab === "mark-attendance" && (
                            <>
                                {/* Attendance Student List */}
                                <div className="col-12">
                                    <AttendanceStudentList
                                        students={visibleStudents}
                                        totalStudents={records.length}
                                        attendance={attendance}
                                        selectedStudents={selectedStudents}
                                        onStudentSelect={handleStudentSelect}
                                        classOptions={classes}
                                        selectedClassId={pendingClassId}
                                        onClassChange={handleClassChange}
                                        classesLoading={classesLoading}
                                        classesError={classesError}
                                        onRetryClasses={retryClasses}
                                        date={date}
                                        isLoading={attendanceLoading}
                                        error={attendanceError}
                                        onRetry={reloadAttendance}
                                        onSave={handleSave}
                                        isSaving={isSaving}
                                    />
                                </div>
                            </>
                        )}

                        {activeTab === "attendance-overview" && (
                            <>
                                {/* Attendance Overview Table */}
                                <div className="col-12">
                                    <AttendanceOverviewTable
                                        records={visibleOverview}
                                        weekStart={weekStart}
                                        isLoading={overview.isLoading}
                                        error={overview.error}
                                        onRetry={overview.retry}
                                        onPreviousWeek={() => setWeekStart((current) => addDays(current, -7))}
                                        onNextWeek={() => setWeekStart((current) => addDays(current, 7))}
                                        canGoToNextWeek={weekStart < currentWeekStart}
                                        emptyMessage={overviewEmptyMessage}
                                    />
                                </div>
                            </>
                        )}

                    </div>
                </div>
            </section>

        </>
    );
};

export default AttendanceManager;
