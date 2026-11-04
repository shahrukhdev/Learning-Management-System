import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";

import { X } from "lucide-react";
import { toast } from "react-toastify";

import { createNotice, getNotice, updateNotice } from "../../../services/noticeService";
import { getFirstFieldErrors, parseApiError } from "../../../utils/apiError";
import type { NoticeItem, SaveNoticeRequest } from "../../../types/notice.types";

import "../Popup.css";
// Existing on/off toggle styling (.role-permission-toggle)
import "../../../pages/Admin/Roles/CreateNewRole/CreateNewRole.css";


type NoticeField = "title" | "message" | "is_active";

type NoticeErrors = Partial<Record<NoticeField, string>>;

const NOTICE_FIELDS: NoticeField[] = ["title", "message", "is_active"];

const MAX_TITLE_LENGTH = 255;

// New notices are active by default (notices are posted to be seen)
const DEFAULT_IS_ACTIVE = true;


interface AnnoucementPopupProps {

    isOpen: boolean;

    onClose: () => void;

    // Set to a notice ID to edit it (GET + PUT); null/undefined = new notice
    editNoticeId?: number | null;

    // Called after a successful create or update (e.g. to refresh the list)
    onSaved?: (notice: NoticeItem | undefined) => void;

    // Called after a successful create with the posted values
    onPost?: (data: {
        title: string;
        message: string;
    }) => void;

}


// Client-side rules (mirror the backend): title required, string, max 255;
// message required
const validateNotice = (title: string, message: string): NoticeErrors => {

    const errors: NoticeErrors = {};

    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
        errors.title = "The title field is required.";
    } else if (trimmedTitle.length > MAX_TITLE_LENGTH) {
        errors.title = `The title must not be greater than ${MAX_TITLE_LENGTH} characters.`;
    }

    if (!message.trim()) {
        errors.message = "The message field is required.";
    }

    return errors;

};


