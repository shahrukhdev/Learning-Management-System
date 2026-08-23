import "./HifzOverview.css"
import { Link } from "react-router-dom";
import { MoveRight } from "lucide-react";

const hifzStudents = [
    {
        name: "Ahmad Al-Hassan",
        initials: "AA",
        progress: 22,
        pages: "25/114",
        color: "green",
    },
    {
        name: "Maryam Yusuf",
        initials: "MY",
        progress: 0,
        pages: "0/114",
        color: "blue",
    },
    {
        name: "Bilal Karimi",
        initials: "BK",
        progress: 4,
        pages: "5/114",
        color: "orange",
    },
    {
        name: "Zainab Osman",
        initials: "ZO",
        progress: 0,
        pages: "0/114",
        color: "purple",
    },
];

const HifzOverview = () => {

    const progressStyle = (progress: number) =>
    ({
        "--progress": `${progress}%`,
    } as React.CSSProperties);

    return (

        <div className="hifz-overview dashboard-box">
            <div className="dash-box-top">
                <h2 className="dash-box-title">
                    Hifz Overview
                </h2>
                <Link className="view-details-btn" to="/hifz-overview">
                    View all
                    <MoveRight color="#0F7A47" size={12} strokeWidth={2.5} />
                </Link>
            </div>

            <div className="hifz-list">

                {hifzStudents.map((student, index) => (
                    <div className="hifz-item" key={index}>

                        <div className="student-info">

                            <div className={`user-avatar student-avatar ${student.color}`}>
                                {student.initials}
                            </div>

                            <div className="student-details">
                                <h4 className="sm-title">{student.name}</h4>
                                <span className="sm-para">Hifz progress</span>
                            </div>

                        </div>

                        <div className="student-progress">

                            <div
                                className={`progress-circle ${student.color}`}
                                style={progressStyle(student.progress)}
                            >
                                <span>
                                    {student.progress}%
                                </span>
                            </div>

                            <div className="progress-pages text-end">
                                <span className="sm-para fw-bold">
                                    {student.pages}
                                </span>
                            </div>

                        </div>

                    </div>
                ))}

            </div>

        </div>

    );
};

export default HifzOverview;