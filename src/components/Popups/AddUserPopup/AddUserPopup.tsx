import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";

import { Eye, EyeOff, Search, X, Check, ChevronDown, Phone } from "lucide-react";
import { toast } from "react-toastify";

import type { Student } from "../../Attendance/Attendance.types";
import type { ManagedUser, UpdateUserRequest, UserRoleSummary } from "../../../types/user.types";
import { createUser, getUser, updateUser } from "../../../services/userService";
import { parseApiError } from "../../../utils/apiError";
import { useAcademicClassOptions } from "../../../hooks/useAcademicClassOptions";

import "../Popup.css";

/* =========================
   Types
========================= */

type UserRole = "admin" | "student" | "teacher" | "parent";

type AddUserField =
    | "name"
    | "email"
    | "password"
    | "phone_no"
    | "is_active"
    | "roles"
    | "class_id"
    | "class_ids"
    | "year";

type AddUserErrors = Partial<Record<AddUserField, string>>;

interface AddUserPopupProps {
    isOpen: boolean;
    onClose: () => void;
    editUserId?: number | null;
    onUserCreated?: (user: ManagedUser | undefined) => void;
    onUserUpdated?: (user: ManagedUser) => void;
    roleOptions: UserRoleSummary[];
    childrenList: Student[];
}

/* =========================
   Constants
========================= */

// Parent is hidden for now. Restore it here when needed.
const ENABLED_ROLE_KINDS: UserRole[] = ["admin", "teacher", "student"];

// Legacy role-specific sections remain disabled.
const SECTION_ROLE_KINDS: UserRole[] = [];

const MAX_NAME_LENGTH = 255;
const MAX_EMAIL_LENGTH = 255;
const MAX_PHONE_LENGTH = 20;
const MIN_PASSWORD_LENGTH = 8;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const ADD_USER_FIELDS: AddUserField[] = [
    "name",
    "email",
    "password",
    "phone_no",
    "is_active",
    "roles",
    "class_id",
    "class_ids",
    "year",
];

// Student year: a 4-digit calendar year from 2000 to next year
const MIN_STUDENT_YEAR = 2000;

const currentYear = () => new Date().getFullYear();

const toRoleKind = (roleName: string): UserRole | null => {
    const kind = roleName.trim().toLowerCase();

    if (kind === "super admin") return "admin";

    return kind === "admin" ||
        kind === "student" ||
        kind === "teacher" ||
        kind === "parent"
        ? kind
        : null;
};

/* =========================
   Component
========================= */

