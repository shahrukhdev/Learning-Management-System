
import "./Announcements.css";
import { Plus } from "lucide-react";

interface Announcement {
    id: number;
    title: string;
    description: string;
    date?: string;
    dotClass: string;
}

interface AnnouncementsProps {
    showAddButton?: boolean;
    limit?: number;
}

const announcements: Announcement[] = [
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
    {
        id: 4,
        title: "New Hifz Classes",
        description: "New batch starting from 5 May",
        dotClass: "green",
    },
    {
        id: 5,
        title: "Weekly Quran Competition",
        description: "Every Friday after Asr prayer",
        dotClass: "yellow",
    },
    {
        id: 6,
        title: "Madrassah Holiday Notice",
        description: "Madrassah will remain closed on Sunday",
        dotClass: "blue",
    },
    {
        id: 7,
        title: "Monthly Progress Report",
        description: "Student progress reports will be shared soon",
        dotClass: "green",
    },
];

const Announcements = ({
    showAddButton = true,
    limit = 3,
}: AnnouncementsProps) => {

    const visibleAnnouncements = announcements.slice(0, limit);

    return (
        <div className="announcement dashboard-box">

            <div className="dash-box-top">

                <h2 className="dash-box-title">
                    Announcements
                </h2>

                {showAddButton && (
                    <button type="button" className="add-btn">
                        <Plus
                            color="#33423C"
                            size={18}
                            strokeWidth={2.5}
                        />
                    </button>
                )}

            </div>

            {/* Announcement List */}
            <div className="announcement-list">

                {visibleAnnouncements.map((announcement) => (
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
