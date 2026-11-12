import type { ReactNode } from "react";
import { Navigate, Outlet } from "react-router-dom";

import { getToken } from "../utils/tokenStorage";
import { getHomePath } from "./paths";
import { usePermissions } from "../hooks/usePermissions";
import { useAuth } from "../hooks/useAuth";

interface GuestRouteProps {
    children?: ReactNode;
}

// Only lets unauthenticated users through (e.g. Login). Signed-in users are
// sent to their home page instead (dashboard with "View Dashboard").
const GuestRoute = ({ children }: GuestRouteProps) => {

    const { permissions } = usePermissions();

    const { user } = useAuth();

    // Signed in = token and user (same rule as ProtectedRoute, so a leftover
    // token without a user can never bounce between /login and the app)
    if (getToken() && user !== null) {
        return <Navigate to={getHomePath(permissions)} replace />;
    }

    return children ?? <Outlet />;
};

export default GuestRoute;
