import { PenLine, X } from "lucide-react";

// Minimal shape shown by a notice row. Both the API notices (Admin page) and
// the existing mock notices (Teacher page) fit it.
export interface NoticeListItem {
    id: number;
    title: string;
    description: string;
}

interface NoticeItemPros {
    notice: NoticeListItem;
    // Optional meta line (API notices only): status badge + backend date
    isActive?: boolean;
    date?: string;
    // Each action is shown only when its handler is passed (callers pass
    // them only when the user has the matching permission)
    onEdit?: (id: number) => void;
    onDelete?: (id: number) => void;
}

const noticeColors = [
    "green",
    "yellow",
    "blue",
    "purple",
    "red",
];

const NoticeList = ({notice, isActive, date, onEdit, onDelete}: NoticeItemPros) => {

    const color = noticeColors[Math.abs(notice.id - 1) % noticeColors.length];

    const hasMeta = isActive !== undefined || Boolean(date);

    return (
        <div className="notice-item">

            {/* Notice Dot */}
            <span className={`notice-dot ${color}`}></span>

            {/* Notice Content */}
            <div className="notice-content">

                <h3 className="notice-title">
                    {notice.title}
                </h3>

                <p className="notice-description">
                    {notice.description}
                </p>

                {/* Status (existing table status styling) + date as sent by the API */}
                {hasMeta && (
                    <div className="notice-meta">

                        {isActive !== undefined && (
                            <span className={`table-status ${isActive ? "active" : "inactive"}`}>
                                <span className="table-status-dot"></span>
                                {isActive ? "Active" : "Inactive"}
                            </span>
                        )}

                        {date && (
                            <span className="notice-date">
                                {date}
                            </span>
                        )}

                    </div>
                )}

            </div>

            {/* Notice Actions */}
            {(onEdit || onDelete) && (
                <div className="notice-actions">

                    {onEdit && (
                        <button
                            type="button"
                            className="notice-action-btn"
                            onClick={() => onEdit(notice.id)}
                            aria-label={`Edit ${notice.title}`}
                        >
                            <PenLine size={16} strokeWidth={2.2} color="#231F20" />
                        </button>
                    )}

                    {onDelete && (
                        <button
                            type="button"
                            className="notice-action-btn"
                            onClick={() => onDelete(notice.id)}
                            aria-label={`Delete ${notice.title}`}
                        >
                            <X size={16} strokeWidth={2.2} color="#231F20" />
                        </button>
                    )}

                </div>
            )}

        </div>
    );
};

export default NoticeList;

