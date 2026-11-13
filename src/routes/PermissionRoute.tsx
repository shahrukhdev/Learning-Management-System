import { useEffect } from "react";
import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";

import { usePermissions } from "../hooks/usePermissions";
import { useAuth } from "../hooks/useAuth";
import { getHomePath, LOGIN_PATH } from "./paths";
import { getToken } from "../utils/tokenStorage";

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

    const { user } = useAuth();

    const location = useLocation();

    const { permissions: userPermissions, hasAnyPermission, isSyncingUser } = usePermissions();

    // Not signed in (e.g. during logout): this is not a permission problem,
    // so go to the login page without the "no permission" message
    if (!getToken() || user === null) {
        return <Navigate to={LOGIN_PATH} replace />;
    }

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

    const homePath = getHomePath(userPermissions);

    // The home page is this page (the user may open no page at all): show the
    // message here instead of redirecting to itself
    if (homePath === location.pathname) {
        return (
            <div className="d-flex justify-content-center align-items-center py-5" role="alert">
                {NO_ACCESS_MESSAGE}
            </div>
        );
    }

    return <AccessDeniedRedirect to={homePath} />;
};

export default PermissionRoute;
