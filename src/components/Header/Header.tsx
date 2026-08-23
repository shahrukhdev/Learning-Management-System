import "./header.css";

import { useEffect, useRef, useState } from "react";
import { Bell, Search, User, Settings, LogOut, Check } from "lucide-react";

const Header = () => {

    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);
    const profileRef = useRef(null);
    const notificationRef = useRef(null);

    useEffect(() => {

        const handleClickOutside = (event) => {

            if (
                profileRef.current &&
                !profileRef.current.contains(event.target)
            ) {
                setIsProfileOpen(false);
            }

            if (
                notificationRef.current &&
                !notificationRef.current.contains(event.target)
            ) {
                setIsNotificationOpen(false);
            }

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

                            <div className="header-actions">

                                <div className="notification-menu" ref={notificationRef}>

                                    <button type="button"
                                        className="header-notification"
                                        onClick={() => {
                                            setIsNotificationOpen(!isNotificationOpen);
                                            setIsProfileOpen(false);
                                        }}
                                        aria-label="Notifications"
                                    >
                                        <Bell size={18} strokeWidth={2} />

                                        <span className="notification-dot"></span>
                                    </button>

                                    {isNotificationOpen && (
                                        <div className="notification-dropdown">

                                            <div className="notification-dropdown-header">
                                                <div>
                                                    <h6>Notifications</h6>
                                                    <span>You have 3 new notifications</span>
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


                                            <div className="notification-list">

                                                <button
                                                    type="button"
                                                    className="notification-item unread"
                                                >
                                                    <span className="notification-item-icon">
                                                        <Bell size={16} />
                                                    </span>

                                                    <span className="notification-item-content">
                                                        <strong>New notice posted</strong>
                                                        <small>
                                                            Ramadan Schedule has been updated.
                                                        </small>
                                                        <time>5 minutes ago</time>
                                                    </span>

                                                    <span className="notification-unread-dot"></span>
                                                </button>


                                                <button
                                                    type="button"
                                                    className="notification-item unread"
                                                >
                                                    <span className="notification-item-icon">
                                                        <User size={16} />
                                                    </span>

                                                    <span className="notification-item-content">
                                                        <strong>New student registered</strong>
                                                        <small>
                                                            Ahmed Al-Hassan joined the madrassah.
                                                        </small>
                                                        <time>1 hour ago</time>
                                                    </span>

                                                    <span className="notification-unread-dot"></span>
                                                </button>


                                                <button
                                                    type="button"
                                                    className="notification-item"
                                                >
                                                    <span className="notification-item-icon">
                                                        <Check size={16} />
                                                    </span>

                                                    <span className="notification-item-content">
                                                        <strong>Attendance completed</strong>
                                                        <small>
                                                            Today's attendance has been completed.
                                                        </small>
                                                        <time>3 hours ago</time>
                                                    </span>
                                                </button>

                                            </div>


                                            <div className="notification-dropdown-divider"></div>


                                            <button
                                                type="button"
                                                className="view-all-notifications"
                                            >
                                                View all notifications
                                            </button>

                                        </div>
                                    )}
                                </div>

                                <div className="profile-menu" ref={profileRef}>
                                    
                                    <button type="button" className="user-avatar profile-button" onClick={() => { setIsProfileOpen(!isProfileOpen); setIsNotificationOpen(false); }} aria-expanded={isProfileOpen}>
                                        AM
                                    </button>

                                    {/* Dropdown */}
                                    {isProfileOpen && (
                                        <div className="profile-dropdown">

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

                                            <div className="profile-dropdown-divider"></div>

                                            <button
                                                type="button"
                                                className="profile-dropdown-item"
                                            >
                                                <User size={18} />
                                                <span>Profile</span>
                                            </button>

                                            <button
                                                type="button"
                                                className="profile-dropdown-item"
                                            >
                                                <Settings size={18} />
                                                <span>Settings</span>
                                            </button>

                                            <div className="profile-dropdown-divider"></div>

                                            <button
                                                type="button"
                                                className="profile-dropdown-item logout"
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