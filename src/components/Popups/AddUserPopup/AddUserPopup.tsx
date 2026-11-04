import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";

import { Eye, EyeOff, Search, X, Check, ChevronDown, Phone } from "lucide-react";
import { toast } from "react-toastify";

import type { Student } from "../../Attendance/Attendance.types";
import type { ManagedUser, UserRoleSummary } from "../../../types/user.types";
import { createUser } from "../../../services/userService";
import { parseApiError } from "../../../utils/apiError";

import "../Popup.css";

/* =========================
   Types
========================= */

type UserRole = | "admin" | "student" | "teacher" | "parent";

// Fields validated on the client and by the backend (Laravel names)
type AddUserField = "name" | "email" | "password" | "phone_no" | "roles";

type AddUserErrors = Partial<Record<AddUserField, string>>;

interface AddUserPopupProps {
    isOpen: boolean;
    onClose: () => void;

    // Called after the API created the user
    onUserCreated?: (
        user: ManagedUser | undefined
    ) => void;

    // Roles with real IDs (from the users list); filtered to the enabled ones
    roleOptions: UserRoleSummary[];

    childrenList: Student[];

}

/* =========================
   Constants
========================= */

// Only Admin can be created for now. The Student/Teacher/Parent sections
// below are kept for when those roles are enabled.
const ENABLED_ROLE_KINDS: UserRole[] = ["admin"];

// Mirrors the backend rules
const MAX_NAME_LENGTH = 255;
const MAX_EMAIL_LENGTH = 255;
const MAX_PHONE_LENGTH = 20;
const MIN_PASSWORD_LENGTH = 8;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const ADD_USER_FIELDS: AddUserField[] = ["name", "email", "password", "phone_no", "roles"];

// Maps a backend role name to the popup's role sections
const toRoleKind = (roleName: string): UserRole | null => {
    const kind = roleName.trim().toLowerCase();

    return kind === "admin" || kind === "student" || kind === "teacher" || kind === "parent"
        ? kind
        : null;
};

/* =========================
   Component
========================= */

