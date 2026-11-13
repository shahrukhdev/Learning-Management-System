
import StudentDummyImg from "../../../../assets/images/student-dummy-img.png";

import AvatarContent from "../../../Avatar/AvatarContent";
import type { MyHifzProfile } from "../../../../types/myHifz.types";

import "../../../Hifz/HifzStudentDetails/HifzStudentHeader/HifzStudentHeader.css";
import "./StudentHifzHeader.css";

interface StudentHifzHeaderProps {
    // From GET /v1/my-hifz `student` (null until loaded)
    student: MyHifzProfile | null;
    // Signed-in user's name while the profile loads
    fallbackName: string;
}

const StudentHifzHeader = ({ student, fallbackName }: StudentHifzHeaderProps) => {

    const name = student?.name || fallbackName;

    return (
        <div className="student-hifz-header">

            <div className="student-hifz-profile">

                <div className="student-hifz-avatar">
                    <AvatarContent
                        src={student?.image ?? null}
                        alt={name}
                        fallback={<img src={StudentDummyImg} alt={name} />}
                    />
                </div>

                <div className="student-hifz-profile-info">

                    <span className="student-hifz-overline">
                        STUDENT PROFILE
                    </span>

                    <h2>{name}</h2>

                    {(student?.class_name || student?.admission_number) && (
                        <div className="student-hifz-meta">
                            {student.class_name && <span>{student.class_name}</span>}
                            {student.admission_number && <span>{student.admission_number}</span>}
                        </div>
                    )}

                </div>

            </div>

        </div>
    );
};

export default StudentHifzHeader;
