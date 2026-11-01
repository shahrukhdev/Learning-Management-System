import { Routes, Route } from "react-router-dom";

import Home from "../pages/Auth/Home";
import Login from "../pages/Auth/Login";
import ResetPassword from "../pages/Auth/ResetPassword";

import DashboardLayout from "../components/Layouts/DashboardLayout";

import Dashboard from "../pages/Admin/Dashboard/Dashboard";
import Attendance from "../pages/Admin/Attendance/Attendance";
import Notices from "../pages/Admin/Notices/Notices";
import Hifz from "../pages/Admin/Hifz/Hifz";

import Users from "../pages/Admin/Users/Users";

import Roles from "../pages/Admin/Roles/Roles";
import CreateNewRole from "../pages/Admin/Roles/CreateNewRole/CreateNewRole";
import EditRole from "../pages/Admin/Roles/EditRole/EditRole";
import Profile from "../pages/Admin/Profile/Profile";
import StudentProgress from "../pages/Admin/StudentProgress/StudentProgress";
import StudentProgressDetails from "../pages/Admin/StudentProgress/StudentProgressDetails/StudentProgressDetails";


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
                path="/admin/dashboard"
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

                <Route
                    path="students-progress"
                    element={<StudentProgress />}
                />

                <Route
                    path="students-progress/:studentId"
                    element={<StudentProgressDetails /> }
                />

                <Route
                    path="profile"
                    element={<Profile />}
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

                <Route
                    path="system/roles/:roleId/edit"
                    element={<EditRole />}
                />

            </Route>

        </Routes>

    );

};


export default AppRoutes;