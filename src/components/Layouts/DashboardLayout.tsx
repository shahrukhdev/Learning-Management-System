import { useEffect, useRef, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../SideBar/Sidebar";
import Header from "../Header/Header";

const DashboardLayout = () => {
    const location = useLocation();
    const mainRef = useRef<HTMLDivElement>(null);

    // Mobile / tablet sidebar drawer (visible only below 1200px)
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // On every page change: close the drawer (adjusted during render) ...
    const [drawerPath, setDrawerPath] = useState(location.pathname);

    if (drawerPath !== location.pathname) {
        setDrawerPath(location.pathname);
        setIsSidebarOpen(false);
    }

    // ... and start the new page from the top
    useEffect(() => {
        window.scrollTo(0, 0);

        if (mainRef.current) {
            mainRef.current.scrollTop = 0;
        }
    }, [location.pathname]);

    // Close the drawer with the Escape key
    useEffect(() => {
        if (!isSidebarOpen) return;

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                setIsSidebarOpen(false);
            }
        };

        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [isSidebarOpen]);

    return (
        <div className="dashboard-layout">

            <Sidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
            />

            <div
                className={`sidebar-overlay ${isSidebarOpen ? "show" : ""}`}
                onClick={() => setIsSidebarOpen(false)}
                aria-hidden="true"
            ></div>

            <div className="dashboard-main" ref={mainRef}>

                <Header onMenuClick={() => setIsSidebarOpen(true)} />

                <main className="dashboard-content">
                    <Outlet />
                </main>

            </div>

        </div>
    );
};

export default DashboardLayout;
