import { useEffect } from "react";
import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { toast } from "react-toastify";

import { usePermissions } from "../hooks/usePermissions";
import { getHomePath } from "./paths";

interface PermissionRouteProps {
    // Allowed if the user has at least one of these permission names
    permissions: string[];
    children: ReactNode;
}

const NO_ACCESS_MESSAGE = "You do not have permission to access this page.";

// Sends the user to their home page (the dashboard, or Profile without
// "View Dashboard", so a denied dashboard never redirects to itself)
const AccessDeniedRedirect = ({ to }: { to: string }) => {
    useEffect(() => {
        toast.error(NO_ACCESS_MESSAGE, { toastId: "permission-denied" });
    }, []);

    return <Navigate to={to} replace />;
};

// Protects a page by permission, also when the URL is opened directly
const PermissionRoute = ({ permissions, children }: PermissionRouteProps) => {

    const { permissions: userPermissions, hasAnyPermission, isSyncingUser } = usePermissions();

    if (hasAnyPermission(permissions)) return <>{children}</>;

    // Stored permissions are being refreshed after a page load: wait
    if (isSyncingUser) {
        return (
            <div className="d-flex justify-content-center align-items-center gap-2 py-5" role="status">
                <span className="spinner-border spinner-border-sm" aria-hidden="true"></span>
                Loading...
            </div>
        );
    }

    return <AccessDeniedRedirect to={getHomePath(userPermissions)} />;
};

export default PermissionRoute;
