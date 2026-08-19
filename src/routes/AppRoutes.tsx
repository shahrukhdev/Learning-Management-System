import { Routes, Route } from "react-router-dom";

import Home from "../pages/auth/Home";
import Login from "../pages/auth/Login";
import ResetPassword from "../pages/auth/ResetPassword";
import Dashboard from "../pages/Dashboard/Dashboard";


const AppRoutes = () => {
    return (
        <Routes>

            {/* auth routes */}
            <Route path="/" element={ <Home /> } />
            <Route path="/login/:role" element={<Login />} />
            <Route path="/reset-password/:role" element={ <ResetPassword /> } />
            
            {/* Dashboard routes */}
            <Route path="/dashboard" element={<Dashboard />} />
            
        </Routes>
    )
}

export default AppRoutes;