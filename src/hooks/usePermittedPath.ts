import { usePermissions } from "./usePermissions";
import { getHomePath } from "../routes/paths";

// `path` if the user has `permission`, otherwise their home page. Used for
// "back to list" navigation from pages a user may open without being allowed
// to see the list (e.g. Create Role without View Roles).
export const usePermittedPath = (path: string, permission: string): string => {

    const { permissions, hasPermission } = usePermissions();

    return hasPermission(permission) ? path : getHomePath(permissions);
};
