import { Routes, Route } from "react-router-dom";

import GuestRoute from "./GuestRoute";
import ProtectedRoute from "./ProtectedRoute";
import RoleBasedRoute from "./RoleBasedRoute";

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
import EditRoleDetails from "../pages/Admin/Roles/EditRoleDetails/EditRoleDetails";
import Permissions from "../pages/Admin/Permissions/Permissions";
import CreateNewPermission from "../pages/Admin/Permissions/CreateNewPermission/CreateNewPermission";
import EditPermission from "../pages/Admin/Permissions/EditPermission/EditPermission";
import Profile from "../pages/Admin/Profile/Profile";
import StudentProgress from "../pages/Admin/StudentProgress/StudentProgress";
import StudentProgressDetails from "../pages/Admin/StudentProgress/StudentProgressDetails/StudentProgressDetails";

// Teacher 
import TeacherDashboard from "../pages/Teacher/Dashboard/Dashboard";
import TeacherAttendance from "../pages/Teacher/Attendance/Attendance";
import TeacherHifz from "../pages/Teacher/Hifz/Hifz";
import TeacherNotices from "../pages/Teacher/Notices/Notices";
import TeacherProfile from "../pages/Teacher/Profile/Profile";
import TeacherStudentProgress from "../pages/Teacher/StudentProgress/StudentProgress";
import TeacherStudentProgressDetails from "../pages/Teacher/StudentProgress/StudentProgressDetails/StudentProgressDetails";

const AppRoutes = () => {

    return (

        <Routes>

            {/* Auth Routes (guest-only: signed-in users go to the dashboard) */}

            <Route element={<GuestRoute />}>

            <Route
                path="/"
                element={<Home />}
            />

            <Route
                path="/login/:role?"
                element={<Login />}
            />

            <Route
                path="/reset-password/:role?"
                element={<ResetPassword />}
            />

            </Route>


            {/* Protected Routes (require a token) */}

            <Route element={<ProtectedRoute />}>

            {/* App Routes: prefix-free URLs inside the shared dashboard layout.
                Pages with role-specific versions pick one via RoleBasedRoute. */}

            <Route element={<DashboardLayout />}>

                <Route
                    path="/dashboard"
                    element={<RoleBasedRoute admin={<Dashboard />} teacher={<TeacherDashboard />} />}
                />

                <Route
                    path="/attendance"
                    element={<RoleBasedRoute admin={<Attendance />} teacher={<TeacherAttendance />} />}
                />

                <Route
                    path="/notices"
                    element={<RoleBasedRoute admin={<Notices />} teacher={<TeacherNotices />} />}
                />

                <Route
                    path="/hifz"
                    element={<RoleBasedRoute admin={<Hifz />} teacher={<TeacherHifz />} />}
                />

                <Route
                    path="/students-progress"
                    element={<RoleBasedRoute admin={<StudentProgress />} teacher={<TeacherStudentProgress />} />}
                />

                <Route
                    path="/students-progress/:studentId"
                    element={<RoleBasedRoute admin={<StudentProgressDetails />} teacher={<TeacherStudentProgressDetails />} />}
                />

                <Route
                    path="/profile"
                    element={<RoleBasedRoute admin={<Profile />} teacher={<TeacherProfile />} />}
                />

                {/* System (admin pages only) */}

                <Route
                    path="/system/users"
                    element={<Users />}
                />

                <Route
                    path="/system/roles"
                    element={<Roles />}
                />

                <Route
                    path="/system/roles/create-new"
                    element={<CreateNewRole />}
                />

                {/* Permission matrix screen (unchanged) */}
                <Route
                    path="/system/roles/:roleId/edit"
                    element={<EditRole />}
                />

                {/* Edit Role: name + description */}
                <Route
                    path="/system/roles/:roleId/update"
                    element={<EditRoleDetails />}
                />

                <Route
                    path="/system/permissions"
                    element={<Permissions />}
                />

                <Route
                    path="/system/permissions/create-new"
                    element={<CreateNewPermission />}
                />

                <Route
                    path="/system/permissions/:permissionId/edit"
                    element={<EditPermission />}
                />

            </Route>

            </Route>

        </Routes>

    );

};


export default AppRoutes;