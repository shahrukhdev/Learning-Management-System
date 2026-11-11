import { useMemo, useState } from "react";

import { Check, ChevronLeft, ChevronRight, Minus, SlidersHorizontal } from "lucide-react";

import type { PermissionListItem } from "../../../../types/permission.types";
import { groupPermissionsByModule } from "./rolePermissions";

import "./PermissionMatrix.css";

interface RolePermissionMatrixProps {
    // Every permission (GET /v1/permissions, all pages)
    permissions: PermissionListItem[];
    isLoading: boolean;
    error: string | null;
    onRetry: () => void;

    // Selected permission IDs (form state)
    selectedIds: number[];
    onChange: (ids: number[]) => void;

    disabled?: boolean;
}

const ROWS_PER_PAGE_OPTIONS = [10, 20, 30, 50];

// Permission Matrix for the Create / Edit Role forms: the existing matrix
// card, header, quick toggles, table and footer, with one row per module and
// that module's permissions as checkboxes (IDs from the API).
const RolePermissionMatrix = ({
    permissions,
    isLoading,
    error,
    onRetry,
    selectedIds,
    onChange,
    disabled = false,
}: RolePermissionMatrixProps) => {

    const groups = useMemo(() => groupPermissionsByModule(permissions), [permissions]);

    const selected = useMemo(() => new Set(selectedIds), [selectedIds]);

    /* =========================
       Selection (IDs, never duplicated)
    ========================= */

    const setIds = (ids: Iterable<number>) => onChange([...new Set(ids)]);

    const togglePermission = (id: number) => {
        const next = new Set(selected);

        if (next.has(id)) next.delete(id);
        else next.add(id);

        setIds(next);
    };

    const toggleModule = (modulePermissions: PermissionListItem[], select: boolean) => {
        const next = new Set(selected);

        modulePermissions.forEach((permission) => {
            if (select) next.add(permission.id);
            else next.delete(permission.id);
        });

        setIds(next);
    };

    // Quick Toggle: Select All / Clear (all permissions in the matrix)
    const setAllPermissions = (value: boolean) => {
        const next = new Set(selected);

        permissions.forEach((permission) => {
            if (value) next.add(permission.id);
            else next.delete(permission.id);
        });

        setIds(next);
    };

    /* =========================
       Pagination (modules)
    ========================= */

    const [pageSize, setPageSize] = useState(ROWS_PER_PAGE_OPTIONS[0]);

    const [requestedPage, setRequestedPage] = useState(0);

    const pageCount = Math.max(Math.ceil(groups.length / pageSize), 1);

    // Stays valid if the number of modules changes
    const pageIndex = Math.min(requestedPage, pageCount - 1);

    const visibleGroups = groups.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize);

    const totalResults = groups.length;

    const firstResult = totalResults === 0 ? 0 : pageIndex * pageSize + 1;

    const lastResult = Math.min((pageIndex + 1) * pageSize, totalResults);

    const selectedCount = permissions.filter((permission) => selected.has(permission.id)).length;

    const isReady = !isLoading && !error;

    const renderBody = () => {

        if (isLoading) {
            return (
                <tr>
                    <td colSpan={3} className="permission-empty-row" role="status">
                        <span className="d-inline-flex align-items-center gap-2">
                            <span className="spinner-border spinner-border-sm" aria-hidden="true"></span>
                            Loading permissions...
                        </span>
                    </td>
                </tr>
            );
        }

        if (error) {
            return (
                <tr>
                    <td colSpan={3} className="permission-empty-row">
                        <div className="d-flex flex-wrap justify-content-center align-items-center gap-2">
                            <span>{error}</span>
                            <button type="button" className="table-retry-button" onClick={onRetry}>
                                Try again
                            </button>
                        </div>
                    </td>
                </tr>
            );
        }

        if (groups.length === 0) {
            return (
                <tr>
                    <td colSpan={3} className="permission-empty-row">
                        No permissions found.
                    </td>
                </tr>
            );
        }

        return visibleGroups.map((group) => {

            const moduleSelected = group.permissions.filter((permission) => selected.has(permission.id)).length;

            const allSelected = moduleSelected === group.permissions.length;

            const someSelected = moduleSelected > 0 && !allSelected;

            return (
                <tr key={group.key}>

                    {/* Module */}
                    <td className="permission-module-cell">
                        <div className="permission-module">
                            <span className="permission-module-dot"></span>
                            <span>{group.name}</span>
                        </div>
                    </td>

                    {/* Permissions */}
                    <td>
                        <div className="permission-options">
                            {group.permissions.map((permission) => {
                                const isChecked = selected.has(permission.id);

                                return (
                                    <label
                                        className="permission-option"
                                        key={permission.id}
                                        title={permission.description ?? undefined}
                                    >
                                        <button
                                            type="button"
                                            className={`permission-checkbox ${isChecked ? "checked" : ""}`}
                                            onClick={() => togglePermission(permission.id)}
                                            aria-label={permission.name}
                                            aria-pressed={isChecked}
                                            disabled={disabled}
                                        >
                                            {isChecked && <Check size={13} strokeWidth={3} />}
                                        </button>
                                        <span>{permission.name}</span>
                                    </label>
                                );
                            })}
                        </div>
                    </td>

                    {/* Whole module */}
                    <td>
                        <button
                            type="button"
                            className={`permission-checkbox ${allSelected || someSelected ? "checked" : ""}`}
                            onClick={() => toggleModule(group.permissions, !allSelected)}
                            aria-label={`${allSelected ? "Clear" : "Select"} all ${group.name} permissions`}
                            aria-pressed={allSelected ? true : someSelected ? "mixed" : false}
                            disabled={disabled}
                        >
                            {allSelected && <Check size={13} strokeWidth={3} />}
                            {someSelected && <Minus size={13} strokeWidth={3} />}
                        </button>
                    </td>

                </tr>
            );
        });
    };

    return (

        <div className="permission-matrix-card role-form-permission-matrix">

            {/* =========================
                Header
            ========================= */}

            <div className="permission-matrix-header">

                <div className="permission-matrix-heading">

                    <div className="permission-matrix-title-row">

                        <div className="permission-matrix-icon">
                            <SlidersHorizontal size={18} strokeWidth={2} />
                        </div>

                        <div>
                            <h2>Permission Matrix</h2>
                            <p>
                                {isReady
                                    ? `${selectedCount} of ${permissions.length} permissions selected.`
                                    : "Configure access levels across system modules."}
                            </p>
                        </div>

                    </div>

                </div>


                {/* Quick Actions */}

                <div className="permission-matrix-quick-actions">

                    <span>Quick Toggle:</span>

                    <button
                        type="button"
                        onClick={() => setAllPermissions(true)}
                        disabled={disabled || !isReady || permissions.length === 0}
                    >
                        Select All
                    </button>

                    <button
                        type="button"
                        onClick={() => setAllPermissions(false)}
                        disabled={disabled || !isReady || selectedCount === 0}
                    >
                        Clear
                    </button>

                </div>

            </div>


            {/* =========================
                Table
            ========================= */}

            <div className="permission-matrix-wrapper">

                <table className="permission-matrix-table">

                    <thead>
                        <tr>
                            <th>Module</th>
                            <th>Permissions</th>
                            <th>All</th>
                        </tr>
                    </thead>

                    <tbody>
                        {renderBody()}
                    </tbody>

                </table>

            </div>


            {/* =========================
                Footer
            ========================= */}

            {isReady && groups.length > 0 && (

                <div className="permission-matrix-footer">

                    {/* Rows Per Page */}

                    <div className="permission-rows-per-page">

                        <span>Rows per page:</span>

                        <select
                            value={pageSize}
                            onChange={(e) => {
                                setPageSize(Number(e.target.value));
                                setRequestedPage(0);
                            }}
                        >
                            {ROWS_PER_PAGE_OPTIONS.map((size) => (
                                <option key={size} value={size}>
                                    {size}
                                </option>
                            ))}
                        </select>

                    </div>


                    {/* Showing Results */}

                    <div className="permission-results">
                        Showing{" "}
                        <strong>{firstResult}</strong>
                        {"–"}
                        <strong>{lastResult}</strong>
                        {" "}of{" "}
                        <strong>{totalResults}</strong>
                        {" "}modules
                    </div>


                    {/* Pagination */}

                    <div className="permission-pagination">

                        <span>
                            Page {pageIndex + 1} of {pageCount}
                        </span>

                        <button
                            type="button"
                            disabled={pageIndex === 0}
                            onClick={() => setRequestedPage(pageIndex - 1)}
                            aria-label="Previous page"
                        >
                            <ChevronLeft size={16} strokeWidth={2} />
                        </button>

                        <button
                            type="button"
                            disabled={pageIndex >= pageCount - 1}
                            onClick={() => setRequestedPage(pageIndex + 1)}
                            aria-label="Next page"
                        >
                            <ChevronRight size={16} strokeWidth={2} />
                        </button>

                    </div>

                </div>

            )}

        </div>

    );

};

export default RolePermissionMatrix;
