import { Routes, Route } from "react-router-dom";

import Home from "../pages/Auth/Home";
import Login from "../pages/Auth/Login";
import ResetPassword from "../pages/Auth/ResetPassword";
import DashboardLayout from "../components/Layouts/DashboardLayout";
import Dashboard from "../pages/Dashboard/Dashboard";
import Attendance from "../pages/Attendance/Attendance";
import Notices from "../pages/Notices/Notices";


const AppRoutes = () => {
    return (
        <Routes>

            {/* auth routes */}
            <Route path="/" element={ <Home /> } />
            <Route path="/login/:role" element={<Login />} />
            <Route path="/reset-password/:role" element={ <ResetPassword /> } />
            
            {/* Dashboard Routes */}
            <Route path="/dashboard" element={<DashboardLayout />}>

                <Route index element={<Dashboard />} />

                {/* Future dashboard pages */}
                <Route path="attendance" element={<Attendance />} />
                <Route path="notices" element={<Notices />} />

            </Route>
            
        </Routes>
    )
}

export default AppRoutes;