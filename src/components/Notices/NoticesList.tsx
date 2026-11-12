import { PenLine, X } from "lucide-react";
import type { Notice } from "./Notices.types";

interface NoticeItemProps {
    notice: Notice;
    onEdit?: (id: number) => void;
    onDelete?: (id: number) => void;
    showActions?: boolean;
    showDate?: boolean;
    showPostedBy?: boolean;
}

const noticeColors = ["green", "yellow", "blue", "purple", "red"];

const NoticeList = ({
    notice,
    onEdit,
    onDelete,
    showActions = true,
    showDate = false,
    showPostedBy = false,
}: NoticeItemProps) => {
    const color = noticeColors[(notice.id - 1) % noticeColors.length];

    const formattedDate = new Date(notice.createdAt).toLocaleDateString(
        "en-GB",
        {
            day: "2-digit",
            month: "short",
            year: "numeric",
        }
    );

    return (
        <div className="notice-item">

            <span className={`notice-dot ${color}`} />

            <div className="notice-content">

                <h3 className="notice-title">
                    {notice.title}
                </h3>

                <p className="notice-description">
                    {notice.description}
                </p>

                {showPostedBy && (
                    <span className="notice-posted-by">
                        Posted by {notice.postedBy}
                    </span>
                )}

            </div>

            {showDate && (
                <div className="notice-date">
                    {formattedDate}
                </div>
            )}

            {showActions && (
                <div className="notice-actions">

                    <button
                        type="button"
                        className="notice-action-btn"
                        onClick={() => onEdit?.(notice.id)}
                        aria-label="Edit notice"
                    >
                        <PenLine
                            size={16}
                            strokeWidth={2.2}
                            color="#231F20"
                        />
                    </button>

                    <button
                        type="button"
                        className="notice-action-btn"
                        onClick={() => onDelete?.(notice.id)}
                        aria-label="Delete notice"
                    >
                        <X
                            size={16}
                            strokeWidth={2.2}
                            color="#231F20"
                        />
                    </button>

                </div>
            )}

        </div>
    );
};

export default NoticeList;