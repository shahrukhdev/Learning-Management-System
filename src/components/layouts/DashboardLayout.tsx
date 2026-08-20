import { Outlet } from "react-router-dom";
import Sidebar from "../Sidebar";
import Header from "../Header";

const DashboardLayout = () => {
    return (
        <div className="dashboard-layout">

            <Sidebar />

            <div className="dashboard-main">

                <Header />

                <main className="dashboard-content">
                    <Outlet />
                </main>

            </div>

        </div>
    );
};

export default DashboardLayout;