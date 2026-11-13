
import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import SEO from "../../../components/Seo/SEO";

import StudentHifzHeader from "../../../components/StudentComponents/StudentHifz/StudentHifzHeader/StudentHifzHeader";
import StudentHifzStates from "../../../components/StudentComponents/StudentHifz/StudentHifzStates/StudentHifzStates";
import StudentHifzTabs, { type StudentHifzTab } from "../../../components/StudentComponents/StudentHifz/StudentHifzTabs/StudentHifzTabs";

import StudentQuranMap from "../../../components/StudentComponents/StudentHifz/StudentQuranMap/StudentQuranMap";
import SurahList from "../../../components/Hifz/HifzStudentDetails/SurahList/SurahList";
import HifzStudentSessions from "../../../components/Hifz/HifzStudentDetails/HifzStudentSessions/HifzStudentSessions";
import TablePageNumbers from "../../../components/Table/TablePageNumbers";

import type { Juz, SurahStatuses } from "../../../components/Hifz/HifzStudentDetails/QuranMap/QuranMap.data";
import type { SurahJuzRange } from "../../../hooks/useQuranData";
import { useAuth } from "../../../hooks/useAuth";
import { useMyHifz, useMyHifzSessions } from "../../../hooks/useMyHifz";

import "../../../components/Table/Table.css";
// Loading / error / empty line styles (same as the Admin / Teacher tracker)
import "../../../components/Hifz/HifzStudentDetails/HifzStudentDetails.css";
import "./Hifz.css";

// Backend default page size
const SESSIONS_PER_PAGE = 10;

