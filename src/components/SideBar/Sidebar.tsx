import "./Sidebar.css";
import { NavLink } from "react-router-dom";

import Logo from "../../assets/images/dashboard-logo.svg";
import NavIcon1 from "../../assets/images/nav-icon-1.svg";
import NavIcon2 from "../../assets/images/nav-icon-2.svg";
import NavIcon3 from "../../assets/images/nav-icon-3.svg";
import NavIcon4 from "../../assets/images/nav-icon-4.svg";
import NavIcon5 from "../../assets/images/nav-icon-5.svg";
import NavIcon6 from "../../assets/images/nav-icon-6.svg";
import { LogOut } from "lucide-react";

const navItems = [
    {
        title: "Dashboard",
        path: "/dashboard",
        icon: NavIcon1,
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
    },
    {
        title: "Students",
        path: "/students",
        icon: NavIcon5,
    },
    {
        title: "Admin",
        path: "/admin",
        icon: NavIcon6,
    }
]


const Sidebar = () => {

    const navLinkClass = ({ isActive }) => isActive ? "nav-link active" : "nav-link";

    return (

        <aside className="dashboard-sidebar">

            <div className="sidebar-logo text-center">
                <img className="img-fluid" src={Logo} alt="logo" />
            </div>

            <nav className="sidebar-nav">

                {navItems.map((item, index) => (
                    <NavLink key={index} className={navLinkClass} to={item.path}>
                        <img className="img-fluid nav-icon" src={item.icon} alt={item.title} />
                        {item.title}
                    </NavLink>
                ))}

            </nav>

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
                <button type="button" className="secondary-btn sidebar-logout">
                    <LogOut color="#41441B" size={20} strokeWidth={2} />
                    <span>Sign out</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;