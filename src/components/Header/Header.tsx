
import "./Header.css";

import { useEffect, useRef, useState } from "react";
import {
    // Bell, // notifications are commented out below
    // Search, // header search is commented out below
    User,
    LogOut,
    // Check, // notifications are commented out below
    Menu,
} from "lucide-react";
import { Link } from "react-router-dom";

import { useLogout } from "../../hooks/useLogout";
import { useAuth } from "../../hooks/useAuth";
import { resolveImageUrl } from "../../utils/imageUrl";
import AvatarContent from "../Avatar/AvatarContent";
import { usePermissions } from "../../hooks/usePermissions";
import { PERMISSIONS } from "../../utils/permissions";

type HeaderProps = {
    // Opens the mobile / tablet sidebar drawer
    onMenuClick?: () => void;
};

const Header = ({ onMenuClick }: HeaderProps) => {

    const { signOut, isLoggingOut } = useLogout();

    const { user } = useAuth();

    // Profile link only with "View Profile"
    const { hasPermission } = usePermissions();

    const canViewProfile = hasPermission(PERMISSIONS.VIEW_PROFILE);

    const avatarUrl = resolveImageUrl(user?.image);

    const [isProfileOpen, setIsProfileOpen] = useState(false);
    // Notifications are hidden for now
    // const [isNotificationOpen, setIsNotificationOpen] = useState(false);

    // Properly typed refs
    const profileRef = useRef<HTMLDivElement>(null);
    // const notificationRef = useRef<HTMLDivElement>(null);

    // Close dropdowns when clicking outside
    useEffect(() => {

        const handleClickOutside = (event: MouseEvent) => {

            const target = event.target as Node;

            if (
                profileRef.current &&
                !profileRef.current.contains(target)
            ) {
                setIsProfileOpen(false);
            }

            // Notifications are hidden for now
            // if (
            //     notificationRef.current &&
            //     !notificationRef.current.contains(target)
            // ) {
            //     setIsNotificationOpen(false);
            // }

        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener(
                "mousedown",
                handleClickOutside
            );
        };

    }, []);

    return (
        <header className="header">
            <div className="container-fluid">
                <div className="row">
                    <div className="col-12">

                        <div className="header-flex">

                            <div className="d-flex justify-content-start align-items-center gap-3">
                                <button
                                    type="button"
                                    className="header-menu-btn"
                                    onClick={onMenuClick}
                                    aria-label="Open menu"
                                >
                                    <Menu size={20} strokeWidth={2.2} />
                                </button>

                                <div className="head-user">
                                    <span className="head-user-greeting">Welcome back</span>
                                    <h2 className="m-0 head-user-name">{user?.name ?? ""}</h2>
                                </div>
                            </div>

                            {/* Search (hidden for now; uncomment to bring it back,
                                together with the `Search` icon import)
                            <div className="header-search">

                                <Search
                                    className="search-icon"
                                    size={18}
                                    strokeWidth={2.5}
                                    color="#93AEA3"
                                />

                                <input
                                    type="search"
                                    className="search-input"
                                    placeholder="Search"
                                />

                            </div>
                            */}

                            {/* Header Actions */}
                            <div className="header-actions">

                                {/* Notifications (hidden for now; to bring them back, uncomment
                                    this block, the `Bell` / `Check` imports, the notification
                                    state + ref, its click-outside check and the
                                    `setIsNotificationOpen(false)` in the profile button)

                                // Notification Menu
                                <div
                                    className="notification-menu"
                                    ref={notificationRef}
                                >

                                    <button
                                        type="button"
                                        className="header-notification"
                                        onClick={() => {
                                            setIsNotificationOpen(!isNotificationOpen);
                                            setIsProfileOpen(false);
                                        }}
                                        aria-label="Notifications"
                                        aria-expanded={isNotificationOpen}
                                    >
                                        <Bell
                                            size={18}
                                            strokeWidth={2}
                                        />

                                        <span className="notification-dot"></span>
                                    </button>

                                    {isNotificationOpen && (

                                        <div className="notification-dropdown">

                                            // Notification Header
                                            <div className="notification-dropdown-header">

                                                <div>
                                                    <h6>Notifications</h6>
                                                    <span>
                                                        You have 3 new notifications
                                                    </span>
                                                </div>

                                                <button
                                                    type="button"
                                                    className="mark-read-btn"
                                                >
                                                    <Check size={14} />
                                                    Mark all read
                                                </button>

                                            </div>

                                            <div className="notification-dropdown-divider"></div>

                                            // Notification List
                                            <div className="notification-list">

                                                // Notification 1
                                                <button
                                                    type="button"
                                                    className="notification-item unread"
                                                >

                                                    <span className="notification-item-icon">
                                                        <Bell size={16} />
                                                    </span>

                                                    <span className="notification-item-content">

                                                        <strong>
                                                            New notice posted
                                                        </strong>

                                                        <small>
                                                            Ramadan Schedule has been updated.
                                                        </small>

                                                        <time>
                                                            5 minutes ago
                                                        </time>

                                                    </span>

                                                    <span className="notification-unread-dot"></span>

                                                </button>

                                                // Notification 2
                                                <button
                                                    type="button"
                                                    className="notification-item unread"
                                                >

                                                    <span className="notification-item-icon">
                                                        <User size={16} />
                                                    </span>

                                                    <span className="notification-item-content">

                                                        <strong>
                                                            New student registered
                                                        </strong>

                                                        <small>
                                                            Ahmed Al-Hassan joined the madrassah.
                                                        </small>

                                                        <time>
                                                            1 hour ago
                                                        </time>

                                                    </span>

                                                    <span className="notification-unread-dot"></span>

                                                </button>

                                                // Notification 3
                                                <button
                                                    type="button"
                                                    className="notification-item"
                                                >

                                                    <span className="notification-item-icon">
                                                        <Check size={16} />
                                                    </span>

                                                    <span className="notification-item-content">

                                                        <strong>
                                                            Attendance completed
                                                        </strong>

                                                        <small>
                                                            Today's attendance has been completed.
                                                        </small>

                                                        <time>
                                                            3 hours ago
                                                        </time>

                                                    </span>

                                                </button>

                                            </div>

                                            <div className="notification-dropdown-divider"></div>

                                            // View All
                                            <Link
                                                to="/notices"
                                                className="view-all-notifications text-decoration-none"
                                                onClick={() => setIsNotificationOpen(false)}
                                            >
                                                View all notifications
                                            </Link>

                                        </div>

                                    )}

                                </div>
                                */}

                                {/* Profile Menu */}
                                <div
                                    className="profile-menu"
                                    ref={profileRef}
                                >

                                    <button
                                        type="button"
                                        className="user-avatar profile-button"
                                        onClick={() => {
                                            setIsProfileOpen(!isProfileOpen);
                                            // setIsNotificationOpen(false); // notifications hidden
                                        }}
                                        aria-expanded={isProfileOpen}
                                        aria-label={user ? `${user.name} profile menu` : "User profile menu"}
                                        title={user?.name}
                                    >
                                        <AvatarContent
                                            src={avatarUrl}
                                            alt={user?.name ?? "User"}
                                            fallback={user?.initials ?? ""}
                                            className="user-avatar-img"
                                        />
                                    </button>

                                    {/* Profile Dropdown */}
                                    {isProfileOpen && (

                                        <div className="profile-dropdown">

                                            {/* User Information */}
                                            <div className="sidebar-user-info">

                                                <div className="user-avatar">
                                                    <AvatarContent
                                                        src={avatarUrl}
                                                        alt={user?.name ?? "User"}
                                                        fallback={user?.initials ?? ""}
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

                                            <div className="profile-dropdown-divider"></div>

                                            {/* Profile Link ("View Profile") */}
                                            {canViewProfile && (
                                                <>
                                                    <Link
                                                        to="/profile"
                                                        className="profile-dropdown-item text-decoration-none"
                                                        onClick={() => setIsProfileOpen(false)}
                                                    >
                                                        <User size={18} />
                                                        <span>Profile</span>
                                                    </Link>

                                                    <div className="profile-dropdown-divider"></div>
                                                </>
                                            )}

                                            {/* Logout */}
                                            <button
                                                type="button"
                                                className="profile-dropdown-item logout"
                                                onClick={signOut}
                                                disabled={isLoggingOut}
                                                aria-busy={isLoggingOut}
                                            >
                                                <LogOut size={18} />
                                                <span>Sign out</span>
                                            </button>

                                        </div>

                                    )}

                                </div>

                            </div>

                        </div>

                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
