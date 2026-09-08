import { useState } from "react";
import { Plus } from "lucide-react";
import SEO from "../../components/Seo/SEO";

import NoticeList from "../../components/Notices/NoticesList";
import { notices } from "../../components/Notices/Notices.data";
import "../../components/Notices/Notices.css";
import AnnoucementsPopup from "../../components/Popups/AnnoucementsPopup";

const Notices = () => {

    const [isAnnouncementOpen, setIsAnnouncementOpen] = useState(false);

    const handlePost = (data: {
        title: string;
        message: string;
    }) => {
        console.log("Post:", data);
    }

    const handleCloseAnnouncement = () => {
        setIsAnnouncementOpen(false);
    }

    const handleEdit = (id: number) => {
        console.log("Edit Notice:", id);
    }

    const handleDelete = (id: number) => {
        console.log("Delete Notice:", id);
    }

    return (
        <>
            <SEO
                title="Notices | Noor Ul Imaan Masjid"
                description="Manage notices for Noor Ul Imaan Masjid Madrassah Portal."
            />

            <section className="notices-section">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-12">
                            <div className="notices-head">
                                <div className="">
                                    <h1 className="section-title">
                                        Notices & Announcements
                                    </h1>
                                    <p className="notices-desc m-0">Communicate with teachers, students and parents</p>
                                </div> 
                                <button 
                                    type="button"
                                    className="new-notice-btn"
                                    onClick={() => setIsAnnouncementOpen(true)}
                                >
                                    <Plus color="#fff" size={20} strokeWidth={2.5} />
                                    <span>New Notice</span>
                                </button>
                            </div>
                        </div>

                        {/* Notice List */}
                        <div className="col-12">
                            <div className="notice-box">
                                {notices.map((notice) => (
                                    <NoticeList 
                                        key={notice.id}
                                        notice={notice}
                                        onEdit={handleEdit}
                                        onDelete={handleDelete}                                        
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Annoucements Popup */}
            <AnnoucementsPopup
                isOpen={isAnnouncementOpen}
                onClose={handleCloseAnnouncement}
                onPost={handlePost}
            />

        </>
    );
};

export default Notices;