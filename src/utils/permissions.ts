// Permission names exactly as the API returns them (login / profile
// `permissions`). Used by the Sidebar, route guards and page actions.
export const PERMISSIONS = {
    VIEW_DASHBOARD: "View Dashboard",

    VIEW_NOTICES: "View Notices",
    CREATE_NOTICE: "Create Notice",
    EDIT_NOTICE: "Edit Notice",
    DELETE_NOTICE: "Delete Notice",

    VIEW_CLASSES: "View Classes",
    CREATE_CLASS: "Create Class",
    EDIT_CLASS: "Edit Class",
    DELETE_CLASS: "Delete Class",

    VIEW_COURSES: "View Courses",
    CREATE_COURSE: "Create Course",
    EDIT_COURSE: "Edit Course",
    DELETE_COURSE: "Delete Course",

    VIEW_USERS: "View Users",
    CREATE_USER: "Create User",
    EDIT_USER: "Edit User",
    DELETE_USER: "Delete User",

    VIEW_ROLES: "View Roles",
    CREATE_ROLE: "Create Role",
    EDIT_ROLE: "Edit Role",
    DELETE_ROLE: "Delete Role",

    VIEW_PERMISSIONS: "View Permissions",
    CREATE_PERMISSION: "Create Permission",
    EDIT_PERMISSION: "Edit Permission",
    DELETE_PERMISSION: "Delete Permission",
} as const;

export type PermissionName = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

// Exact, case-sensitive match on the user's permission names
export const hasPermission = (userPermissions: readonly string[], permission: string): boolean =>
    userPermissions.includes(permission);

export const hasAnyPermission = (userPermissions: readonly string[], permissions: readonly string[]): boolean =>
    permissions.some((permission) => userPermissions.includes(permission));

export const hasAllPermissions = (userPermissions: readonly string[], permissions: readonly string[]): boolean =>
    permissions.every((permission) => userPermissions.includes(permission));
