import { PERMISSIONS, hasPermission } from "../utils/permissions";

// Shared route destinations used by the route guards and auth redirects
export const LOGIN_PATH = "/login";

// Prefix-free dashboard; the role-specific dashboard is chosen by RoleBasedRoute
export const DEFAULT_DASHBOARD_PATH = "/dashboard";

// Available to every signed-in user (no permission needed)
export const FALLBACK_HOME_PATH = "/profile";

// Where a signed-in user lands (after login, from guest-only pages, the
// sidebar logo, or when a page is not allowed): the dashboard with
// "View Dashboard", otherwise a page they can always open
export const getHomePath = (permissions: readonly string[]): string =>
    hasPermission(permissions, PERMISSIONS.VIEW_DASHBOARD) ? DEFAULT_DASHBOARD_PATH : FALLBACK_HOME_PATH;
