import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Megaphone, Plus } from "lucide-react";
import { toast } from "react-toastify";
import SEO from "../../../components/Seo/SEO";

import NoticeList from "../../../components/Notices/NoticesList";
import "../../../components/Notices/Notices.css";
// Existing status badge and pagination footer styles
import "../../../components/Table/Table.css";
import AnnoucementsPopup from "../../../components/Popups/AnnouncementsPopup/AnnoucementsPopup";
import ConfirmPopup from "../../../components/Popups/ConfirmPopup/ConfirmPopup";
import TablePageNumbers from "../../../components/Table/TablePageNumbers";

import { useNoticesList } from "../../../hooks/useNoticesList";
import { deleteNotice } from "../../../services/noticeService";
import { parseApiError } from "../../../utils/apiError";
import { usePermissions } from "../../../hooks/usePermissions";
import { PERMISSIONS } from "../../../utils/permissions";
import type { NoticeItem } from "../../../types/notice.types";

const DEFAULT_PER_PAGE = 10;
const PAGE_SIZE_OPTIONS = [10, 20, 30, 50];

const Notices = () => {

    /* =========================
       Listing (GET /v1/notices, server-side pagination)
    ========================= */

    const [perPage, setPerPage] = useState(DEFAULT_PER_PAGE);

    // The page resets to 1 whenever the page size changes. It is derived in
    // the same render, so each change sends exactly one request.
    const filterKey = `${perPage}`;

    const [pageState, setPageState] = useState({ key: filterKey, page: 1 });

    const page = pageState.key === filterKey ? pageState.page : 1;

    const goToPage = (nextPage: number) => setPageState({ key: filterKey, page: nextPage });

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

    /* =========================
       Permissions (View is checked by the route; actions here)
    ========================= */

    const { hasPermission } = usePermissions();

    const canCreate = hasPermission(PERMISSIONS.CREATE_NOTICE);

    const canEdit = hasPermission(PERMISSIONS.EDIT_NOTICE);

    const canDelete = hasPermission(PERMISSIONS.DELETE_NOTICE);


    /* =========================
       New / Edit popup (same popup)
    ========================= */

    const [isAnnouncementOpen, setIsAnnouncementOpen] = useState(false);

    // Set when editing; the popup fetches the notice itself
    const [editNoticeId, setEditNoticeId] = useState<number | null>(null);

    const handleCloseAnnouncement = () => {
        setIsAnnouncementOpen(false);
        setEditNoticeId(null);
    }

    const handleEdit = (id: number) => {
        if (!canEdit) return;
        setEditNoticeId(id);
    }

    // After create: show page 1 (where the newest notice is expected).
    // After update: keep the current page. Both refetch GET /v1/notices.
    const handleSaved = () => {
        if (editNoticeId === null) {
            goToPage(1);
        }
        retry();
    }


    /* =========================
       Delete (confirm first), same flow as Users/Roles
    ========================= */

    // Opening the confirmation only stores the target; no request is made
    const [deleteTarget, setDeleteTarget] = useState<NoticeItem | null>(null);

    const [isDeleting, setIsDeleting] = useState(false);

    const isDeletingRef = useRef(false);

    const handleDelete = (id: number) => {
        if (!canDelete) return;
        const notice = notices.find((item) => item.id === id);
        if (notice) setDeleteTarget(notice);
    }

    const handleCancelDelete = () => {
        if (!isDeletingRef.current) setDeleteTarget(null);
    };

    // Only runs when the user clicks "Delete" in the confirmation popup
    const handleConfirmDelete = async () => {

        if (!deleteTarget || isDeletingRef.current || !canDelete) return;

        isDeletingRef.current = true;
        setIsDeleting(true);

        try {

            const response = await deleteNotice(deleteTarget.id);

            toast.success(response.message || "Notice deleted successfully.");

            setDeleteTarget(null);

            // If that was the last notice on this page, go to the previous
            // page; otherwise refetch the same page
            if (notices.length <= 1 && page > 1) {
                goToPage(page - 1);
            }

            retry();

        } catch (deleteError) {

            const { status, message } = parseApiError(deleteError);

            // 401 is handled globally (redirect + toast)
            if (status !== 401) toast.error(message);

        } finally {

            isDeletingRef.current = false;
            setIsDeleting(false);

        }

    };


    /* =========================
       Notice box content: loading / error / empty / list
    ========================= */

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
            return (
                <div className="notice-status" role={isLoading ? "status" : undefined}>
                    {isLoading ? (
                        <span className="d-inline-flex align-items-center gap-2">
                            <span className="spinner-border spinner-border-sm" aria-hidden="true"></span>
                            Loading notices...
                        </span>
                    ) : (
                        <>
                            <span className="notice-empty-icon" aria-hidden="true">
                                <Megaphone size={20} strokeWidth={2} />
                            </span>
                            <p className="notice-empty-title">No notices found.</p>
                            <p className="notice-empty-hint">New notices you post will appear here.</p>
                        </>
                    )}
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
                        onEdit={canEdit ? handleEdit : undefined}
                        onDelete={canDelete ? handleDelete : undefined}
                    />
                ))}
            </div>
        );

    };

    return (
        <>
            <SEO
                title="Notices | Noor Ul Imaan Masjid"
                description="Manage notices for Noor Ul Imaan Masjid Madrassah Portal."
            />

            <section className="notices-section">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-12">
                            <div className="notices-head">
                                <div className="">
                                    <h1 className="section-title">
                                        Notices & Announcements
                                    </h1>
                                    <p className="notices-desc m-0">Communicate with teachers, students and parents</p>
                                </div>
                                {canCreate && (
                                    <button
                                        type="button"
                                        className="new-notice-btn"
                                        onClick={() => setIsAnnouncementOpen(true)}
                                    >
                                        <Plus color="#fff" size={20} strokeWidth={2.5} />
                                        <span>New Notice</span>
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Notice List */}
                        <div className="col-12">
                            {/* Compact box when there are no notices to list */}
                            <div className={`notice-box ${notices.length === 0 || error ? "is-empty" : ""}`}>

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

            {/* Annoucements Popup (New + Edit) */}
            <AnnoucementsPopup
                // Opens only with the matching permission (New / Edit)
                isOpen={(isAnnouncementOpen && canCreate) || (editNoticeId !== null && canEdit)}
                editNoticeId={editNoticeId}
                onClose={handleCloseAnnouncement}
                onSaved={handleSaved}
            />

            {/* Delete Confirmation */}
            <ConfirmPopup
                isOpen={deleteTarget !== null && canDelete}
                title="Delete Notice"
                message={
                    <>
                        Are you sure you want to delete the notice{" "}
                        <strong>{deleteTarget?.title}</strong>? This action cannot be undone.
                    </>
                }
                confirmLabel="Delete"
                processingLabel="Deleting..."
                isProcessing={isDeleting}
                onConfirm={handleConfirmDelete}
                onCancel={handleCancelDelete}
            />

        </>
    );
};

export default Notices;
