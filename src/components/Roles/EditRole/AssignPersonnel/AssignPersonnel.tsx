import { useMemo, useState } from "react";

import { Search, UserRoundArrowLeft } from "lucide-react";

import { assignedPersonnel, availablePersonnel, type Personnel } from "./AssignPersonnel.data";

import "./AssignPersonnel.css";


const AssignPersonnel = () => {

    const [search, setSearch] = useState("");

    /*
     * Initially assigned personnel
     * are checked.
     */
    const [selectedPersonnel, setSelectedPersonnel] =
        useState<number[]>(
            assignedPersonnel.map(
                (person) => person.id
            )
        );


    /* =========================
       Search
    ========================= */

    const filteredAssigned = useMemo(() => {

        const query =
            search.toLowerCase().trim();

        if (!query) {
            return assignedPersonnel;
        }

        return assignedPersonnel.filter(
            (person) =>
                person.name
                    .toLowerCase()
                    .includes(query) ||
                person.department
                    .toLowerCase()
                    .includes(query)
        );

    }, [search]);


    const filteredAvailable = useMemo(() => {

        const query =
            search.toLowerCase().trim();

        if (!query) {
            return availablePersonnel;
        }

        return availablePersonnel.filter(
            (person) =>
                person.name
                    .toLowerCase()
                    .includes(query) ||
                person.department
                    .toLowerCase()
                    .includes(query)
        );

    }, [search]);


    /* =========================
       Checkbox
    ========================= */

    const handlePersonnelToggle = (personId: number) => {

        setSelectedPersonnel((current) => {

            if (current.includes(personId)) {

                return current.filter(
                    (id) => id !== personId
                );

            }

            return [
                ...current,
                personId,
            ];

        });

    };


    /* =========================
       Person
    ========================= */

    const renderPerson = (person: Personnel) => {

        const isSelected = selectedPersonnel.includes(person.id);

        return (

            <label
                className="personnel-item"
                key={person.id}
            >

                {/* Avatar */}

                <div className="personnel-avatar">

                    {person.image ? (

                        <img
                            src={person.image}
                            alt={person.name}
                        />

                    ) : (

                        person.name.charAt(0)

                    )}

                </div>


                {/* Information */}

                <div className="personnel-info">

                    <span className="personnel-name">
                        {person.name}
                    </span>

                    <span className="personnel-department">
                        {person.department}
                    </span>

                </div>


                {/* Checkbox */}

                <input
                    type="checkbox"
                    className="personnel-checkbox"
                    checked={isSelected}
                    onChange={() =>
                        handlePersonnelToggle(
                            person.id
                        )
                    }
                    aria-label={`Assign ${person.name}`}
                />

            </label>

        );

    };


    return (

        <div className="assign-personnel-card">

            {/* =========================
                Header
            ========================= */}

            <div className="assign-personnel-header">

                <div className="assign-personnel-title">

                    <div className="assign-personnel-icon">

                        <UserRoundArrowLeft
                            size={18}
                            strokeWidth={2}
                        />

                    </div>

                    <div>

                        <h2>
                            Assign Personnel
                        </h2>

                        <p>
                            Assign staff members to this role.
                        </p>

                    </div>

                </div>

            </div>


            {/* =========================
                Search
            ========================= */}

            <div className="personnel-search-wrapper">

                <Search
                    size={16}
                    strokeWidth={2}
                />

                <input
                    type="text"
                    value={search}
                    onChange={(e) =>
                        setSearch(
                            e.target.value
                        )
                    }
                    placeholder="Search staff members..."
                    aria-label="Search staff members"
                />

            </div>


            {/* =========================
                Currently Assigned
            ========================= */}

            <div className="personnel-section">

                <div className="personnel-section-title">
                    Currently Assigned
                </div>


                <div className="personnel-list">

                    {filteredAssigned.length > 0 ? (

                        filteredAssigned.map(
                            (person) =>
                                renderPerson(person)
                        )

                    ) : (

                        <p className="personnel-empty">
                            No assigned staff found.
                        </p>

                    )}

                </div>

            </div>


            {/* =========================
                Available Staff
            ========================= */}

            <div className="personnel-section personnel-available-section">

                <div className="personnel-section-title">
                    Available Staff
                </div>


                <div className="personnel-list">

                    {filteredAvailable.length > 0 ? (

                        filteredAvailable.map(
                            (person) =>
                                renderPerson(person)
                        )

                    ) : (

                        <p className="personnel-empty">
                            No available staff found.
                        </p>

                    )}

                </div>

            </div>

        </div>

    );

};


export default AssignPersonnel;