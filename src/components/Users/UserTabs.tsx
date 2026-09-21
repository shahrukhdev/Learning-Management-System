interface UserManagementTabsProps {
    activeTab: string;
    onTabChange: (tab: string) => void;
}

const tabs = [
    {
        value: "all",
        label: "All Users",
    },
    {
        value: "teachers",
        label: "Teachers",
    },
    {
        value: "students",
        label: "Students",
    },
    {
        value: "admins",
        label: "Admins",
    },
];

const UserManagementTabs = ({
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
