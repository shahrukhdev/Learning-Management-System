
import { useState } from "react";
import { ChevronLeft, ChevronRight, Megaphone } from "lucide-react";

import SEO from "../../../components/Seo/SEO";

import NoticeList from "../../../components/Notices/NoticesList";
import TablePageNumbers from "../../../components/Table/TablePageNumbers";

import { useNoticesList } from "../../../hooks/useNoticesList";

// Status badge and pagination footer styles (same as Admin / Teacher)
import "../../../components/Table/Table.css";
import "../../../components/Notices/Notices.css";
import "./Notices.css";

const DEFAULT_PER_PAGE = 10;
const PAGE_SIZE_OPTIONS = [10, 20, 30, 50];

// Student Notices (read only): GET /v1/notices. The backend returns only
// active notices to students. No New / Edit / Delete.
const StudentNotices = () => {

    /* Listing (server-side pagination, same as Admin / Teacher) */

    const [perPage, setPerPage] = useState(DEFAULT_PER_PAGE);

    // The page resets to 1 whenever the page size changes
    const [pageState, setPageState] = useState({ perPage, page: 1 });

    const page = pageState.perPage === perPage ? pageState.page : 1;

    const goToPage = (nextPage: number) => setPageState({ perPage, page: nextPage });

    const {
        notices,
        pagination,
        error,
        isLoading,
        hasLoaded,
        retry,
    } = useNoticesList({ page, perPage });

    const totalResults = pagination?.total ?? 0;
    const resultsPerPage = pagination?.per_page ?? perPage;
    const currentPage = pagination?.current_page ?? page;
    const totalPages = Math.max(pagination?.last_page ?? 1, 1);
    const firstResult = totalResults === 0 ? 0 : (currentPage - 1) * resultsPerPage + 1;
    const lastResult = Math.min(currentPage * resultsPerPage, totalResults);

    const renderNotices = () => {

        if (error) {
            return (
                <div className="notice-status">
                    <span>{error}</span>
                    <button type="button" className="table-retry-button" onClick={retry}>
                        Try again
                    </button>
                </div>
            );
        }

        if (notices.length === 0) {
            return isLoading ? (
                <div className="notice-status" role="status">
                    <span className="d-inline-flex align-items-center gap-2">
                        <span className="spinner-border spinner-border-sm" aria-hidden="true"></span>
                        Loading notices...
                    </span>
                </div>
            ) : (
                <div className="student-notices-empty">
                    <span className="notice-empty-icon" aria-hidden="true">
                        <Megaphone size={20} strokeWidth={2} />
                    </span>

                    <h3>No announcements yet</h3>

                    <p>
                        New notices and announcements
                        will appear here.
                    </p>
                </div>
            );
        }

        return (
            <div
                className={`notice-list ${isLoading && hasLoaded ? "is-loading" : ""}`}
                aria-busy={isLoading}
            >
                {notices.map((notice) => (
                    <NoticeList
                        key={notice.id}
                        notice={{
                            id: notice.id,
                            title: notice.title,
                            description: notice.message,
                        }}
                        isActive={Boolean(notice.is_active)}
                        date={notice.created_at}
                        postedBy={notice.posted_by?.name ?? null}
                    />
                ))}
            </div>
        );
    };

    return (
        <>
            <SEO
                title="Notices & Announcements | Noor Ul Imaan Masjid"
                description="View the latest notices and announcements for Noor Ul Imaan Masjid Madrassah."
            />

            <section className="student-notices-section">

                <div className="container-fluid">

                    <div className="row">

                        {/* Page Heading */}

                        <div className="col-12">

                            <div className="student-notices-head">

                                <div>
                                    <h1 className="section-title">
                                        Notices & Announcements
                                    </h1>

                                    <p className="notices-desc m-0">
                                        Stay updated with the latest madrassah
                                        announcements and important information.
                                    </p>
                                </div>

                            </div>

                        </div>


                        {/* Notice List */}

                        <div className="col-12">

                            <div className={`notice-box student-notice-box ${notices.length === 0 || error ? "is-empty" : ""}`}>

                                {renderNotices()}

                                {/* Pagination (existing table footer styles) */}
                                {hasLoaded && (
                                    <div className="table-footer">
                                        <div className="table-rows-per-page">
                                            <span>Rows per page:</span>
                                            <select
                                                value={perPage}
                                                onChange={(event) => setPerPage(Number(event.target.value))}
                                            >
                                                {PAGE_SIZE_OPTIONS.map((size) => (
                                                    <option key={size} value={size}>{size}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="table-results">
                                            Showing <strong>{firstResult}</strong>–<strong>{lastResult}</strong> of{" "}
                                            <strong>{totalResults}</strong> notices
                                        </div>
                                        <div className="table-pagination">
                                            <span>
                                                Page {page} of {totalPages}
                                            </span>
                                            <button
                                                type="button"
                                                disabled={page <= 1}
                                                onClick={() => goToPage(page - 1)}
                                                aria-label="Previous page"
                                            >
                                                <ChevronLeft size={16} strokeWidth={2} />
                                            </button>
                                            <TablePageNumbers
                                                page={page}
                                                totalPages={totalPages}
                                                onPageChange={goToPage}
                                            />
                                            <button
                                                type="button"
                                                disabled={page >= totalPages}
                                                onClick={() => goToPage(page + 1)}
                                                aria-label="Next page"
                                            >
                                                <ChevronRight size={16} strokeWidth={2} />
                                            </button>
                                        </div>
                                    </div>
                                )}

                            </div>

                        </div>

                    </div>

                </div>

            </section>
        </>
    );
};

export default StudentNotices;
