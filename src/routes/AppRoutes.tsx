import { Routes, Route } from "react-router-dom";

import Home from "../pages/auth/Home";
import Login from "../pages/auth/Login";
import ResetPassword from "../pages/auth/ResetPassword";
import DashboardLayout from "../components/layouts/DashboardLayout";
import Dashboard from "../pages/Dashboard/Dashboard";


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
                <Route path="attendance" element="" />
                <Route path="hifz" element="" />
                <Route path="notices" element="" />
                <Route path="students" element="" />
                <Route path="admin" element="" />

            </Route>
            
        </Routes>
    )
}

export default AppRoutes;