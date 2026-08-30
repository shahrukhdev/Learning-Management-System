import { PenLine, X } from "lucide-react";

import type { Notice } from "./Notices.types";

interface NoticeItemPros {
    notice: Notice;
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

const NoticeList = ({notice, onEdit, onDelete}: NoticeItemPros) => {

    const color = noticeColors[(notice.id - 1) % noticeColors.length];
    
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

            </div>

            {/* Notice Actions */}
            <div className="notice-actions">

                <button
                    type="button"
                    className="notice-action-btn"
                    onClick={() => onEdit?.(notice.id)}
                >
                    <PenLine size={16} strokeWidth={2.2} color="#231F20" />
                </button>

                <button
                    type="button"
                    className="notice-action-btn"
                    onClick={() => onDelete?.(notice.id)}
                >
                    <X size={16} strokeWidth={2.2} color="#231F20" />
                </button>

            </div>

        </div>
    );
};

export default NoticeList;

