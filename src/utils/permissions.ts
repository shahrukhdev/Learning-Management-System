// Permission names exactly as the API returns them (login / profile
// `permissions`). Only the Notices ones are enforced for now; the rest are
// listed so other modules can use them later.
export const PERMISSIONS = {
    VIEW_NOTICES: "View Notices",
    CREATE_NOTICE: "Create Notice",
    EDIT_NOTICE: "Edit Notice",
    DELETE_NOTICE: "Delete Notice",

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
