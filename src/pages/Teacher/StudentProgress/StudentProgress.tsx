import StudentProgress from "../../Admin/StudentProgress/StudentProgress";

import "./StudentProgress.css";

// Same API-driven page as Admin; the backend limits Teachers to the students
// of their assigned classes. "teacher" keeps the existing Teacher styling hook.
const TeacherStudentProgress = () => <StudentProgress className="teacher" />;

export default TeacherStudentProgress;
