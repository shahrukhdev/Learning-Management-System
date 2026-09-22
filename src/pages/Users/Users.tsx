import { useState } from "react";

import { UserPlus } from "lucide-react";
import SEO from "../../components/Seo/SEO";
import "./Users.css";

import UserManagementTabs from "../../components/Users/UserTabs";
import UserManagementTable from "../../components/Users/UsersTable";
import FilterBar from "../../components/FilterBar/FilterBar";

const Users = () => {

    const [activeTab, setActiveTab] = useState("all");

    const [search, setSearch] = useState("");

    return (
        <>
            <SEO
                title="User Management | Noor Ul Imaan Masjid"
                description="Manage users in Noor Ul Imaan Masjid Madrassah Portal."
            />

            <section className="user-management-section">
                <div className="container-fluid">
                    <div className="row">

                        <div className="col-12">
                            <div className="section-head">
                                <div className="">
                                    <h1 className="section-title">
                                        User Management
                                    </h1>
                                    <p className="section-desc-para m-0">Manage staff, students, and system access.</p>
                                </div> 
                                <button 
                                    type="button"
                                    className="new-notice-btn"
                                >
                                    <UserPlus color="#fff" size={20} strokeWidth={2.5} />
                                    <span>Add New User</span>
                                </button>
                            </div>
                        </div>

                        {/* Main Card */}

                        <div className="col-12">

                            <div className="user-management-card">

                                {/* Top Controls */}

                                <div className="user-management-controls">

                                    <UserManagementTabs
                                        activeTab={activeTab}
                                        onTabChange={setActiveTab}
                                    />


                                    {/* Search */}

                                    <FilterBar
                                        searchPlaceholder="Search users..."
                                        searchValue={search}
                                        onSearchChange={setSearch}
                                    />

                                </div>


                                {/* Table */}

                                <UserManagementTable
                                    search={search}
                                    activeTab={activeTab}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default Users;