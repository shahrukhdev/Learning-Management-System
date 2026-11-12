
import "../../../Hifz/HifzStudentDetails/HifzTabs/HifzTabs.css";

export type StudentHifzTab =
    | "quran-map"
    | "surah-list"
    | "sessions";

interface StudentHifzTabsProps {
    activeTab: StudentHifzTab;
    onTabChange: (tab: StudentHifzTab) => void;
}

const tabs: {
    id: StudentHifzTab;
    label: string;
}[] = [
    {
        id: "quran-map",
        label: "Quran Map",
    },
    {
        id: "surah-list",
        label: "Surah List",
    },
    {
        id: "sessions",
        label: "Sessions",
    },
];

const StudentHifzTabs = ({
    activeTab,
    onTabChange,
}: StudentHifzTabsProps) => {
    return (
        <div className="hifz-student-tabs">

            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    type="button"
                    className={`hifz-student-tab ${
                        activeTab === tab.id ? "active" : ""
                    }`}
                    onClick={() => onTabChange(tab.id)}
                >
                    {tab.label}
                </button>
            ))}

        </div>
    );
};

export default StudentHifzTabs;
