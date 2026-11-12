import "./HifzTabs.css";

export type HifzStudentTab =
    | "student-log"
    | "quran-map"
    | "surah-list"
    | "sessions";

interface HifzStudentTabsProps {
    activeTab: HifzStudentTab;
    onTabChange: (tab: HifzStudentTab) => void;
    // Tabs the user may open (by permission); all tabs when omitted
    visibleTabs?: HifzStudentTab[];
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
    visibleTabs,
}: HifzStudentTabsProps) => {

    const shownTabs = visibleTabs ? tabs.filter((tab) => visibleTabs.includes(tab.id)) : tabs;

    return (
        <div className="hifz-student-tabs">

            {shownTabs.map((tab) => (
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