const AddUserPopup = ({
    isOpen,
    onClose,
    onUserCreated,
    roleOptions,
    childrenList,
}: AddUserPopupProps) => {

    /* =========================
       Form State
    ========================= */

    const [name, setName] = useState("");

    const [email, setEmail] = useState("");

    const [password, setPassword] = useState("");

    const [phone, setPhone] = useState("");

    // Selected backend role ID (sent in `roles`) and its kind (drives the
    // role-specific sections). Nothing is selected until the user picks one.
    const [roleId, setRoleId] = useState<number | null>(null);

    const [role, setRole] = useState<UserRole | null>(null);

    const [errors, setErrors] = useState<AddUserErrors>({});

    const [isSubmitting, setIsSubmitting] = useState(false);

    const isSubmittingRef = useRef(false);

    // Role IDs come from real data; only enabled role kinds are offered
    const availableRoles = roleOptions.filter((option) => {
        const kind = toRoleKind(option.name);
        return kind !== null && ENABLED_ROLE_KINDS.includes(kind);
    });

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
        setPhone("");
        setRoleId(null);
        setRole(null);
        setErrors({});
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

    const handleRoleChange = (newRole: UserRole | null) => {

        setRole(newRole);
        setClassName("Hifz Level 1");
        setParentId("");
        setSubject("");
        setSelectedChildren([]);
        setChildrenDropdownOpen(false);
        setChildrenSearch("");

    };

    /* =========================
       Role Select (backend role ID)
    ========================= */

    const handleRoleSelect = (value: string) => {

        const selected =
            availableRoles.find((option) => String(option.id) === value) ?? null;

        setRoleId(selected ? selected.id : null);

        handleRoleChange(selected ? toRoleKind(selected.name) : null);

        clearError("roles");

    };


    /* =========================
       Validation
    ========================= */

    const clearError = (field: AddUserField) => {

        setErrors((current) =>
            current[field] ? { ...current, [field]: undefined } : current
        );

    };

    const validate = (): AddUserErrors => {

        const result: AddUserErrors = {};

        const trimmedName = name.trim();
        const trimmedEmail = email.trim();

        if (!trimmedName) {
            result.name = "The name field is required.";
        } else if (trimmedName.length > MAX_NAME_LENGTH) {
            result.name = `The name must not be greater than ${MAX_NAME_LENGTH} characters.`;
        }

        if (!trimmedEmail) {
            result.email = "The email field is required.";
        } else if (!EMAIL_PATTERN.test(trimmedEmail)) {
            result.email = "The email must be a valid email address.";
        } else if (trimmedEmail.length > MAX_EMAIL_LENGTH) {
            result.email = `The email must not be greater than ${MAX_EMAIL_LENGTH} characters.`;
        }

        if (!password) {
            result.password = "The password field is required.";
        } else if (password.length < MIN_PASSWORD_LENGTH) {
            result.password = `The password must be at least ${MIN_PASSWORD_LENGTH} characters.`;
        }

        if (phone.trim().length > MAX_PHONE_LENGTH) {
            result.phone_no = `The phone number must not be greater than ${MAX_PHONE_LENGTH} characters.`;
        }

        if (roleId === null) {
            result.roles = "Please select a role.";
        }

        return result;

    };


    /* =========================
       Submit
    ========================= */

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {

        event.preventDefault();

        if (isSubmittingRef.current) return;

        const clientErrors = validate();

        if (Object.keys(clientErrors).length > 0 || roleId === null) {
            setErrors(clientErrors);
            return;
        }

        isSubmittingRef.current = true;
        setIsSubmitting(true);
        setErrors({});

        try {

            // Role-specific fields (class, parent, subject, children) are not
            // part of this API yet, so they are not sent
            const response = await createUser({
                name: name.trim(),
                email: email.trim(),
                password,
                phone_no: phone.trim() || null,
                roles: [roleId],
            });

            toast.success(response.message || "User created successfully.");

            resetForm();

            onClose();

            onUserCreated?.(response.data);

        } catch (error) {

            const { status, message, validationErrors } = parseApiError(error);

            if (status === 401) return; // handled globally

            if (status === 422 && validationErrors) {

                // Laravel keys like "roles.0" belong to the "roles" field
                const inlineErrors: AddUserErrors = {};

                Object.entries(validationErrors).forEach(([key, messages]) => {

                    const field = key.split(".")[0] as AddUserField;

                    if (
                        ADD_USER_FIELDS.includes(field) &&
                        !inlineErrors[field] &&
                        Array.isArray(messages) &&
                        messages.length > 0
                    ) {
                        inlineErrors[field] = messages[0];
                    }

                });

                setErrors(inlineErrors);

                // Only toast if nothing could be shown inline
                if (Object.keys(inlineErrors).length === 0) {
                    toast.error(message);
                }

            } else {

                toast.error(message);

            }

        } finally {

            isSubmittingRef.current = false;
            setIsSubmitting(false);

        }

    };


    /* =========================
       Close Popup
    ========================= */

    const handleClose = () => {

        if (isSubmittingRef.current) return;

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
                        disabled={isSubmitting}
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
                    noValidate
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
                                    onChange={(event) => {
                                        setName(
                                            event.target.value
                                        );
                                        clearError("name");
                                    }}
                                    autoComplete="name"
                                    aria-invalid={Boolean(errors.name)}
                                    required
                                />

                                {errors.name && (
                                    <span className="error-text">{errors.name}</span>
                                )}

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
                                    onChange={(event) => {
                                        setEmail(
                                            event.target.value
                                        );
                                        clearError("email");
                                    }}
                                    autoComplete="off"
                                    aria-invalid={Boolean(errors.email)}
                                    required
                                />

                                {errors.email && (
                                    <span className="error-text">{errors.email}</span>
                                )}

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
                                        onChange={(event) => {
                                            setPassword(
                                                event.target.value
                                            );
                                            clearError("password");
                                        }}
                                        autoComplete="new-password"
                                        aria-invalid={Boolean(errors.password)}
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

                                {errors.password && (
                                    <span className="error-text">{errors.password}</span>
                                )}

                            </div>

                        </div>


                        {/* =========================
                            Phone Number (optional)
                        ========================= */}

                        <div className="col-12">

                            <div className="app-popup-field">

                                <label htmlFor="user-phone">
                                    Phone Number
                                </label>

                                <div className="add-user-input-icon">

                                    <input
                                        id="user-phone"
                                        type="tel"
                                        placeholder="Enter phone number"
                                        value={phone}
                                        onChange={(event) => {
                                            setPhone(
                                                event.target.value
                                            );
                                            clearError("phone_no");
                                        }}
                                        autoComplete="tel"
                                        aria-invalid={Boolean(errors.phone_no)}
                                    />

                                    <Phone size={15} />

                                </div>

                                {errors.phone_no && (
                                    <span className="error-text">{errors.phone_no}</span>
                                )}

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

                                    {/* Only enabled roles (Admin for now), with
                                        their real IDs. Student, Teacher and
                                        Parent return once they are enabled. */}
                                    <select
                                        id="user-role"
                                        value={roleId === null ? "" : String(roleId)}
                                        onChange={(event) =>
                                            handleRoleSelect(
                                                event.target.value
                                            )
                                        }
                                        aria-invalid={Boolean(errors.roles)}
                                    >

                                        <option value="">
                                            {availableRoles.length > 0
                                                ? "Select role"
                                                : "No roles available"}
                                        </option>

                                        {availableRoles.map((option) => (

                                            <option
                                                key={option.id}
                                                value={option.id}
                                            >
                                                {option.name}
                                            </option>

                                        ))}

                                    </select>


                                    <ChevronDown
                                        className="add-user-select-icon"
                                        size={17}
                                    />

                                </div>

                                {errors.roles && (
                                    <span className="error-text">{errors.roles}</span>
                                )}

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
                                    disabled={isSubmitting}
                                >
                                    Cancel
                                </button>


                                <button
                                    type="submit"
                                    className="app-popup-btn submit"
                                    disabled={isSubmitting}
                                    aria-busy={isSubmitting}
                                >
                                    {isSubmitting ? "Adding..." : "Add User"}
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