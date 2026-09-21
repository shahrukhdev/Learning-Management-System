import "./Sidebar.css";
import { Link, NavLink, useLocation } from "react-router-dom";

import Logo from "../../assets/images/logo.svg";
import NavIcon1 from "../../assets/images/nav-icon-1.svg";
import NavIcon2 from "../../assets/images/nav-icon-2.svg";
import NavIcon3 from "../../assets/images/nav-icon-3.svg";
import NavIcon4 from "../../assets/images/nav-icon-4.svg";
import NavIcon5 from "../../assets/images/nav-icon-5.svg";

import {
    LogOut,
    Settings,
    ChevronDown,
    Users,
    ShieldCheck,
    KeyRound,
} from "lucide-react";

import { useEffect, useState } from "react";

const navItems = [
    {
        title: "Dashboard",
        path: "/dashboard",
        icon: NavIcon1,
        end: true,
    },
    {
        title: "Attendance",
        path: "/dashboard/attendance",
        icon: NavIcon2,
    },
    {
        title: "Hifz",
        path: "/dashboard/hifz",
        icon: NavIcon3,
    },
    {
        title: "Notices",
        path: "/dashboard/notices",
        icon: NavIcon4,
    },
    {
        title: "Students",
        path: "/dashboard/students",
        icon: NavIcon5,
    },
];

const systemItems = [
    {
        title: "Users",
        path: "/dashboard/system/users",
        icon: Users,
    },
    {
        title: "Roles",
        path: "/dashboard/system/roles",
        icon: ShieldCheck,
    },
    {
        title: "Permissions",
        path: "/dashboard/system/permissions",
        icon: KeyRound,
    },
];

const Sidebar = () => {

    const location = useLocation();

    const isSystemActive = systemItems.some((item) =>
        location.pathname.startsWith(item.path)
    );

    const [isSystemOpen, setIsSystemOpen] =
        useState(isSystemActive);

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

                <Link to="/dashboard">

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

                {navItems.map((item, index) => (

                    <NavLink
                        key={index}
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


                {/* System Dropdown */}

                <div className="system-dropdown">

                    <NavLink
                        to="/dashboard/system"
                        className={`nav-link system-toggle ${
                            isSystemActive ? "active" : ""
                        }`}
                        onClick={(e) => {

                            e.preventDefault();

                            setIsSystemOpen((prev) => !prev);

                        }}
                    >

                        <Settings
                            className="system-main-icon"
                            size={20}
                            strokeWidth={2}
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

                    </NavLink>


                    {/* System Submenu */}

                    <div
                        className={`system-submenu ${
                            isSystemOpen ? "open" : ""
                        }`}
                    >

                        {systemItems.map((item) => {

                            const Icon = item.icon;

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

                                    <Icon
                                        size={18}
                                        strokeWidth={2}
                                    />

                                    <span>
                                        {item.title}
                                    </span>

                                </NavLink>

                            );

                        })}

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