import { useState } from "react";

import FilterBar from "../../components/FilterBar/FilterBar";
import SEO from "../../components/Seo/SEO";

const Attendance = () => {

    const [search, setSearch] = useState("");
    const [classFilter, setClassFilter] = useState("all");
    const [status, setStatus] = useState("all");
    const [date, setDate] = useState("2023-10-24");

    return (
        <>
            <SEO
                title="Attendance | Noor Ul Imaan Masjid"
                description="Manage your Noor Ul Imaan Masjid Madrassah Portal attendance."
            />

            <section className="attendance-section">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-12">
                            <h1 className="section-title">
                                Attendance
                            </h1>
                        </div>

                        {/* Filter Bar */}
                        <div className="students-page">

                            <FilterBar
                                searchPlaceholder="Search students, teachers..."
                                searchValue={search}
                                onSearchChange={setSearch}

                                selectFilters={[
                                    {
                                        name: "class",
                                        value: classFilter,
                                        onChange: setClassFilter,
                                        options: [
                                            {
                                                value: "all",
                                                label: "All Classes",
                                            },
                                            {
                                                value: "class-a",
                                                label: "Class A",
                                            },
                                            {
                                                value: "class-b",
                                                label: "Class B",
                                            },
                                        ],
                                    },
                                    {
                                        name: "status",
                                        value: status,
                                        onChange: setStatus,
                                        options: [
                                            {
                                                value: "all",
                                                label: "Status",
                                            },
                                            {
                                                value: "active",
                                                label: "Active",
                                            },
                                            {
                                                value: "inactive",
                                                label: "Inactive",
                                            },
                                        ],
                                    },
                                ]}

                                dateValue={date}
                                onDateChange={setDate}
                            />

                        </div>
                    </div>
                </div>
            </section>

        </>
    );
};

export default Attendance;