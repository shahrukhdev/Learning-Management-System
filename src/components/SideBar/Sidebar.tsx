
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


import { LogOut, ChevronDown, X } from "lucide-react";
import { useEffect, useState } from "react";

// --------------------------------------------------
// Main Navigation Items
// --------------------------------------------------

const navItems = [
    {
        title: "Dashboard",
        path: "/admin/dashboard",
        icon: NavIcon1,
        end: true,
    },
    {
        title: "Attendance",
        path: "/admin/dashboard/attendance",
        icon: NavIcon2,
    },
    {
        title: "Hifz",
        path: "/admin/dashboard/hifz",
        icon: NavIcon3,
    },
    {
        title: "Notices",
        path: "/admin/dashboard/notices",
        icon: NavIcon4,
    },
    {
        title: "Students Progress",
        path: "/admin/dashboard/students-progress",
        icon: NavIcon5,
    },
];

// --------------------------------------------------
// System Items
// --------------------------------------------------

const systemItems = [
    {
        title: "Users",
        path: "/admin/dashboard/system/users",
        icon: NavIcon5,
    },
    {
        title: "Roles",
        path: "/admin/dashboard/system/roles",
        icon: NavIcon6,
    },
    {
        title: "Permissions",
        path: "/admin/dashboard/system/permissions",
        icon: NavIcon8,
    },
];

// --------------------------------------------------
// Academic Items
// --------------------------------------------------

const academicItems = [
    {
        title: "Classes",
        path: "/admin/dashboard/academic/classes",
        icon: NavIcon10,
    },
    {
        title: "Courses",
        path: "/admin/dashboard/academic/courses",
        icon: NavIcon11,
    },
];

// --------------------------------------------------
// Sidebar Component
// --------------------------------------------------

type SidebarProps = {
    isOpen?: boolean;
    onClose?: () => void;
};

const Sidebar = ({ isOpen = false, onClose }: SidebarProps) => {

    const location = useLocation();

    // ----------------------------------------------
    // Active Routes
    // ----------------------------------------------

    const isAcademicActive = academicItems.some((item) =>
        location.pathname.startsWith(item.path)
    );

    const isSystemActive = systemItems.some((item) =>
        location.pathname.startsWith(item.path)
    );

    // ----------------------------------------------
    // Dropdown States
    // ----------------------------------------------

    const [isAcademicOpen, setIsAcademicOpen] =
        useState(isAcademicActive);

    const [isSystemOpen, setIsSystemOpen] =
        useState(isSystemActive);

    // ----------------------------------------------
    // Update Dropdowns On Route Change
    // ----------------------------------------------

    useEffect(() => {

        setIsAcademicOpen(isAcademicActive);
        setIsSystemOpen(isSystemActive);

    }, [location.pathname, isAcademicActive, isSystemActive]);

    // ----------------------------------------------
    // Navigation Link Class
    // ----------------------------------------------

    const navLinkClass = ({ isActive }: { isActive: boolean }) =>
        isActive ? "nav-link active" : "nav-link";

    // ----------------------------------------------
    // Render
    // ----------------------------------------------

    return (

        <aside
            className={`dashboard-sidebar ${isOpen ? "sidebar-open" : ""}`}
            onClick={(event) => {
                // Close the mobile drawer when any menu link is clicked
                if ((event.target as HTMLElement).closest("a")) {
                    onClose?.();
                }
            }}
        >

            {/* Close button (visible only on mobile / tablet drawer) */}
            <button
                type="button"
                className="sidebar-close-btn"
                onClick={onClose}
                aria-label="Close menu"
            >
                <X size={20} strokeWidth={2.2} />
            </button>


            {/* Sidebar Logo */}

            <div className="sidebar-logo text-center">

                <Link to="/admin/dashboard">

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

                {navItems.map((item) => (

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


                {/* =================================
                    Academics Dropdown
                ================================= */}

                <div className="system-dropdown">

                    <button
                        type="button"
                        className={`nav-link system-toggle ${
                            isAcademicActive ? "active" : ""
                        }`}
                        onClick={() => {
                            setIsAcademicOpen((prev) => !prev);
                        }}
                        aria-expanded={isAcademicOpen}
                    >

                        <img
                            className="img-fluid nav-icon"
                            src={NavIcon9}
                            alt=""
                        />

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

                    </button>


                    {/* Academic Submenu */}

                    <div
                        className={`system-submenu ${
                            isAcademicOpen ? "open" : ""
                        }`}
                    >
                        <div className="system-submenu-inner">

                            {academicItems.map((item) => (

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
                                        alt=""
                                    />

                                    <span>{item.title}</span>

                                </NavLink>

                            ))}

                        </div>
                    </div>

                </div>


                {/* =================================
                    System Dropdown
                ================================= */}

                <div className="system-dropdown">

                    <button
                        type="button"
                        className={`nav-link system-toggle ${
                            isSystemActive ? "active" : ""
                        }`}
                        onClick={() => {
                            setIsSystemOpen((prev) => !prev);
                        }}
                        aria-expanded={isSystemOpen}
                    >

                        <img
                            className="img-fluid nav-icon"
                            src={NavIcon7}
                            alt=""
                        />

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

                    </button>


                    {/* System Submenu */}

                    <div
                        className={`system-submenu ${
                            isSystemOpen ? "open" : ""
                        }`}
                    >
                        <div className="system-submenu-inner">

                            {systemItems.map((item) => (

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
                                        alt=""
                                    />

                                    <span>{item.title}</span>

                                </NavLink>

                            ))}

                        </div>
                    </div>

                </div>

            </nav>


            {/* Sidebar Bottom */}

            <div className="sidebar-bottom">

                <div className="sidebar-user-info">

                    <div className="user-avatar">
                        AM
                    </div>

                    <div className="sidebar-user-details">

                        <h6 className="sidebar-user-name m-0">
                            Admin Madrassah
                        </h6>

                        <span className="sidebar-user-role">
                            Admin
                        </span>

                    </div>

                </div>


                {/* Logout */}

                <button
                    type="button"
                    className="secondary-btn sidebar-logout"
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
