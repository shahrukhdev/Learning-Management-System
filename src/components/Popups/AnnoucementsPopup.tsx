import { useState } from "react";
import "./AnnoucementsPopup.css";

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
            <div className="popup-box">
                <h2 className="popup-title">Add New Announcement</h2>
                <form className="m-0" onSubmit={handleSubmit}>
                    
                </form>
            </div>
        </div>
    );
};

export default AnnoucementsPopup;