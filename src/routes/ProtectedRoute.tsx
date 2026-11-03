import type { ReactNode } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

import { getToken } from "../utils/tokenStorage";
import { LOGIN_PATH } from "./paths";

interface ProtectedRouteProps {
    children?: ReactNode;
}

// Only lets authenticated users (token present) through. Works as a layout
// route (renders <Outlet />) or as a wrapper around children.
const ProtectedRoute = ({ children }: ProtectedRouteProps) => {

    const location = useLocation();

    if (!getToken()) {
        // Keep the requested destination for future "redirect back" behavior
        return <Navigate to={LOGIN_PATH} replace state={{ from: location }} />;
    }

    return children ?? <Outlet />;
};

export default ProtectedRoute;
