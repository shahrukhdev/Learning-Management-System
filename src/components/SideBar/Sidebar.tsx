import "./Sidebar.css";
import { Link, NavLink, useLocation } from "react-router-dom";

import Logo from "../../assets/images/logo.svg";
import NavIcon1 from "../../assets/images/nav-icon-1.svg";
import NavIcon2 from "../../assets/images/nav-icon-2.svg";
import NavIcon3 from "../../assets/images/nav-icon-3.svg";
import NavIcon4 from "../../assets/images/nav-icon-4.svg";
import NavIcon5 from "../../assets/images/nav-icon-5.svg";
import NavIcon6 from "../../assets/images/nav-icon-6.svg";
import NavIcon7 from "../../assets/images/nav-icon-7.svg";
import NavIcon8 from "../../assets/images/nav-icon-8.svg";
import NavIcon9 from "../../assets/images/nav-icon-9.svg";
import NavIcon10 from "../../assets/images/nav-icon-10.svg";
import NavIcon11 from "../../assets/images/nav-icon-11.svg";

import { LogOut, ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";

import { useLogout } from "../../hooks/useLogout";
import { useAuth } from "../../hooks/useAuth";
import { usePermissions } from "../../hooks/usePermissions";
import { PERMISSIONS } from "../../utils/permissions";
import { getHomePath } from "../../routes/paths";
import { resolveImageUrl } from "../../utils/imageUrl";
import AvatarContent from "../Avatar/AvatarContent";

interface NavItem {
    title: string;
    path: string;
    icon: string;
    end?: boolean;
    // Shown only with this permission (items without one are always shown)
    permission?: string;
}

const navItems: NavItem[] = [
    {
        title: "Dashboard",
        path: "/dashboard",
        icon: NavIcon1,
        end: true,
        permission: PERMISSIONS.VIEW_DASHBOARD,
    },
    {
        title: "Attendance",
        path: "/attendance",
        icon: NavIcon2,
    },
    {
        title: "Hifz",
        path: "/hifz",
        icon: NavIcon3,
    },
    {
        title: "Notices",
        path: "/notices",
        icon: NavIcon4,
        permission: PERMISSIONS.VIEW_NOTICES,
    },
    {
        title: "Students Progress",
        path: "/students-progress",
        icon: NavIcon5,
    },
];

const systemItems: NavItem[] = [
    {
        title: "Users",
        path: "/system/users",
        icon: NavIcon5,
    },
    {
        title: "Roles",
        path: "/system/roles",
        icon: NavIcon6,
        permission: PERMISSIONS.VIEW_ROLES,
    },
    {
        title: "Permissions",
        path: "/system/permissions",
        icon: NavIcon8,
        permission: PERMISSIONS.VIEW_PERMISSIONS,
    },
];

const academicItems = [
    {
        title: "Classes",
        path: "/academic/classes",
        icon: NavIcon10,
    },
    {
        title: "Courses",
        path: "/academic/courses",
        icon: NavIcon11,
    },
];

const Sidebar = () => {

    const location = useLocation();

    const { signOut, isLoggingOut } = useLogout();

    const { user } = useAuth();

    const { permissions, hasPermission } = usePermissions();

    const isAllowed = (item: NavItem) => !item.permission || hasPermission(item.permission);

    const visibleNavItems = navItems.filter(isAllowed);

    const visibleSystemItems = systemItems.filter(isAllowed);

    const isAcademicActive = academicItems.some((item) =>
        location.pathname.startsWith(item.path)
    );

    const isSystemActive = systemItems.some((item) =>
        location.pathname.startsWith(item.path)
    );

    const [isAcademicOpen, setIsAcademicOpen] =
        useState(isAcademicActive);

    const [isSystemOpen, setIsSystemOpen] =
        useState(isSystemActive);

    // Open/close Academic when navigating into/out of its pages (adjusted
    // during render instead of in an effect)
    const [wasAcademicActive, setWasAcademicActive] =
        useState(isAcademicActive);

    if (wasAcademicActive !== isAcademicActive) {
        setWasAcademicActive(isAcademicActive);
        setIsAcademicOpen(isAcademicActive);
    }

    useEffect(() => {

        if (isSystemActive) {
            setIsSystemOpen(true);
        } else {
            setIsSystemOpen(false);
        }

    }, [isSystemActive]);

    const navLinkClass = ({ isActive }: { isActive: boolean }) =>
        isActive ? "nav-link active" : "nav-link";

    return (

        <aside className="dashboard-sidebar">

            {/* Sidebar Logo */}

            <div className="sidebar-logo text-center">

                {/* Home page: the dashboard, or Profile without "View Dashboard" */}
                <Link to={getHomePath(permissions)}>

                    <img
                        className="img-fluid"
                        src={Logo}
                        alt="logo"
                    />

                </Link>

            </div>


            {/* Sidebar Navigation */}

            <nav className="sidebar-nav">

                {/* Main Navigation */}

                {visibleNavItems.map((item) => (

                    <NavLink
                        key={item.path}
                        className={navLinkClass}
                        to={item.path}
                        end={item.end}
                    >

                        <img
                            className="img-fluid nav-icon"
                            src={item.icon}
                            alt={item.title}
                        />

                        {item.title}

                    </NavLink>

                ))}


                {/* Academic Dropdown */}

                <div className="system-dropdown">

                    <NavLink
                        to="/academic"
                        className={`nav-link system-toggle ${
                            isAcademicActive ? "active" : ""
                        }`}
                        onClick={(e) => {

                            e.preventDefault();

                            setIsAcademicOpen((prev) => !prev);

                        }}
                    >

                        <img 
                            className="img-fluid nav-icon" 
                            src={NavIcon9} 
                            alt="Academic" />

                            <span>
                                Academic
                            </span>

                            <ChevronDown
                                className={`system-chevron ${
                                    isAcademicOpen ? "open" : ""
                                }`}
                                size={18}
                                strokeWidth={2}
                            />

                    </NavLink>


                    {/* Academic Submenu */}

                    <div
                        className={`system-submenu ${
                            isAcademicOpen ? "open" : ""
                        }`}
                    >

                        {/* Single wrapper so the whole list collapses as one grid row */}
                        <div className="system-submenu-inner">

                        {academicItems.map((item) => {

                            return (

                                <NavLink
                                    key={item.path}
                                    to={item.path}
                                    className={({ isActive }) =>
                                        `system-submenu-link ${
                                            isActive ? "active" : ""
                                        }`
                                    }
                                >

                                    <img 
                                        className="img-fluid"
                                        src={item.icon} 
                                        alt={item.title}
                                    />

                                    <span>
                                        {item.title}
                                    </span>

                                </NavLink>

                            );

                        })}

                        </div>

                    </div>

                </div>


                {/* System Dropdown */}

                {visibleSystemItems.length > 0 && (
                    <div className="system-dropdown">

                        <NavLink
                            to="/system"
                            className={`nav-link system-toggle ${
                                isSystemActive ? "active" : ""
                            }`}
                            onClick={(e) => {

                                e.preventDefault();

                                setIsSystemOpen((prev) => !prev);

                            }}
                        >

                            <img 
                                className="img-fluid nav-icon" 
                                src={NavIcon7} 
                                alt="System" />

                                <span>
                                    System
                                </span>

                                <ChevronDown
                                    className={`system-chevron ${
                                        isSystemOpen ? "open" : ""
                                    }`}
                                    size={18}
                                    strokeWidth={2}
                                />

                        </NavLink>


                        {/* System Submenu */}

                        <div
                            className={`system-submenu ${
                                isSystemOpen ? "open" : ""
                            }`}
                        >

                            {/* Single wrapper so the whole list collapses as one grid row */}
                            <div className="system-submenu-inner">

                            {visibleSystemItems.map((item) => {

                                return (

                                    <NavLink
                                        key={item.path}
                                        to={item.path}
                                        className={({ isActive }) =>
                                            `system-submenu-link ${
                                                isActive ? "active" : ""
                                            }`
                                        }
                                    >

                                        <img 
                                            className="img-fluid"
                                            src={item.icon} 
                                            alt={item.title}
                                        />

                                        <span>
                                            {item.title}
                                        </span>

                                    </NavLink>

                                );

                            })}

                            </div>

                        </div>

                    </div>
                )}

            </nav>


            {/* Sidebar Bottom */}

            <div className="sidebar-bottom">

                <div className="sidebar-user-info">

                    <div className="user-avatar">
                        <AvatarContent
                            src={resolveImageUrl(user?.image)}
                            alt={user?.name ?? "User"}
                            fallback="AM"
                            className="user-avatar-img"
                        />
                    </div>

                    <div className="sidebar-user-details">

                        <h6 className="sidebar-user-name m-0">
                            {user?.name}
                        </h6>

                        <span className="sidebar-user-role">
                            {user?.role}
                        </span>

                    </div>

                </div>


                {/* Logout */}

                <button
                    type="button"
                    className="secondary-btn sidebar-logout"
                    onClick={signOut}
                    disabled={isLoggingOut}
                    aria-busy={isLoggingOut}
                >

                    <LogOut
                        color="#41441B"
                        size={20}
                        strokeWidth={2}
                    />

                    <span>
                        Sign out
                    </span>

                </button>

            </div>

        </aside>

    );
};

export default Sidebar;