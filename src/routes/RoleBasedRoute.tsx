import type { ReactNode } from "react";

import { useAuth } from "../hooks/useAuth";
import { getDashboardRole } from "../utils/roles";

interface RoleBasedRouteProps {
    admin: ReactNode;
    teacher?: ReactNode;
}

// Renders the role-specific page for one shared, prefix-free URL
// (e.g. /dashboard). Super Admin and Admin get the admin page; Teacher gets
// the teacher page. Roles without their own UI yet fall back to the admin
// page, which matches the previous default behavior.
const RoleBasedRoute = ({ admin, teacher }: RoleBasedRouteProps) => {

    const { user } = useAuth();

    if (getDashboardRole(user?.role) === "teacher" && teacher) {
        return <>{teacher}</>;
    }

    return <>{admin}</>;
};

export default RoleBasedRoute;
