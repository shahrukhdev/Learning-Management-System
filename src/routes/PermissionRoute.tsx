import { useEffect } from "react";
import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { toast } from "react-toastify";

import { usePermissions } from "../hooks/usePermissions";
import { DEFAULT_DASHBOARD_PATH } from "./paths";

interface PermissionRouteProps {
    // Allowed if the user has at least one of these permission names
    permissions: string[];
    children: ReactNode;
}

const NO_ACCESS_MESSAGE = "You do not have permission to access this page.";

// Sends the user to the dashboard (same as the other route guards' redirects)
const AccessDeniedRedirect = () => {
    useEffect(() => {
        toast.error(NO_ACCESS_MESSAGE, { toastId: "permission-denied" });
    }, []);

    return <Navigate to={DEFAULT_DASHBOARD_PATH} replace />;
};

// Protects a page by permission, also when the URL is opened directly
const PermissionRoute = ({ permissions, children }: PermissionRouteProps) => {

    const { hasAnyPermission, isSyncingUser } = usePermissions();

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

    return <AccessDeniedRedirect />;
};

export default PermissionRoute;
