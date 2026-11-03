import type { ReactNode } from "react";
import { Navigate, Outlet } from "react-router-dom";

import { getToken } from "../utils/tokenStorage";
import { DEFAULT_DASHBOARD_PATH } from "./paths";

interface GuestRouteProps {
    children?: ReactNode;
}

// Only lets unauthenticated users through (e.g. Login). Signed-in users are
// sent to the dashboard instead.
const GuestRoute = ({ children }: GuestRouteProps) => {

    if (getToken()) {
        return <Navigate to={DEFAULT_DASHBOARD_PATH} replace />;
    }

    return children ?? <Outlet />;
};

export default GuestRoute;
