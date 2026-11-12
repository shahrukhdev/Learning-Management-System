import StudentProgressDetails from "../../../Admin/StudentProgress/StudentProgressDetails/StudentProgressDetails";

import "./StudentProgressDetails.css";

// Same API-driven page as Admin; the backend limits Teachers to the students
// of their assigned classes. "teacher" keeps the existing Teacher styling hook.
const TeacherStudentProgressDetails = () => <StudentProgressDetails className="teacher" />;

export default TeacherStudentProgressDetails;
