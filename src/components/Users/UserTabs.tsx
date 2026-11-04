export interface UserTab {
    value: string;
    label: string;
}

interface UserManagementTabsProps {
    tabs: UserTab[];
    activeTab: string;
    onTabChange: (tab: string) => void;
}

const UserManagementTabs = ({
    tabs,
    activeTab,
    onTabChange,
}: UserManagementTabsProps) => {

    return (
        <div className="user-management-tabs">

            {tabs.map((tab) => (

                <button
                    key={tab.value}
                    type="button"
                    className={
                        activeTab === tab.value
                            ? "active"
                            : ""
                    }
                    onClick={() =>
                        onTabChange(tab.value)
                    }
                >
                    {tab.label}
                </button>

            ))}

        </div>
    );
};

export default UserManagementTabs;
