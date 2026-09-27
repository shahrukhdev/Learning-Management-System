import { useEffect, useRef, useState } from "react";

import { Eye, EyeOff, Search, X, Check, ChevronDown } from "lucide-react";

import type { Student } from "../../Attendance/Attendance.types";

import "../Popup.css";

/* =========================
   Types
========================= */

type UserRole = | "admin" | "student" | "teacher" | "parent";

interface AddUserData {
    name: string;
    email: string;
    password: string;
    role: UserRole;
    className?: string;
    parentId?: string;
    subject?: string;
    childrenIds?: string[];
}

interface AddUserPopupProps {
    isOpen: boolean;
    onClose: () => void;

    onAddUser?: (
        data: AddUserData
    ) => void;

    childrenList: Student[];

}

/* =========================
   Component
========================= */

const AddUserPopup = ({
    isOpen,
    onClose,
    onAddUser,
    childrenList,
}: AddUserPopupProps) => {

    /* =========================
       Form State
    ========================= */

    const [name, setName] = useState("");

    const [email, setEmail] = useState("");

    const [password, setPassword] = useState("");

    const [role, setRole] = useState<UserRole>("student");

    const [className, setClassName] = useState("Hifz Level 1");

    const [parentId, setParentId] = useState("");

    const [subject, setSubject] = useState("");

    const [selectedChildren, setSelectedChildren] = useState<string[]>([]);

    /* =========================
       Password
    ========================= */

    const [showPassword, setShowPassword] = useState(false);

    /* =========================
       Children Dropdown
    ========================= */

    const [childrenDropdownOpen, setChildrenDropdownOpen] = useState(false);

    const [childrenSearch, setChildrenSearch] = useState("");

    const childrenDropdownRef = useRef<HTMLDivElement>(null);

    /* =========================
       Reset Form
    ========================= */

    const resetForm = () => {
        setName("");
        setEmail("");
        setPassword("");
        setRole("student");
        setClassName("Hifz Level 1");
        setParentId("");
        setSubject("");
        setSelectedChildren([]);
        setShowPassword(false);
        setChildrenDropdownOpen(false);
        setChildrenSearch("");
    };

    /* =========================
       Outside Click
    ========================= */

    useEffect(() => {

        const handleOutsideClick = (event: MouseEvent) => {

            if (
                childrenDropdownRef.current &&
                !childrenDropdownRef.current.contains(
                    event.target as Node
                )
            ) {

                setChildrenDropdownOpen(false);

            }

        };

        document.addEventListener(
            "mousedown",
            handleOutsideClick
        );

        return () => {

            document.removeEventListener(
                "mousedown",
                handleOutsideClick
            );

        };

    }, []);


    /* =========================
       Filter Students
    ========================= */

    const filteredChildren =
        childrenList.filter((student) => {

            const search =
                childrenSearch
                    .toLowerCase()
                    .trim();


            if (!search) {

                return true;

            }


            return (
                student.name
                    .toLowerCase()
                    .includes(search) ||

                student.email
                    .toLowerCase()
                    .includes(search)
            );

        });


    /* =========================
       Selected Students
    ========================= */

    const selectedChildObjects =
        childrenList.filter((student) =>
            selectedChildren.includes(
                String(student.id)
            )
        );


    /* =========================
       Toggle Student
    ========================= */

    const toggleChild = (
        studentId: string
    ) => {

        setSelectedChildren((current) => {

            if (
                current.includes(studentId)
            ) {

                return current.filter(
                    (id) =>
                        id !== studentId
                );

            }


            return [
                ...current,
                studentId,
            ];

        });

    };


    /* =========================
       Remove Student
    ========================= */

    const removeChild = (
        studentId: string
    ) => {

        setSelectedChildren((current) =>
            current.filter(
                (id) =>
                    id !== studentId
            )
        );

    };


    /* =========================
       Role Change
    ========================= */

    const handleRoleChange = (newRole: UserRole) => {

        setRole(newRole);
        setClassName("Hifz Level 1");
        setParentId("");
        setSubject("");
        setSelectedChildren([]);
        setChildrenDropdownOpen(false);
        setChildrenSearch("");

    };

    /* =========================
       Submit
    ========================= */

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {

        event.preventDefault();

        const userData: AddUserData = {

            name,
            email,
            password,
            role,

        };


        if (role === "student") {

            userData.className =
                className;

            userData.parentId =
                parentId;

        }


        if (role === "teacher") {

            userData.subject =
                subject;

        }


        if (role === "parent") {

            userData.childrenIds =
                selectedChildren;

        }


        console.log(
            "User Data:",
            userData
        );


        onAddUser?.(userData);


        resetForm();

        onClose();

    };


    /* =========================
       Close Popup
    ========================= */

    const handleClose = () => {

        resetForm();

        onClose();

    };


    if (!isOpen) {

        return null;

    }


    return (

        <div className="app-popup-wrapper">

            <div className="app-popup-box">


                {/* =========================
                    Header
                ========================= */}

                <div className="app-popup-header">

                    <h2 className="app-popup-title">
                        Add User
                    </h2>


                    <button
                        type="button"
                        className="app-popup-close"
                        onClick={handleClose}
                        aria-label="Close"
                    >

                        <X
                            size={19}
                            strokeWidth={2}
                        />

                    </button>

                </div>


                {/* =========================
                    Form
                ========================= */}

                <form
                    className="app-popup-form"
                    onSubmit={handleSubmit}
                >

                    <div className="row">


                        {/* =========================
                            Full Name
                        ========================= */}

                        <div className="col-12">

                            <div className="app-popup-field">

                                <label htmlFor="user-name">
                                    Full Name
                                </label>

                                <input
                                    id="user-name"
                                    type="text"
                                    placeholder="Full name"
                                    value={name}
                                    onChange={(event) =>
                                        setName(
                                            event.target.value
                                        )
                                    }
                                    required
                                />

                            </div>

                        </div>


                        {/* =========================
                            Email
                        ========================= */}

                        <div className="col-12 col-md-6">

                            <div className="app-popup-field">

                                <label htmlFor="user-email">
                                    Email
                                </label>

                                <input
                                    id="user-email"
                                    type="email"
                                    placeholder="Email address"
                                    value={email}
                                    onChange={(event) =>
                                        setEmail(
                                            event.target.value
                                        )
                                    }
                                    required
                                />

                            </div>

                        </div>


                        {/* =========================
                            Password
                        ========================= */}

                        <div className="col-12 col-md-6">

                            <div className="app-popup-field">

                                <label htmlFor="user-password">
                                    Password
                                </label>


                                <div className="add-user-password">

                                    <input
                                        id="user-password"
                                        type={
                                            showPassword
                                                ? "text"
                                                : "password"
                                        }
                                        placeholder="Set password"
                                        value={password}
                                        onChange={(event) =>
                                            setPassword(
                                                event.target.value
                                            )
                                        }
                                        required
                                    />


                                    <button
                                        type="button"
                                        className="add-user-password-toggle"
                                        onClick={() =>
                                            setShowPassword(
                                                (current) =>
                                                    !current
                                            )
                                        }
                                        aria-label={
                                            showPassword
                                                ? "Hide password"
                                                : "Show password"
                                        }
                                    >

                                        {showPassword ? (

                                            <EyeOff size={17} />

                                        ) : (

                                            <Eye size={17} />

                                        )}

                                    </button>

                                </div>

                            </div>

                        </div>


                        {/* =========================
                            Role
                        ========================= */}

                        <div className="col-12">

                            <div className="app-popup-field">

                                <label htmlFor="user-role">
                                    Role
                                </label>


                                <div className="add-user-select-wrapper">

                                    <select
                                        id="user-role"
                                        value={role}
                                        onChange={(event) =>
                                            handleRoleChange(
                                                event.target.value as UserRole
                                            )
                                        }
                                    >

                                        <option value="student">
                                            Student
                                        </option>

                                        <option value="teacher">
                                            Teacher
                                        </option>

                                        <option value="parent">
                                            Parent
                                        </option>

                                        <option value="admin">
                                            Admin
                                        </option>

                                    </select>


                                    <ChevronDown
                                        className="add-user-select-icon"
                                        size={17}
                                    />

                                </div>

                            </div>

                        </div>


                        {/* =========================
                            Student
                        ========================= */}

                        {role === "student" && (

                            <>


                                {/* Class */}

                                <div className="col-12 col-md-6">

                                    <div className="app-popup-field">

                                        <label htmlFor="user-class">
                                            Class
                                        </label>


                                        <div className="add-user-select-wrapper">

                                            <select
                                                id="user-class"
                                                value={className}
                                                onChange={(event) =>
                                                    setClassName(
                                                        event.target.value
                                                    )
                                                }
                                            >

                                                <option>
                                                    Hifz Level 1
                                                </option>

                                                <option>
                                                    Hifz Level 2
                                                </option>

                                                <option>
                                                    Hifz Level 3
                                                </option>

                                                <option>
                                                    Arabic Foundations
                                                </option>

                                                <option>
                                                    Tajweed Intermediate
                                                </option>

                                            </select>


                                            <ChevronDown
                                                className="add-user-select-icon"
                                                size={17}
                                            />

                                        </div>

                                    </div>

                                </div>


                                {/* Parent ID */}

                                <div className="col-12 col-md-6">

                                    <div className="app-popup-field">

                                        <label htmlFor="parent-id">
                                            Parent ID
                                        </label>

                                        <input
                                            id="parent-id"
                                            type="text"
                                            placeholder="e.g. p1"
                                            value={parentId}
                                            onChange={(event) =>
                                                setParentId(
                                                    event.target.value
                                                )
                                            }
                                        />

                                    </div>

                                </div>

                            </>

                        )}


                        {/* =========================
                            Teacher
                        ========================= */}

                        {role === "teacher" && (

                            <div className="col-12">

                                <div className="app-popup-field">

                                    <label htmlFor="teacher-subject">
                                        Subject
                                    </label>

                                    <input
                                        id="teacher-subject"
                                        type="text"
                                        placeholder="e.g. Quran & Tajweed"
                                        value={subject}
                                        onChange={(event) =>
                                            setSubject(
                                                event.target.value
                                            )
                                        }
                                        required
                                    />

                                </div>

                            </div>

                        )}


                        {/* =========================
                            Parent
                        ========================= */}

                        {role === "parent" && (

                            <div className="col-12">

                                <div className="app-popup-field">

                                    <label>
                                        Assign Children
                                    </label>


                                    <div
                                        className="add-user-children"
                                        ref={childrenDropdownRef}
                                    >

                                        <div
                                            className={`add-user-children-control ${
                                                childrenDropdownOpen
                                                    ? "open"
                                                    : ""
                                            }`}
                                            onClick={() =>
                                                setChildrenDropdownOpen(
                                                    (current) =>
                                                        !current
                                                )
                                            }
                                        >

                                            {selectedChildObjects.length >
                                            0 ? (

                                                <div className="add-user-selected-list">

                                                    {selectedChildObjects.map(
                                                        (student) => (

                                                            <span
                                                                className="add-user-child-chip"
                                                                key={
                                                                    student.id
                                                                }
                                                            >

                                                                {
                                                                    student.name
                                                                }


                                                                <button
                                                                    type="button"
                                                                    onClick={(
                                                                        event
                                                                    ) => {

                                                                        event.stopPropagation();

                                                                        removeChild(
                                                                            String(
                                                                                student.id
                                                                            )
                                                                        );

                                                                    }}
                                                                    aria-label={`Remove ${student.name}`}
                                                                >

                                                                    <X
                                                                        size={12}
                                                                    />

                                                                </button>

                                                            </span>

                                                        )
                                                    )}

                                                </div>

                                            ) : (

                                                <span className="add-user-children-placeholder">
                                                    Select children
                                                </span>

                                            )}


                                            <ChevronDown
                                                className={`add-user-children-arrow ${
                                                    childrenDropdownOpen
                                                        ? "rotate"
                                                        : ""
                                                }`}
                                                size={17}
                                            />

                                        </div>


                                        {childrenDropdownOpen && (

                                            <div className="add-user-children-dropdown">


                                                {/* Search */}

                                                <div className="add-user-children-search">

                                                    <Search
                                                        size={16}
                                                    />

                                                    <input
                                                        type="text"
                                                        placeholder="Search students..."
                                                        value={
                                                            childrenSearch
                                                        }
                                                        onChange={(
                                                            event
                                                        ) =>
                                                            setChildrenSearch(
                                                                event.target.value
                                                            )
                                                        }
                                                        onClick={(
                                                            event
                                                        ) =>
                                                            event.stopPropagation()
                                                        }
                                                    />

                                                </div>


                                                {/* List */}

                                                <div className="add-user-children-list">

                                                    {filteredChildren.length >
                                                    0 ? (

                                                        filteredChildren.map(
                                                            (student) => {

                                                                const studentId =
                                                                    String(
                                                                        student.id
                                                                    );

                                                                const isSelected =
                                                                    selectedChildren.includes(
                                                                        studentId
                                                                    );


                                                                return (

                                                                    <button
                                                                        type="button"
                                                                        className={`add-user-child-option ${
                                                                            isSelected
                                                                                ? "selected"
                                                                                : ""
                                                                        }`}
                                                                        key={
                                                                            student.id
                                                                        }
                                                                        onClick={() =>
                                                                            toggleChild(
                                                                                studentId
                                                                            )
                                                                        }
                                                                    >

                                                                        <div className="add-user-child-info">

                                                                            <span className="add-user-child-name">
                                                                                {
                                                                                    student.name
                                                                                }
                                                                            </span>

                                                                            <span className="add-user-child-meta">
                                                                                {
                                                                                    student.email
                                                                                }
                                                                            </span>

                                                                        </div>


                                                                        <span
                                                                            className={`add-user-child-check ${
                                                                                isSelected
                                                                                    ? "checked"
                                                                                    : ""
                                                                            }`}
                                                                        >

                                                                            {isSelected && (

                                                                                <Check
                                                                                    size={13}
                                                                                    strokeWidth={3}
                                                                                />

                                                                            )}

                                                                        </span>

                                                                    </button>

                                                                );

                                                            }
                                                        )

                                                    ) : (

                                                        <div className="add-user-no-children">
                                                            No students found.
                                                        </div>

                                                    )}

                                                </div>


                                                {/* Footer */}

                                                <div className="add-user-children-footer">

                                                    <span>
                                                        {
                                                            selectedChildren.length
                                                        }{" "}
                                                        selected
                                                    </span>


                                                    {selectedChildren.length >
                                                        0 && (

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                setSelectedChildren(
                                                                    []
                                                                )
                                                            }
                                                        >
                                                            Clear
                                                        </button>

                                                    )}

                                                </div>

                                            </div>

                                        )}

                                    </div>

                                </div>

                            </div>

                        )}


                        {/* =========================
                            Actions
                        ========================= */}

                        <div className="col-12">

                            <div className="app-popup-actions">

                                <button
                                    type="button"
                                    className="app-popup-btn cancel"
                                    onClick={handleClose}
                                >
                                    Cancel
                                </button>


                                <button
                                    type="submit"
                                    className="app-popup-btn submit"
                                >
                                    Add User
                                </button>

                            </div>

                        </div>

                    </div>

                </form>

            </div>

        </div>

    );

};


export default AddUserPopup;