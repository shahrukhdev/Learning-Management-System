import "./HifzTabs.css";

export type HifzStudentTab =
    | "student-log"
    | "quran-map"
    | "surah-list"
    | "sessions";

interface HifzStudentTabsProps {
    activeTab: HifzStudentTab;
    onTabChange: (tab: HifzStudentTab) => void;
}

const tabs: {
    id: HifzStudentTab;
    label: string;
}[] = [
    {
        id: "student-log",
        label: "Student Log",
    },
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

const HifzStudentTabs = ({
    activeTab,
    onTabChange,
}: HifzStudentTabsProps) => {

    return (
        <div className="hifz-student-tabs">

            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    type="button"
                    className={`hifz-student-tab ${
                        activeTab === tab.id
                            ? "active"
                            : ""
                    }`}
                    onClick={() => onTabChange(tab.id)}
                >
                    {tab.label}
                </button>
            ))}

        </div>
    );
};

export default HifzStudentTabs;