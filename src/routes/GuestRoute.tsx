import type { ReactNode } from "react";
import { Navigate, Outlet } from "react-router-dom";

import { getToken } from "../utils/tokenStorage";
import { getHomePath } from "./paths";
import { usePermissions } from "../hooks/usePermissions";

interface GuestRouteProps {
    children?: ReactNode;
}

// Only lets unauthenticated users through (e.g. Login). Signed-in users are
// sent to their home page instead (dashboard with "View Dashboard").
const GuestRoute = ({ children }: GuestRouteProps) => {

    const { permissions } = usePermissions();

    if (getToken()) {
        return <Navigate to={getHomePath(permissions)} replace />;
    }

    return children ?? <Outlet />;
};

export default GuestRoute;
