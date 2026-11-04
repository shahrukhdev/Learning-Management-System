import type { ReactNode } from "react";

import { X } from "lucide-react";

import "../Popup.css";

interface ConfirmPopupProps {
    isOpen: boolean;
    title: string;
    message: ReactNode;
    confirmLabel?: string;
    processingLabel?: string;
    // Disables both actions and prevents closing while the action runs
    isProcessing?: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}

// Generic confirmation dialog built from the existing popup styles.
// It never performs the action itself: only `onConfirm` does, on click.
const ConfirmPopup = ({
    isOpen,
    title,
    message,
    confirmLabel = "Delete",
    processingLabel = "Deleting...",
    isProcessing = false,
    onConfirm,
    onCancel,
}: ConfirmPopupProps) => {

    if (!isOpen) {
        return null;
    }

    const handleCancel = () => {
        if (!isProcessing) onCancel();
    };

    return (

        <div className="app-popup-wrapper">

            <div
                className="app-popup-box app-confirm-box"
                role="alertdialog"
                aria-modal="true"
                aria-labelledby="confirm-popup-title"
                aria-describedby="confirm-popup-message"
            >

                <div className="app-popup-header">

                    <h2 className="app-popup-title" id="confirm-popup-title">
                        {title}
                    </h2>

                    <button
                        type="button"
                        className="app-popup-close"
                        onClick={handleCancel}
                        aria-label="Close"
                        disabled={isProcessing}
                    >
                        <X size={19} strokeWidth={2} />
                    </button>

                </div>

                <p className="app-confirm-message" id="confirm-popup-message">
                    {message}
                </p>

                <div className="app-popup-actions">

                    <button
                        type="button"
                        className="app-popup-btn cancel"
                        onClick={handleCancel}
                        disabled={isProcessing}
                    >
                        Cancel
                    </button>

                    <button
                        type="button"
                        className="app-popup-btn danger"
                        onClick={onConfirm}
                        disabled={isProcessing}
                        aria-busy={isProcessing}
                    >
                        {isProcessing ? processingLabel : confirmLabel}
                    </button>

                </div>

            </div>

        </div>

    );
};

export default ConfirmPopup;
