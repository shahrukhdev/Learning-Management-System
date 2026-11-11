import { useEffect, useRef, useState } from "react";
import { CirclePlus } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import SEO from "../../../components/Seo/SEO";
import FilterBar from "../../../components/FilterBar/FilterBar";
import CoursesTable from "../../../components/Courses/CoursesTable";
import ConfirmPopup from "../../../components/Popups/ConfirmPopup/ConfirmPopup";
import { useCoursesList } from "../../../hooks/useCoursesList";
import { useDebouncedValue } from "../../../hooks/useDebouncedValue";
import { deleteCourse } from "../../../services/courseService";
import { parseApiError } from "../../../utils/apiError";
import type { CourseItem } from "../../../types/course.types";
import "../AdminList.css";
import "../Roles/Roles.css";
import { usePermissions } from "../../../hooks/usePermissions";
import { PERMISSIONS } from "../../../utils/permissions";

const DEFAULT_PER_PAGE = 10;

// Same as Users Management
const SEARCH_DEBOUNCE_MS = 450;

// Reads a positive integer from the query string, or the fallback
const readPositiveInt = (value: string | null, fallback: number) => {
    const parsed = Number(value);
    return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
};

const Courses = () => {

    // View is checked by the route; each action has its own permission
    const { hasPermission } = usePermissions();

    const canCreate = hasPermission(PERMISSIONS.CREATE_COURSE);

    const canEdit = hasPermission(PERMISSIONS.EDIT_COURSE);

    const canDelete = hasPermission(PERMISSIONS.DELETE_COURSE);

    /* =========================
       Listing state lives in the URL (?page=&per_page=&search=&is_active=)
       so it survives Edit -> back and page refreshes
    ========================= */

    const [searchParams, setSearchParams] = useSearchParams();

    const page = readPositiveInt(searchParams.get("page"), 1);

    const perPage = readPositiveInt(searchParams.get("per_page"), DEFAULT_PER_PAGE);

    // Applied search (sent as `search`); the status filter has no control yet
    // but is read from the URL and kept together with the search
    const search = (searchParams.get("search") ?? "").trim();

    const isActiveParam = searchParams.get("is_active");

    const isActive =
        isActiveParam === "1" || isActiveParam === "true"
            ? true
            : isActiveParam === "0" || isActiveParam === "false"
                ? false
                : null;

    // Updates the query string, keeping search/filters
    const updateQuery = (updates: Record<string, string | null>) => {
        setSearchParams((current) => {
            const next = new URLSearchParams(current);

            Object.entries(updates).forEach(([key, value]) => {
                if (value === null) next.delete(key);
                else next.set(key, value);
            });

            return next;
        });
    };

    /* =========================
       Search (same behavior as Users Management): the input is debounced
       450ms and trimmed, then stored in the URL as `search` with the page
       reset to 1. Clearing it removes `search` (full list again).
    ========================= */

    const [searchInput, setSearchInput] = useState(search);

    const debouncedSearch = useDebouncedValue(searchInput.trim(), SEARCH_DEBOUNCE_MS);

    // Keep the input in sync when the URL changes on its own (e.g. Back)
    const [syncedSearch, setSyncedSearch] = useState(search);

    if (syncedSearch !== search) {
        setSyncedSearch(search);
        if (searchInput.trim() !== search) setSearchInput(search);
    }

    // Last debounced value handled, so only new input updates the URL
    const lastDebouncedSearch = useRef(debouncedSearch);

    useEffect(() => {
        if (debouncedSearch === lastDebouncedSearch.current) return;

        lastDebouncedSearch.current = debouncedSearch;

        if (debouncedSearch === search) return;

        setSearchParams((current) => {
            const next = new URLSearchParams(current);

            if (debouncedSearch) next.set("search", debouncedSearch);
            else next.delete("search");

            // A new search starts at page 1 (status filter / page size kept)
            next.delete("page");

            return next;
        });
    }, [debouncedSearch, search, setSearchParams]);

    const goToPage = (nextPage: number) =>
        updateQuery({ page: nextPage > 1 ? String(nextPage) : null });

    // A new page size starts again at page 1
    const changePerPage = (nextPerPage: number) =>
        updateQuery({
            per_page: nextPerPage !== DEFAULT_PER_PAGE ? String(nextPerPage) : null,
            page: null,
        });

    const {
        courses,
        pagination,
        error,
        isLoading,
        hasLoaded,
        retry,
    } = useCoursesList({ search, isActive, page, perPage });

    // Passed to Edit so it can return to this exact page/filters
    const listSearch = searchParams.toString() ? `?${searchParams.toString()}` : "";


    /* =========================
       Delete (confirm first), same flow as Users/Roles
    ========================= */

    // Opening the confirmation only stores the target; no request is made
    const [deleteTarget, setDeleteTarget] = useState<CourseItem | null>(null);

    const [isDeleting, setIsDeleting] = useState(false);

    const isDeletingRef = useRef(false);

    const handleDeleteCourse = (course: CourseItem) => {
        if (!canDelete) return;
        setDeleteTarget(course);
    };

    const handleCancelDelete = () => {
        if (!isDeletingRef.current) setDeleteTarget(null);
    };

    // Only runs when the user clicks "Delete" in the confirmation popup
    const handleConfirmDelete = async () => {

        if (!deleteTarget || isDeletingRef.current || !canDelete) return;

        isDeletingRef.current = true;
        setIsDeleting(true);

        try {

            const response = await deleteCourse(deleteTarget.id);

            toast.success(response.message || "Course deleted successfully.");

            setDeleteTarget(null);

            // Last course on this page -> previous page; otherwise refetch
            // the same page (search/filters kept)
            if (courses.length <= 1 && page > 1) {
                goToPage(page - 1);
            } else {
                retry();
            }

        } catch (deleteError) {

            const { status, message } = parseApiError(deleteError);

            // 401 is handled globally (redirect + toast)
            if (status !== 401) toast.error(message);

        } finally {

            isDeletingRef.current = false;
            setIsDeleting(false);

        }

    };

    return (
        <>
            <SEO
                title="Courses Management | Noor Ul Imaan Masjid"
                description="Create and manage courses across the Madrasah portal."
            />
            <section className="admin-list-section">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-12">
                            <div className="section-head">
                                <div>
                                    <h1 className="section-title">Manage Courses</h1>
                                    <p className="section-desc-para m-0">
                                        Create and manage courses across the Madrasah portal.
                                    </p>
                                </div>
                                {canCreate && (
                                    <Link
                                        to="/academic/courses/create"
                                        className="new-notice-btn"
                                    >
                                        <CirclePlus color="#fff" size={20} strokeWidth={2.5} />
                                        <span>Create New Course</span>
                                    </Link>
                                )}
                            </div>
                        </div>
                        <div className="col-12">
                            <div className="admin-list-controls">
                                <FilterBar
                                    searchPlaceholder="Search courses..."
                                    searchValue={searchInput}
                                    onSearchChange={setSearchInput}
                                />
                            </div>
                            <CoursesTable
                                courses={courses}
                                pagination={pagination}
                                page={page}
                                perPage={perPage}
                                isLoading={isLoading}
                                hasLoaded={hasLoaded}
                                error={error}
                                isFiltered={search !== "" || isActive !== null}
                                listSearch={listSearch}
                                onPageChange={goToPage}
                                onPerPageChange={changePerPage}
                                onRetry={retry}
                                onDeleteCourse={canDelete ? handleDeleteCourse : undefined}
                                canEditCourses={canEdit}
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Delete Confirmation */}
            <ConfirmPopup
                isOpen={deleteTarget !== null && canDelete}
                title="Delete Course"
                message={
                    <>
                        Are you sure you want to delete the{" "}
                        <strong>{deleteTarget?.name}</strong> course? This action cannot be undone.
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

export default Courses;
