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
import Permissions from "../pages/Admin/Permissions/Permissions";
import CreateNewPermission from "../pages/Admin/Permissions/CreateNewPermission/CreateNewPermission";
import EditPermission from "../pages/Admin/Permissions/EditPermission/EditPermission";
import Profile from "../pages/Admin/Profile/Profile";
import StudentProgress from "../pages/Admin/StudentProgress/StudentProgress";
import StudentProgressDetails from "../pages/Admin/StudentProgress/StudentProgressDetails/StudentProgressDetails";
import Classes from "../pages/Admin/Classes/Classes";
import CreateNewClass from "../pages/Admin/Classes/CreateNewClasses/CreateNewClasses";
import EditClass from "../pages/Admin/Classes/EditClasses/EditClasses";
import Courses from "../pages/Admin/Courses/Courses";
import CreateNewCourse from "../pages/Admin/Courses/CreateNewCourse/CreateNewCourse";
import EditCourse from "../pages/Admin/Courses/EditCourse/EditCourse";

// Teacher 
import TeacherDashboard from "../pages/Teacher/Dashboard/Dashboard";
import TeacherAttendance from "../pages/Teacher/Attendance/Attendance";
import TeacherHifz from "../pages/Teacher/Hifz/Hifz";
import TeacherNotices from "../pages/Teacher/Notices/Notices";
import TeacherProfile from "../pages/Teacher/Profile/Profile";
import TeacherStudentProgress from "../pages/Teacher/StudentProgress/StudentProgress";
import TeacherStudentProgressDetails from "../pages/Teacher/StudentProgress/StudentProgressDetails/StudentProgressDetails";

// Student
import StudentDashboard from "../pages/Student/Dashboard/Dashboard";
import StudentAttendance from "../pages/Student/Attendance/Attendance";
import StudentNotices from "../pages/Student/Notices/Notices";
import MyProgress from "../pages/Student/MyProgress/MyProgress";
import StudentHifz from "../pages/Student/Hifz/HIfz";

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


            {/* Admin Routes */}

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

                <Route
                    path="system/permissions"
                    element={<Permissions />}
                />

                <Route
                    path="system/permissions/create-new"
                    element={<CreateNewPermission />}
                />

                <Route
                    path="system/permissions/:permissionId/edit"
                    element={<EditPermission />}
                />

                <Route path="academic/classes" element={<Classes />} />
                <Route path="academic/classes/create-new" element={<CreateNewClass />} />
                <Route path="academic/classes/:classId/edit" element={<EditClass />} />
                <Route path="academic/courses" element={<Courses />} />
                <Route path="academic/courses/create-new" element={<CreateNewCourse />} />
                <Route path="academic/courses/:courseId/edit" element={<EditCourse />} />

            </Route>

            {/* Teacher Routes */}

            <Route
                path="/teacher/dashboard"
                element={<DashboardLayout />}
            >

                <Route
                    index
                    element={<TeacherDashboard />}
                />

                <Route
                    path="attendance"
                    element={<TeacherAttendance />}
                />

                <Route
                    path="hifz"
                    element={<TeacherHifz />}
                />

                <Route
                    path="notices"
                    element={<TeacherNotices />}
                />

                <Route
                    path="students-progress"
                    element={<TeacherStudentProgress />}
                />

                <Route
                    path="students-progress/:studentId"
                    element={<TeacherStudentProgressDetails /> }
                />

                <Route
                    path="profile"
                    element={<TeacherProfile />}
                />

            </Route>

            {/* Student Routes */}

            {/* Student Routes */}

            <Route
                path="/student/dashboard"
                element={<DashboardLayout />}
            >

                <Route
                    index
                    element={<StudentDashboard />}
                />

                <Route
                    path="attendance"
                    element={<StudentAttendance />}
                />

                <Route
                    path="notices"
                    element={<StudentNotices />}
                />

                <Route
                    path="notices"
                    element={<StudentNotices />}
                />

                <Route
                    path="my-progress"
                    element={<MyProgress />}
                />

                <Route
                    path="my-hifz"
                    element={<StudentHifz />}
                />

            </Route>

        </Routes>

    );

};


export default AppRoutes;