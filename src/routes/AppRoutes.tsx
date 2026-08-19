import { Routes, Route } from "react-router-dom";

import Home from "../pages/auth/Home";
import Login from "../pages/auth/Login";
import ResetPassword from "../pages/auth/ResetPassword";


const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={ <Home /> } />
            <Route path="/login/:role" element={<Login />} />
            <Route path="/reset-password" element={ <ResetPassword /> } />
        </Routes>
    )
}

export default AppRoutes;