// Student "My Hifz" (read only): GET /v1/my-hifz + GET /v1/my-hifz/sessions.
// Separate from the Admin / Teacher Hifz tracker; same /hifz URL.
const StudentHifz = () => {

    const { user } = useAuth();

    const [activeTab, setActiveTab] = useState<StudentHifzTab>("quran-map");

    /* Profile + statistics + Quran map */

    const { hifz, error, isLoading, retry } = useMyHifz();

    const mapSurahs = useMemo(() => hifz?.quran_map.surahs ?? [], [hifz]);

    const statuses = useMemo(() => {
        const map: SurahStatuses = {};
        mapSurahs.forEach((surah) => {
            map[surah.id] = surah.status;
        });
        return map;
    }, [mapSurahs]);

    // Juz rows + Surah -> Juz ranges, from each Surah's `juz_ranges`
    // (same structure the Admin / Teacher Quran map uses)
    const { mapJuz, mapSurahJuzRanges } = useMemo(() => {
        const rows = new Map<number, Juz>();
        const rangesBySurah = new Map<number, SurahJuzRange[]>();

        mapSurahs.forEach((surah) => {
            surah.juz_ranges.forEach((range) => {
                let row = rows.get(range.juz_number);

                if (!row) {
                    row = { id: range.juz_number, number: range.juz_number, name: "", surah_ranges: [] };
                    rows.set(range.juz_number, row);
                }

                row.surah_ranges.push({ id: 0, surah, start_ayah: range.start_ayah, end_ayah: range.end_ayah });

                const list = rangesBySurah.get(surah.id) ?? [];
                list.push({ juz: row, start_ayah: range.start_ayah, end_ayah: range.end_ayah });
                rangesBySurah.set(surah.id, list);
            });
        });

        return {
            mapJuz: [...rows.values()].sort((a, b) => a.number - b.number),
            mapSurahJuzRanges: rangesBySurah,
        };
    }, [mapSurahs]);

    /* Sessions (paginated, newest first) */

    const [sessionsPage, setSessionsPage] = useState(1);

    const sessions = useMyHifzSessions({ page: sessionsPage, perPage: SESSIONS_PER_PAGE });

    // Highlight only (students have no Edit / Delete)
    const [selectedSessionId, setSelectedSessionId] = useState<number | null>(null);

    const totalPages = Math.max(sessions.pagination?.last_page ?? 1, 1);

    const renderMapStatus = (emptyText: string) => {
        if (!hifz && isLoading) {
            return (
                <div className="hifz-data-status" role="status">
                    <span className="d-inline-flex align-items-center gap-2">
                        <span className="spinner-border spinner-border-sm" aria-hidden="true"></span>
                        Loading...
                    </span>
                </div>
            );
        }

        if (!hifz && error) {
            return (
                <div className="hifz-data-status">
                    <span>{error}</span>
                    <button type="button" className="table-retry-button" onClick={retry}>
                        Try again
                    </button>
                </div>
            );
        }

        if (mapSurahs.length === 0) {
            return <div className="hifz-data-status">{emptyText}</div>;
        }

        return null;
    };

    return (
        <>
            <SEO
                title="My Hifz | Noor Ul Imaan Masjid"
                description="View your Quran memorisation progress and Hifz sessions."
            />

            <section className="student-hifz-section">
                <div className="container-fluid">

                    {/* Page Heading */}
                    <div className="student-hifz-page-heading">
                        <h1 className="section-title m-0">
                            My Hifz
                        </h1>

                        <p className="section-desc-para">
                            Track your Quran memorisation journey and progress.
                        </p>
                    </div>

                    {/* Student Profile */}
                    <StudentHifzHeader student={hifz?.student ?? null} fallbackName={user?.name ?? ""} />

                    {/* Hifz Summary */}
                    <StudentHifzStates statistics={hifz?.statistics ?? null} />

                    {/* Tabs */}
                    <StudentHifzTabs
                        activeTab={activeTab}
                        onTabChange={setActiveTab}
                    />

                    {/* Tab Content */}
                    <div className="student-hifz-tab-content">

                        {activeTab === "quran-map" && (
                            renderMapStatus("No Surahs found.") ?? (
                                <StudentQuranMap
                                    juz={mapJuz}
                                    statuses={statuses}
                                />
                            )
                        )}

                        {activeTab === "surah-list" && (
                            renderMapStatus("No Surahs found.") ?? (
                                <SurahList
                                    surahs={mapSurahs}
                                    surahJuzRanges={mapSurahJuzRanges}
                                    statuses={statuses}
                                />
                            )
                        )}

                        {activeTab === "sessions" && (
                            <>
                                {/* View only: no onEdit / onDelete, no date filter */}
                                <HifzStudentSessions
                                    sessions={sessions.sessions}
                                    isLoading={sessions.isLoading}
                                    error={sessions.error}
                                    onRetry={sessions.retry}
                                    date={null}
                                    onShowAllDates={() => undefined}
                                    surahs={mapSurahs}
                                    loadingSessionId={null}
                                    selectedSessionId={selectedSessionId}
                                    onSelect={(session) => setSelectedSessionId(session.id)}
                                />

                                {/* Pagination (existing table footer styles) */}
                                {sessions.hasLoaded && totalPages > 1 && (
                                    <div className="table-footer">
                                        <div className="table-pagination ms-auto">
                                            <span>
                                                Page {sessionsPage} of {totalPages}
                                            </span>
                                            <button
                                                type="button"
                                                disabled={sessionsPage <= 1 || sessions.isLoading}
                                                onClick={() => setSessionsPage(sessionsPage - 1)}
                                                aria-label="Previous page"
                                            >
                                                <ChevronLeft size={16} strokeWidth={2} />
                                            </button>
                                            <TablePageNumbers
                                                page={sessionsPage}
                                                totalPages={totalPages}
                                                onPageChange={setSessionsPage}
                                                disabled={sessions.isLoading}
                                            />
                                            <button
                                                type="button"
                                                disabled={sessionsPage >= totalPages || sessions.isLoading}
                                                onClick={() => setSessionsPage(sessionsPage + 1)}
                                                aria-label="Next page"
                                            >
                                                <ChevronRight size={16} strokeWidth={2} />
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}

                    </div>

                </div>
            </section>
        </>
    );
};

export default StudentHifz;
