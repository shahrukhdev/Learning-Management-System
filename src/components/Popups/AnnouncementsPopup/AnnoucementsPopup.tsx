import { useState } from "react";

import { X } from "lucide-react";

import "../Popup.css";


interface AnnoucementPopupProps {

    isOpen: boolean;

    onClose: () => void;

    onPost?: (data: {
        title: string;
        message: string;
    }) => void;

}


const AnnoucementsPopup = ({
    isOpen,
    onClose,
    onPost,
}: AnnoucementPopupProps) => {


    const [title, setTitle] =
        useState("");

    const [message, setMessage] =
        useState("");


    if (!isOpen) {

        return null;

    }


    const handleSubmit = (
        event: React.FormEvent<HTMLFormElement>
    ) => {

        event.preventDefault();


        onPost?.({
            title,
            message,
        });


        setTitle("");

        setMessage("");

        onClose();

    };


    return (

        <div className="app-popup-wrapper">

            <div className="app-popup-box">


                {/* =========================
                    Header
                ========================= */}

                <div className="app-popup-header">

                    <h2 className="app-popup-title">
                        Announcement
                    </h2>


                    <button
                        type="button"
                        className="app-popup-close"
                        onClick={onClose}
                        aria-label="Close"
                    >

                        <X
                            size={19}
                            strokeWidth={2}
                        />

                    </button>

                </div>


                {/* =========================
                    Form
                ========================= */}

                <form
                    className="app-popup-form"
                    onSubmit={handleSubmit}
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
                            onChange={(event) =>
                                setTitle(
                                    event.target.value
                                )
                            }
                            required
                        />

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
                            onChange={(event) =>
                                setMessage(
                                    event.target.value
                                )
                            }
                            required
                        />

                    </div>


                    {/* =========================
                        Actions
                    ========================= */}

                    <div className="app-popup-actions">

                        <button
                            type="button"
                            className="app-popup-btn cancel"
                            onClick={onClose}
                        >
                            Cancel
                        </button>


                        <button
                            type="submit"
                            className="app-popup-btn post"
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