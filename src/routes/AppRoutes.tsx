import { Routes, Route } from "react-router-dom";

import Home from "../pages/Auth/Home";
import Login from "../pages/Auth/Login";
import ResetPassword from "../pages/Auth/ResetPassword";

import DashboardLayout from "../components/Layouts/DashboardLayout";

import Dashboard from "../pages/Dashboard/Dashboard";
import Attendance from "../pages/Attendance/Attendance";
import Notices from "../pages/Notices/Notices";
import Hifz from "../pages/Hifz/Hifz";

import Users from "../pages/Users/Users";

import Roles from "../pages/Roles/Roles";
import CreateNewRole from "../pages/Roles/CreateNewRole/CreateNewRole";


const AppRoutes = () => {

    return (

        <Routes>

            {/* Auth Routes */}

            <Route
                path="/"
                element={<Home />}
            />

            <Route
                path="/login/:role"
                element={<Login />}
            />

            <Route
                path="/reset-password/:role"
                element={<ResetPassword />}
            />


            {/* Dashboard Routes */}

            <Route
                path="/dashboard"
                element={<DashboardLayout />}
            >

                <Route
                    index
                    element={<Dashboard />}
                />

                <Route
                    path="attendance"
                    element={<Attendance />}
                />

                <Route
                    path="notices"
                    element={<Notices />}
                />

                <Route
                    path="hifz"
                    element={<Hifz />}
                />


                {/* System */}

                <Route
                    path="system/users"
                    element={<Users />}
                />

                <Route
                    path="system/roles"
                    element={<Roles />}
                />

                <Route
                    path="system/roles/create-new"
                    element={<CreateNewRole />}
                />

            </Route>

        </Routes>

    );

};


export default AppRoutes;