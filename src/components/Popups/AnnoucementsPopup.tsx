import { useState } from "react";
import "./AnnoucementsPopup.css";
import { X } from "lucide-react";

interface  AnnoucementPopupProps {
    isOpen: boolean;
    onClose: () => void;
    onPost?: (data: {
        title: string;
        message: string;   
    }) => void;
}


const AnnoucementsPopup = ({ isOpen, onClose, onPost }: AnnoucementPopupProps) => {

    const [ title, setTitle ] = useState("");
    const [ message, setMessage] = useState("");

    if (!isOpen) {
        return null;
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault;

        onPost?.({
            title,
            message
        });

        setTitle("");
        setMessage("");
        onClose();
    }

    return (
        <div className="popup-wrapper">
            <button className="announcement-cls-btn" type="button" onClick={onClose}>
                <X color="#000" strokeWidth={2.5} size={18} />
            </button>
            <div className="popup-box">
                
                <div className="announcement-header">
                    <h2 className="popup-title m-0">Announcement</h2>
                </div>

                <form className="m-0" onSubmit={handleSubmit}>

                    {/* Notice Title */}
                    <div className="announcement-field">
                        <label htmlFor="notice-title">
                            Notice Title
                        </label>

                        <input
                            id="notice-title"
                            type="text"
                            placeholder="Search students, teachers..."
                            value={title}
                            onChange={(e) =>
                                setTitle(e.target.value)
                            }
                        />
                    </div>

                    {/* Message */}
                    <div className="announcement-field">
                        <label htmlFor="notice-message">
                            Message
                        </label>

                        <textarea
                            id="notice-message"
                            placeholder="Message students, teachers..."
                            value={message}
                            onChange={(e) =>
                                setMessage(e.target.value)
                            }
                        />
                    </div>

                    {/* Actions */}
                    <div className="announcement-actions">
                        <button
                            type="button"
                            className="announcement-btn cancel"
                            onClick={onClose}
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="announcement-btn post"
                        >
                            Post
                        </button>
                    </div>


                </form>
            </div>
        </div>
    );
};

export default AnnoucementsPopup;