import type { ReactNode } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

import { getToken } from "../utils/tokenStorage";
import { useAuth } from "../hooks/useAuth";
import { LOGIN_PATH } from "./paths";

interface ProtectedRouteProps {
    children?: ReactNode;
}

// Only lets authenticated users (token present) through. Works as a layout
// route (renders <Outlet />) or as a wrapper around children.
const ProtectedRoute = ({ children }: ProtectedRouteProps) => {

    const location = useLocation();

    // Subscribing to the auth user makes this guard re-render as soon as the
    // user is cleared (logout / expired session), so a signed-out user goes
    // to /login before any page-level permission check can run
    const { user } = useAuth();

    if (!getToken() || user === null) {
        // Keep the requested destination for future "redirect back" behavior
        return <Navigate to={LOGIN_PATH} replace state={{ from: location }} />;
    }

    return children ?? <Outlet />;
};

export default ProtectedRoute;
