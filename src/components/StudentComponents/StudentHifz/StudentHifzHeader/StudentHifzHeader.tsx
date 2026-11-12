
import StudentDummyImg from "../../../../assets/images/student-dummy-img.png";

import "../../../Hifz/HifzStudentDetails/HifzStudentHeader/HifzStudentHeader.css";
import "./StudentHifzHeader.css";

const StudentHifzHeader = () => {

    const student = {
        name: "Muhammad Ali",
        className: "Class A · Morning",
        rollNumber: "STU-001",
    };

    return (
        <div className="student-hifz-header">

            <div className="student-hifz-profile">

                <div className="student-hifz-avatar">   
                    <img
                        src={StudentDummyImg}
                        alt={student.name}
                    />
                </div>

                <div className="student-hifz-profile-info">

                    <span className="student-hifz-overline">
                        STUDENT PROFILE
                    </span>

                    <h2>{student.name}</h2>

                    <div className="student-hifz-meta">
                        <span>{student.className}</span>
                        <span>{student.rollNumber}</span>
                    </div>

                </div>

            </div>

        </div>
    );
};

export default StudentHifzHeader;
