import type { ReactNode } from "react";

import { useAuth } from "../hooks/useAuth";
import { getDashboardRole } from "../utils/roles";

interface RoleBasedRouteProps {
    admin: ReactNode;
    teacher?: ReactNode;
    student?: ReactNode;
}

// Renders the role-specific page for one shared, prefix-free URL
// (e.g. /dashboard). Super Admin and Admin get the admin page; Teacher gets
// the teacher page; Student gets the student page where one is given.
// Roles without their own UI yet fall back to the admin page, which matches
// the previous default behavior.
const RoleBasedRoute = ({ admin, teacher, student }: RoleBasedRouteProps) => {

    const { user } = useAuth();

    const role = getDashboardRole(user?.role);

    if (role === "teacher" && teacher) {
        return <>{teacher}</>;
    }

    if (role === "student" && student) {
        return <>{student}</>;
    }

    return <>{admin}</>;
};

export default RoleBasedRoute;
