import { PERMISSIONS, hasPermission } from "../utils/permissions";

// Shared route destinations used by the route guards and auth redirects
export const LOGIN_PATH = "/login";

// Prefix-free dashboard; the role-specific dashboard is chosen by RoleBasedRoute
export const DEFAULT_DASHBOARD_PATH = "/dashboard";

// Used when the user may open none of the pages below. Every page now has a
// permission rule, so PermissionRoute shows a "no permission" message here
// instead of redirecting again (no redirect loop).
export const FALLBACK_HOME_PATH = DEFAULT_DASHBOARD_PATH;

// Candidate home pages in order, each with the permission it needs
const HOME_CANDIDATES: [permission: string, path: string][] = [
    [PERMISSIONS.VIEW_DASHBOARD, DEFAULT_DASHBOARD_PATH],
    [PERMISSIONS.VIEW_PROFILE, "/profile"],
    [PERMISSIONS.VIEW_NOTICES, "/notices"],
    [PERMISSIONS.VIEW_HIFZ, "/hifz"],
    [PERMISSIONS.VIEW_ATTENDANCE, "/attendance"],
    [PERMISSIONS.VIEW_STUDENT_PROGRESS_LIST, "/students-progress"],
    [PERMISSIONS.VIEW_MY_PROGRESS, "/my-progress"],
    [PERMISSIONS.VIEW_CLASSES, "/academic/classes"],
    [PERMISSIONS.VIEW_COURSES, "/academic/courses"],
    [PERMISSIONS.VIEW_USERS, "/system/users"],
    [PERMISSIONS.VIEW_ROLES, "/system/roles"],
    [PERMISSIONS.VIEW_PERMISSIONS, "/system/permissions"],
];

// Where a signed-in user lands (after login, from guest-only pages, the
// sidebar logo, or when a page is not allowed): the dashboard with
// "View Dashboard", otherwise the first page they are allowed to open, so a
// redirect never points at a page that would redirect again
export const getHomePath = (permissions: readonly string[]): string =>
    HOME_CANDIDATES.find(([permission]) => hasPermission(permissions, permission))?.[1] ?? FALLBACK_HOME_PATH;
