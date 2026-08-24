import "./Announcements.css";
import { Plus } from "lucide-react";

interface Announcements {
    id: number;
    title: string;
    description: string;
    date?: string;
    dotClass: string;
}

const announcements: Announcements[] = [
    {
        id: 1,
        title: "Ramadan Schedule Change",
        description: "Effective from 10 Apr — classes shift to evening",
        dotClass: "green",
    },
    {
        id: 2,
        title: "Hifz Exam – End of Month",
        description: "2026-04-28 · All Hifz levels",
        dotClass: "yellow",
    },
    {
        id: 3,
        title: "Parent–Teacher Evening",
        description: "2026-04-25 · 5:00 PM onward",
        dotClass: "blue",
    },
]

const Announcements = () => {
    return (
        <div className="announcement dashboard-box">
            <div className="dash-box-top">
                <h2 className="dash-box-title">
                    Announcements
                </h2>
                <button type="button" className="add-btn">
                    <Plus color="#33423C" size={18} strokeWidth={2.5} />
                </button>
            </div>

            {/* Announcement List */}
            <div className="announcement-list">

                {announcements.map((announcement) => (
                    <div
                        className="announcement-item"
                        key={announcement.id}
                    >

                        <span
                            className={`announcement-dot ${announcement.dotClass}`}
                        />

                        <div className="announcement-content">

                            <h3 className="sm-title announcement-title m-0">
                                {announcement.title}
                            </h3>

                            <p className="sm-para announcement-description m-0">
                                {announcement.description}
                            </p>

                        </div>

                    </div>
                ))}

            </div>

        </div>
    );
};

export default Announcements;