const AddUserPopup = ({
    isOpen,
    onClose,
    editUserId = null,
    onUserCreated,
    onUserUpdated,
    roleOptions,
    childrenList,
}: AddUserPopupProps) => {

    const isEditMode = editUserId !== null;

    /* =========================
       Form State
    ========================= */

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [phone, setPhone] = useState("");

    const [roleId, setRoleId] = useState<number | null>(null);
    const [role, setRole] = useState<UserRole | null>(null);

    const [isActive, setIsActive] = useState(true);

    const [currentRoles, setCurrentRoles] = useState<UserRoleSummary[]>([]);

    const [errors, setErrors] = useState<AddUserErrors>({});

    const [isSubmitting, setIsSubmitting] = useState(false);

    const isSubmittingRef = useRef(false);

    // Edit mode: loaded user and request attempt
    const [loadState, setLoadState] = useState<{
        id: number;
        token: number;
        error: string | null;
    } | null>(null);

    const [loadToken, setLoadToken] = useState(0);

    const isLoadingUser =
        isOpen &&
        isEditMode &&
        !(loadState && loadState.id === editUserId && loadState.token === loadToken);

    const loadError =
        isEditMode && loadState?.id === editUserId
            ? loadState.error
            : null;

    // Available roles
    const availableRoles = roleOptions.filter((option) => {
        const kind = toRoleKind(option.name);
        return kind !== null && ENABLED_ROLE_KINDS.includes(kind);
    });

    // Keep the current role available when editing
    const roleChoices = [
        ...availableRoles,
        ...currentRoles.filter(
            (current) => !availableRoles.some((option) => option.id === current.id)
        ),
    ];

    // Legacy role-specific sections
    const sectionRole =
        role !== null && SECTION_ROLE_KINDS.includes(role)
            ? role
            : null;

    const [className, setClassName] = useState("Hifz Level 1");

    /* =========================
       Academic Classes
    ========================= */

    const isStudent = role === "student";
    const isTeacher = role === "teacher";

    // Student: one class ID
    const [classId, setClassId] = useState<number | null>(null);

    // Teacher: multiple class IDs
    const [classIds, setClassIds] = useState<number[]>([]);

    // Student: calendar year (kept as text while typing; sent as a number)
    const [year, setYear] = useState("");

    const maxStudentYear = currentYear() + 1;

    // Edit mode: current Student class
    const [currentClass, setCurrentClass] = useState<{
        id: number;
        name: string;
    } | null>(null);

    // Load academic classes for Students and Teachers
    const studentClasses = useAcademicClassOptions(
        isOpen && (isStudent || isTeacher)
    );

    const classChoices = [
        ...studentClasses.classes,
        ...(currentClass &&
        !studentClasses.classes.some((option) => option.id === currentClass.id)
            ? [currentClass]
            : []),
    ];

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
       Clear Error
    ========================= */

    const clearError = (field: AddUserField) => {
        setErrors((current) =>
            current[field]
                ? { ...current, [field]: undefined }
                : current
        );
    };

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

        setIsActive(true);
        setCurrentRoles([]);

        setLoadState(null);
        setErrors({});

        setClassName("Hifz Level 1");
        setClassId(null);
        setCurrentClass(null);
        setClassIds([]);
        setYear("");

        setParentId("");
        setSubject("");
        setSelectedChildren([]);

        setShowPassword(false);
        setChildrenDropdownOpen(false);
        setChildrenSearch("");
    };

    /* =========================
       Edit: Load User
    ========================= */

    useEffect(() => {

        if (!isOpen || editUserId === null) return;

        const controller = new AbortController();

        getUser(editUserId, controller.signal)
            .then((response) => {

                if (controller.signal.aborted) return;

                const user = response.data;

                const userRoles = (user.roles ?? []).map(({ id, name }) => ({
                    id,
                    name,
                }));

                const primaryRole = userRoles[0] ?? null;

                setName(user.name);
                setEmail(user.email);
                setPhone(user.phone_no ?? "");
                setPassword("");

                setIsActive(Boolean(user.is_active));
                setCurrentRoles(userRoles);

                setRoleId(primaryRole ? primaryRole.id : null);
                setRole(primaryRole ? toRoleKind(primaryRole.name) : null);

                // Student: preselect assigned class
                const assignedClassId =
                    user.class_id ?? user.class?.id ?? null;

                setClassId(assignedClassId);

                // Student: year (empty for students created before the field)
                setYear(typeof user.year === "number" ? String(user.year) : "");

                setCurrentClass(
                    user.class && typeof user.class.id === "number"
                        ? {
                            id: user.class.id,
                            name: user.class.name,
                        }
                        : null
                );

                // Teacher: preselect all assigned academic classes
                setClassIds(
                    Array.isArray(user.class_ids)
                        ? user.class_ids.map(Number)
                        : []
                );

                setErrors({});

                setLoadState({
                    id: editUserId,
                    token: loadToken,
                    error: null,
                });

            })
            .catch((error: unknown) => {

                if (controller.signal.aborted) return;

                const { message } = parseApiError(error);

                setLoadState({
                    id: editUserId,
                    token: loadToken,
                    error: message,
                });

            });

        return () => controller.abort();

    }, [isOpen, editUserId, loadToken]);

    /* =========================
       Outside Click
    ========================= */

    useEffect(() => {

        const handleOutsideClick = (event: MouseEvent) => {

            if (
                childrenDropdownRef.current &&
                !childrenDropdownRef.current.contains(event.target as Node)
            ) {
                setChildrenDropdownOpen(false);
            }

        };

        document.addEventListener("mousedown", handleOutsideClick);

        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
        };

    }, []);

    /* =========================
       Filter Students
    ========================= */

    const filteredChildren = childrenList.filter((student) => {

        const search = childrenSearch.toLowerCase().trim();

        if (!search) return true;

        return (
            student.name.toLowerCase().includes(search) ||
            student.email.toLowerCase().includes(search)
        );

    });

    /* =========================
       Selected Students
    ========================= */

    const selectedChildObjects = childrenList.filter((student) =>
        selectedChildren.includes(String(student.id))
    );

    /* =========================
       Toggle Student
    ========================= */

    const toggleChild = (studentId: string) => {

        setSelectedChildren((current) => {

            if (current.includes(studentId)) {
                return current.filter((id) => id !== studentId);
            }

            return [...current, studentId];

        });

    };

    /* =========================
       Remove Student
    ========================= */

    const removeChild = (studentId: string) => {

        setSelectedChildren((current) =>
            current.filter((id) => id !== studentId)
        );

    };

    /* =========================
       Role Change
    ========================= */

    const handleRoleChange = (newRole: UserRole | null) => {

        // Clear Student class and year when changing to another role
        if (newRole !== "student") {
            setClassId(null);
            clearError("class_id");

            setYear("");
            clearError("year");
        } else if (!isEditMode && !year) {
            // New student: default to the current year
            setYear(String(currentYear()));
        }

        // Clear Teacher classes when changing to another role
        if (newRole !== "teacher") {
            setClassIds([]);
            clearError("class_ids");
        }

        setRole(newRole);

        setClassName("Hifz Level 1");
        setParentId("");
        setSubject("");
        setSelectedChildren([]);

        setChildrenDropdownOpen(false);
        setChildrenSearch("");

    };

    /* =========================
       Toggle Teacher Class
    ========================= */

    const toggleTeacherClass = (classId: number) => {

        setClassIds((current) =>
            current.includes(classId)
                ? current.filter((id) => id !== classId)
                : [...current, classId]
        );

        clearError("class_ids");

    };

    /* =========================
       Role Select
    ========================= */

    const handleRoleSelect = (value: string) => {

        const selected =
            roleChoices.find((option) => String(option.id) === value) ?? null;

        setRoleId(selected ? selected.id : null);

        handleRoleChange(
            selected ? toRoleKind(selected.name) : null
        );

        clearError("roles");

    };

    /* =========================
       Validation
    ========================= */

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

        // Required when adding; optional when editing
        if (!password) {
            if (!isEditMode) {
                result.password = "The password field is required.";
            }
        } else if (password.length < MIN_PASSWORD_LENGTH) {
            result.password = `The password must be at least ${MIN_PASSWORD_LENGTH} characters.`;
        }

        if (phone.trim().length > MAX_PHONE_LENGTH) {
            result.phone_no = `The phone number must not be greater than ${MAX_PHONE_LENGTH} characters.`;
        }

        if (roleId === null) {
            result.roles = "Please select a role.";
        }

        // Student must have exactly one selected class
        if (isStudent && classId === null) {
            result.class_id = "Please select a class.";
        }

        // Student year: required, 4-digit, 2000 to next year (backend wording)
        if (isStudent) {
            const trimmedYear = year.trim();
            const yearNumber = Number(trimmedYear);

            if (!trimmedYear) {
                result.year = "The year field is required for students.";
            } else if (!/^\d{4}$/.test(trimmedYear)) {
                result.year = "The year must be a 4-digit year.";
            } else if (yearNumber < MIN_STUDENT_YEAR) {
                result.year = `The year must be ${MIN_STUDENT_YEAR} or later.`;
            } else if (yearNumber > maxStudentYear) {
                result.year = "The year cannot be later than next year.";
            }
        }

        // Teacher must have at least one selected class
        if (isTeacher && classIds.length === 0) {
            result.class_ids = "Please select at least one class.";
        }

        return result;

    };

    /* =========================
       Submit
    ========================= */

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {

        event.preventDefault();

        if (isSubmittingRef.current || isLoadingUser || loadError) return;

        // Wait for academic classes to load successfully
        if (
            (isStudent || isTeacher) &&
            (studentClasses.isLoading || studentClasses.error)
        ) {
            return;
        }

        const clientErrors = validate();

        if (Object.keys(clientErrors).length > 0 || roleId === null) {
            setErrors(clientErrors);
            return;
        }

        isSubmittingRef.current = true;
        setIsSubmitting(true);
        setErrors({});

        try {

            if (editUserId !== null) {

                const updatePayload: UpdateUserRequest = {
                    name: name.trim(),
                    email: email.trim(),
                    phone_no: phone.trim() || null,
                    is_active: isActive,
                    roles: [roleId],

                    // Student: one class ID
                    ...(isStudent && classId !== null
                        ? { class_id: classId }
                        : {}),

                    // Student: year (never sent for other roles)
                    ...(isStudent
                        ? { year: Number(year.trim()) }
                        : {}),

                    // Teacher: multiple class IDs
                    ...(isTeacher
                        ? { class_ids: classIds }
                        : {}),
                };

                // Only send password when a new one was entered
                if (password) {
                    updatePayload.password = password;
                }

                const updated = await updateUser(
                    editUserId,
                    updatePayload
                );

                toast.success(
                    updated.message || "User updated successfully."
                );

                resetForm();
                onClose();

                onUserUpdated?.(updated.data);

                return;

            }

            const response = await createUser({
                name: name.trim(),
                email: email.trim(),
                password,
                phone_no: phone.trim() || null,
                roles: [roleId],

                // Student: one class ID
                ...(isStudent && classId !== null
                    ? { class_id: classId }
                    : {}),

                // Student: year (never sent for other roles)
                ...(isStudent
                    ? { year: Number(year.trim()) }
                    : {}),

                // Teacher: multiple class IDs
                ...(isTeacher
                    ? { class_ids: classIds }
                    : {}),
            });

            toast.success(
                response.message || "User created successfully."
            );

            resetForm();
            onClose();

            onUserCreated?.(response.data);

        } catch (error) {

            const { status, message, validationErrors } =
                parseApiError(error);

            if (status === 401) return;

            if (status === 422 && validationErrors) {

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

    /* =========================
       Render
    ========================= */

    return (

        <div className="app-popup-wrapper">

            <div className="app-popup-box">

                {/* =========================
                    Header
                ========================= */}

                <div className="app-popup-header">

                    <h2 className="app-popup-title">
                        {isEditMode ? "Edit User" : "Add User"}
                    </h2>

                    <button
                        type="button"
                        className="app-popup-close"
                        onClick={handleClose}
                        aria-label="Close"
                        disabled={isSubmitting}
                    >
                        <X size={19} strokeWidth={2} />
                    </button>

                </div>

                {/* =========================
                    Form: Loading / Error / Content
                ========================= */}

                {isLoadingUser ? (

                    <div className="add-user-status" role="status">
                        <span className="spinner-border" aria-hidden="true"></span>
                        <span>Loading user details...</span>
                    </div>

                ) : loadError ? (

                    <div className="add-user-status">

                        <p className="m-0">{loadError}</p>

                        <div className="app-popup-actions">

                            <button
                                type="button"
                                className="app-popup-btn cancel"
                                onClick={handleClose}
                            >
                                Close
                            </button>

                            <button
                                type="button"
                                className="app-popup-btn submit"
                                onClick={() => setLoadToken((token) => token + 1)}
                            >
                                Try Again
                            </button>

                        </div>

                    </div>

                ) : (

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
                                            setName(event.target.value);
                                            clearError("name");
                                        }}
                                        autoComplete="name"
                                        aria-invalid={Boolean(errors.name)}
                                        required
                                    />

                                    {errors.name && (
                                        <span className="error-text">
                                            {errors.name}
                                        </span>
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
                                            setEmail(event.target.value);
                                            clearError("email");
                                        }}
                                        autoComplete="off"
                                        aria-invalid={Boolean(errors.email)}
                                        required
                                    />

                                    {errors.email && (
                                        <span className="error-text">
                                            {errors.email}
                                        </span>
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
                                            type={showPassword ? "text" : "password"}
                                            placeholder={
                                                isEditMode
                                                    ? "Leave blank to keep current"
                                                    : "Set password"
                                            }
                                            value={password}
                                            onChange={(event) => {
                                                setPassword(event.target.value);
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
                                                setShowPassword((current) => !current)
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
                                        <span className="error-text">
                                            {errors.password}
                                        </span>
                                    )}

                                </div>

                            </div>

                            {/* =========================
                                Phone Number
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
                                                setPhone(event.target.value);
                                                clearError("phone_no");
                                            }}
                                            autoComplete="tel"
                                            aria-invalid={Boolean(errors.phone_no)}
                                        />

                                        <Phone size={15} />

                                    </div>

                                    {errors.phone_no && (
                                        <span className="error-text">
                                            {errors.phone_no}
                                        </span>
                                    )}

                                </div>

                            </div>

                            {/* =========================
                                Status (Edit only)
                            ========================= */}

                            {isEditMode && (

                                <div className="col-12">

                                    <div className="app-popup-field">

                                        <label htmlFor="user-status">
                                            Status
                                        </label>

                                        <div className="add-user-select-wrapper">

                                            <select
                                                id="user-status"
                                                value={isActive ? "active" : "inactive"}
                                                onChange={(event) => {
                                                    setIsActive(event.target.value === "active");
                                                    clearError("is_active");
                                                }}
                                                aria-invalid={Boolean(errors.is_active)}
                                            >
                                                <option value="active">
                                                    Active
                                                </option>

                                                <option value="inactive">
                                                    Inactive
                                                </option>
                                            </select>

                                            <ChevronDown
                                                className="add-user-select-icon"
                                                size={17}
                                            />

                                        </div>

                                        {errors.is_active && (
                                            <span className="error-text">
                                                {errors.is_active}
                                            </span>
                                        )}

                                    </div>

                                </div>

                            )}

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
                                            value={roleId === null ? "" : String(roleId)}
                                            onChange={(event) =>
                                                handleRoleSelect(event.target.value)
                                            }
                                            aria-invalid={Boolean(errors.roles)}
                                        >

                                            <option value="">
                                                {roleChoices.length > 0
                                                    ? "Select role"
                                                    : "No roles available"}
                                            </option>

                                            {roleChoices.map((option) => (
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
                                        <span className="error-text">
                                            {errors.roles}
                                        </span>
                                    )}

                                </div>

                            </div>

                            {/* =========================
                                Student Class
                            ========================= */}

                            {isStudent && (

                                <div className="col-12">

                                    <div className="app-popup-field">

                                        <label htmlFor="user-student-class">
                                            Class
                                        </label>

                                        <div className="add-user-select-wrapper">

                                            <select
                                                id="user-student-class"
                                                value={classId === null ? "" : String(classId)}
                                                onChange={(event) => {
                                                    const value = event.target.value;

                                                    setClassId(
                                                        value ? Number(value) : null
                                                    );

                                                    clearError("class_id");
                                                }}
                                                disabled={
                                                    studentClasses.isLoading ||
                                                    isSubmitting
                                                }
                                                aria-invalid={Boolean(errors.class_id)}
                                                required
                                            >

                                                <option value="">
                                                    {studentClasses.isLoading
                                                        ? "Loading classes..."
                                                        : classChoices.length > 0
                                                            ? "Select class"
                                                            : "No classes available"}
                                                </option>

                                                {classChoices.map((option) => (
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

                                        {errors.class_id && (
                                            <span className="error-text">
                                                {errors.class_id}
                                            </span>
                                        )}

                                        {studentClasses.error && (
                                            <span className="error-text">

                                                {studentClasses.error}{" "}

                                                <button
                                                    type="button"
                                                    className="btn btn-link p-0 align-baseline"
                                                    onClick={studentClasses.retry}
                                                >
                                                    Try again
                                                </button>

                                            </span>
                                        )}

                                    </div>

                                </div>

                            )}

                            {/* =========================
                                Student Year
                            ========================= */}

                            {isStudent && (

                                <div className="col-12">

                                    <div className="app-popup-field">

                                        <label htmlFor="user-student-year">
                                            Year
                                        </label>

                                        <input
                                            id="user-student-year"
                                            type="number"
                                            inputMode="numeric"
                                            placeholder={`e.g. ${currentYear()}`}
                                            min={MIN_STUDENT_YEAR}
                                            max={maxStudentYear}
                                            step={1}
                                            value={year}
                                            onChange={(event) => {
                                                // Digits only, at most 4
                                                setYear(event.target.value.replace(/\D/g, "").slice(0, 4));
                                                clearError("year");
                                            }}
                                            disabled={isSubmitting}
                                            aria-invalid={Boolean(errors.year)}
                                            required
                                        />

                                        {errors.year && (
                                            <span className="error-text">
                                                {errors.year}
                                            </span>
                                        )}

                                    </div>

                                </div>

                            )}

                            {/* =========================
                                Teacher Classes
                            ========================= */}

                            {isTeacher && (

                                <div className="col-12">

                                    <div className="app-popup-field">

                                        <label>
                                            Assign Classes
                                        </label>

                                        <div className="add-user-children">

                                            <div
                                                className="add-user-children-dropdown"
                                                style={{ position: "static" }}
                                            >

                                                <div className="add-user-children-list">

                                                    {studentClasses.isLoading ? (

                                                        <div className="add-user-no-children">
                                                            Loading classes...
                                                        </div>

                                                    ) : studentClasses.classes.length > 0 ? (

                                                        studentClasses.classes.map((option) => {

                                                            const isSelected =
                                                                classIds.includes(option.id);

                                                            return (

                                                                <button
                                                                    type="button"
                                                                    key={option.id}
                                                                    className={`add-user-child-option ${
                                                                        isSelected ? "selected" : ""
                                                                    }`}
                                                                    onClick={() =>
                                                                        toggleTeacherClass(option.id)
                                                                    }
                                                                    disabled={isSubmitting}
                                                                >

                                                                    <div className="add-user-child-info">

                                                                        <span className="add-user-child-name">
                                                                            {option.name}
                                                                        </span>

                                                                    </div>

                                                                    <span
                                                                        className={`add-user-child-check ${
                                                                            isSelected ? "checked" : ""
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

                                                        })

                                                    ) : (

                                                        <div className="add-user-no-children">
                                                            No classes available.
                                                        </div>

                                                    )}

                                                </div>

                                                <div className="add-user-children-footer">

                                                    <span>
                                                        {classIds.length} selected
                                                    </span>

                                                    {classIds.length > 0 && (

                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                setClassIds([]);
                                                                clearError("class_ids");
                                                            }}
                                                            disabled={isSubmitting}
                                                        >
                                                            Clear
                                                        </button>

                                                    )}

                                                </div>

                                            </div>

                                        </div>

                                        {errors.class_ids && (
                                            <span className="error-text">
                                                {errors.class_ids}
                                            </span>
                                        )}

                                        {studentClasses.error && (

                                            <span className="error-text">

                                                {studentClasses.error}{" "}

                                                <button
                                                    type="button"
                                                    className="btn btn-link p-0 align-baseline"
                                                    onClick={studentClasses.retry}
                                                >
                                                    Try again
                                                </button>

                                            </span>

                                        )}

                                    </div>

                                </div>

                            )}

                            {/* =========================
                                Legacy Student Section
                            ========================= */}

                            {sectionRole === "student" && (

                                <>

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
                                                        setClassName(event.target.value)
                                                    }
                                                >
                                                    <option>Hifz Level 1</option>
                                                    <option>Hifz Level 2</option>
                                                    <option>Hifz Level 3</option>
                                                    <option>Arabic Foundations</option>
                                                    <option>Tajweed Intermediate</option>
                                                </select>

                                                <ChevronDown
                                                    className="add-user-select-icon"
                                                    size={17}
                                                />

                                            </div>

                                        </div>

                                    </div>

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
                                                    setParentId(event.target.value)
                                                }
                                            />

                                        </div>

                                    </div>

                                </>

                            )}

                            {/* =========================
                                Legacy Teacher Section
                            ========================= */}

                            {sectionRole === "teacher" && (

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
                                                setSubject(event.target.value)
                                            }
                                            required
                                        />

                                    </div>

                                </div>

                            )}

                            {/* =========================
                                Legacy Parent Section
                            ========================= */}

                            {sectionRole === "parent" && (

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
                                                    childrenDropdownOpen ? "open" : ""
                                                }`}
                                                onClick={() =>
                                                    setChildrenDropdownOpen(
                                                        (current) => !current
                                                    )
                                                }
                                            >

                                                {selectedChildObjects.length > 0 ? (

                                                    <div className="add-user-selected-list">

                                                        {selectedChildObjects.map((student) => (

                                                            <span
                                                                className="add-user-child-chip"
                                                                key={student.id}
                                                            >

                                                                {student.name}

                                                                <button
                                                                    type="button"
                                                                    onClick={(event) => {
                                                                        event.stopPropagation();

                                                                        removeChild(
                                                                            String(student.id)
                                                                        );
                                                                    }}
                                                                    aria-label={`Remove ${student.name}`}
                                                                >
                                                                    <X size={12} />
                                                                </button>

                                                            </span>

                                                        ))}

                                                    </div>

                                                ) : (

                                                    <span className="add-user-children-placeholder">
                                                        Select children
                                                    </span>

                                                )}

                                                <ChevronDown
                                                    className={`add-user-children-arrow ${
                                                        childrenDropdownOpen ? "rotate" : ""
                                                    }`}
                                                    size={17}
                                                />

                                            </div>

                                            {childrenDropdownOpen && (

                                                <div className="add-user-children-dropdown">

                                                    {/* Search */}

                                                    <div className="add-user-children-search">

                                                        <Search size={16} />

                                                        <input
                                                            type="text"
                                                            placeholder="Search students..."
                                                            value={childrenSearch}
                                                            onChange={(event) =>
                                                                setChildrenSearch(event.target.value)
                                                            }
                                                            onClick={(event) =>
                                                                event.stopPropagation()
                                                            }
                                                        />

                                                    </div>

                                                    {/* List */}

                                                    <div className="add-user-children-list">

                                                        {filteredChildren.length > 0 ? (

                                                            filteredChildren.map((student) => {

                                                                const studentId =
                                                                    String(student.id);

                                                                const isSelected =
                                                                    selectedChildren.includes(studentId);

                                                                return (

                                                                    <button
                                                                        type="button"
                                                                        className={`add-user-child-option ${
                                                                            isSelected ? "selected" : ""
                                                                        }`}
                                                                        key={student.id}
                                                                        onClick={() =>
                                                                            toggleChild(studentId)
                                                                        }
                                                                    >

                                                                        <div className="add-user-child-info">

                                                                            <span className="add-user-child-name">
                                                                                {student.name}
                                                                            </span>

                                                                            <span className="add-user-child-meta">
                                                                                {student.email}
                                                                            </span>

                                                                        </div>

                                                                        <span
                                                                            className={`add-user-child-check ${
                                                                                isSelected ? "checked" : ""
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

                                                            })

                                                        ) : (

                                                            <div className="add-user-no-children">
                                                                No students found.
                                                            </div>

                                                        )}

                                                    </div>

                                                    {/* Footer */}

                                                    <div className="add-user-children-footer">

                                                        <span>
                                                            {selectedChildren.length} selected
                                                        </span>

                                                        {selectedChildren.length > 0 && (

                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    setSelectedChildren([])
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
                                        disabled={
                                            isSubmitting ||
                                            ((isStudent || isTeacher) &&
                                                studentClasses.isLoading)
                                        }
                                        aria-busy={isSubmitting}
                                    >
                                        {isEditMode
                                            ? (isSubmitting ? "Saving..." : "Save Changes")
                                            : (isSubmitting ? "Adding..." : "Add User")}
                                    </button>

                                </div>

                            </div>

                        </div>

                    </form>

                )}

            </div>

        </div>

    );

};

export default AddUserPopup;