const AnnoucementsPopup = ({
    isOpen,
    onClose,
    editNoticeId = null,
    onSaved,
    onPost,
}: AnnoucementPopupProps) => {

    const isEditMode = editNoticeId !== null;


    const [title, setTitle] =
        useState("");

    const [message, setMessage] =
        useState("");

    const [isActive, setIsActive] =
        useState(DEFAULT_IS_ACTIVE);

    const [errors, setErrors] =
        useState<NoticeErrors>({});

    const [isSubmitting, setIsSubmitting] =
        useState(false);

    // Synchronous guard against double submits
    const isSubmittingRef = useRef(false);


    /* Edit: load the notice (GET /v1/notices/{id}) */

    const [loadToken, setLoadToken] = useState(0);

    // Which notice (and attempt) the form was loaded for
    const [loadState, setLoadState] =
        useState<{ key: string; error: string | null } | null>(null);

    const loadKey = `${editNoticeId}|${loadToken}`;

    const isLoadingNotice =
        isOpen && isEditMode && loadState?.key !== loadKey;

    const loadError =
        isEditMode && loadState?.key === loadKey ? loadState.error : null;

    useEffect(() => {

        if (!isOpen || editNoticeId === null) return;

        const controller = new AbortController();

        getNotice(editNoticeId, controller.signal)
            .then((response) => {

                if (controller.signal.aborted) return;

                setTitle(response.data.title ?? "");
                setMessage(response.data.message ?? "");
                setIsActive(Boolean(response.data.is_active));
                setErrors({});

                setLoadState({ key: loadKey, error: null });

            })
            .catch((error: unknown) => {

                if (controller.signal.aborted) return;

                const { message: errorMessage } = parseApiError(error);

                setLoadState({ key: loadKey, error: errorMessage });

            });

        return () => controller.abort();

    }, [isOpen, editNoticeId, loadKey]);


    const resetForm = () => {
        setTitle("");
        setMessage("");
        setIsActive(DEFAULT_IS_ACTIVE);
        setErrors({});
        setLoadState(null);
    };

    const clearError = (field: NoticeField) => {
        setErrors((current) =>
            current[field] ? { ...current, [field]: undefined } : current
        );
    };

    const handleClose = () => {

        if (isSubmittingRef.current) return;

        resetForm();

        onClose();

    };


    if (!isOpen) {

        return null;

    }


    const handleSubmit = async (
        event: FormEvent<HTMLFormElement>
    ) => {

        event.preventDefault();

        if (isSubmittingRef.current || isLoadingNotice || loadError) return;

        const clientErrors = validateNotice(title, message);

        if (Object.keys(clientErrors).length > 0) {
            setErrors(clientErrors);
            return;
        }

        isSubmittingRef.current = true;
        setIsSubmitting(true);
        setErrors({});

        const payload: SaveNoticeRequest = {
            title: title.trim(),
            message: message.trim(),
            is_active: isActive, // boolean
        };

        try {

            const response = editNoticeId !== null
                ? await updateNotice(editNoticeId, payload)
                : await createNotice(payload);

            toast.success(
                response.message ||
                (editNoticeId !== null ? "Notice updated successfully." : "Notice created successfully.")
            );

            if (editNoticeId === null) {
                onPost?.({ title: payload.title, message: payload.message });
            }

            resetForm();

            onClose();

            onSaved?.(response.data);

        } catch (error) {

            const { status, message: errorMessage, validationErrors } = parseApiError(error);

            if (status === 401) return; // handled globally

            if (status === 422 && validationErrors) {

                const fieldErrors = getFirstFieldErrors<NoticeField>(validationErrors);

                const inlineErrors: NoticeErrors = {};

                NOTICE_FIELDS.forEach((field) => {
                    if (fieldErrors[field]) inlineErrors[field] = fieldErrors[field];
                });

                setErrors(inlineErrors);

                // Only toast if nothing could be shown inline
                if (Object.keys(inlineErrors).length === 0) {
                    toast.error(errorMessage);
                }

            } else {

                toast.error(errorMessage);

            }

        } finally {

            isSubmittingRef.current = false;
            setIsSubmitting(false);

        }

    };


    return (

        <div className="app-popup-wrapper">

            <div className="app-popup-box">


                {/* =========================
                    Header
                ========================= */}

                <div className="app-popup-header">

                    <h2 className="app-popup-title">
                        {isEditMode ? "Edit Notice" : "Announcement"}
                    </h2>


                    <button
                        type="button"
                        className="app-popup-close"
                        onClick={handleClose}
                        aria-label="Close"
                        disabled={isSubmitting}
                    >

                        <X
                            size={19}
                            strokeWidth={2}
                        />

                    </button>

                </div>


                {/* =========================
                    Edit: loading / load error
                ========================= */}

                {isLoadingNotice ? (

                    <div className="add-user-status" role="status">
                        <span className="spinner-border" aria-hidden="true"></span>
                        <span>Loading notice...</span>
                    </div>

                ) : loadError ? (

                    <div className="add-user-status">

                        <p className="m-0">{loadError}</p>

                        <div className="app-popup-actions">

                            <button
                                type="button"
                                className="app-popup-btn cancel"
                                onClick={handleClose}
                            >
                                Close
                            </button>

                            <button
                                type="button"
                                className="app-popup-btn post"
                                onClick={() => setLoadToken((token) => token + 1)}
                            >
                                Try Again
                            </button>

                        </div>

                    </div>

                ) : (

                /* =========================
                    Form
                ========================= */

                <form
                    className="app-popup-form"
                    onSubmit={handleSubmit}
                    noValidate
                >


                    {/* =========================
                        Notice Title
                    ========================= */}

                    <div className="app-popup-field">

                        <label htmlFor="notice-title">
                            Notice Title
                        </label>


                        <input
                            id="notice-title"
                            type="text"
                            placeholder="Search students, teachers..."
                            value={title}
                            onChange={(event) => {
                                setTitle(
                                    event.target.value
                                );
                                clearError("title");
                            }}
                            aria-invalid={Boolean(errors.title)}
                            required
                        />

                        {errors.title && (
                            <span className="error-text">{errors.title}</span>
                        )}

                    </div>


                    {/* =========================
                        Message
                    ========================= */}

                    <div className="app-popup-field">

                        <label htmlFor="notice-message">
                            Message
                        </label>


                        <textarea
                            id="notice-message"
                            placeholder="Message students, teachers..."
                            value={message}
                            onChange={(event) => {
                                setMessage(
                                    event.target.value
                                );
                                clearError("message");
                            }}
                            aria-invalid={Boolean(errors.message)}
                            required
                        />

                        {errors.message && (
                            <span className="error-text">{errors.message}</span>
                        )}

                    </div>


                    {/* =========================
                        Active Status (existing toggle style)
                    ========================= */}

                    <div className="app-popup-field">

                        <label htmlFor="notice-active">
                            Active Status
                        </label>

                        <div className="d-flex align-items-center gap-2">

                            <button
                                id="notice-active"
                                type="button"
                                className={`role-permission-toggle ${isActive ? "active" : ""}`}
                                onClick={() => {
                                    setIsActive((current) => !current);
                                    clearError("is_active");
                                }}
                                aria-pressed={isActive}
                                aria-label={isActive ? "Set notice inactive" : "Set notice active"}
                            >
                                <span />
                            </button>

                            <span>
                                {isActive ? "Active" : "Inactive"}
                            </span>

                        </div>

                        {errors.is_active && (
                            <span className="error-text d-block">{errors.is_active}</span>
                        )}

                    </div>


                    {/* =========================
                        Actions
                    ========================= */}

                    <div className="app-popup-actions">

                        <button
                            type="button"
                            className="app-popup-btn cancel"
                            onClick={handleClose}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </button>


                        <button
                            type="submit"
                            className="app-popup-btn post"
                            disabled={isSubmitting}
                            aria-busy={isSubmitting}
                        >
                            {isEditMode
                                ? (isSubmitting ? "Updating..." : "Update Notice")
                                : (isSubmitting ? "Posting..." : "Post")}
                        </button>

                    </div>


                </form>

                )}

            </div>

        </div>

    );

};


export default AnnoucementsPopup;
