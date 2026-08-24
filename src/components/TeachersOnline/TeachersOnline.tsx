import "./TeachersOnline.css";

interface Teacher {
    id: number;
    initials: string;
    name: string;
    className: string;
    timing: string;
    status: "active" | "offline";
}

const teachers: Teacher[] = [
    {
        id: 1,
        initials: "HK",
        name: "Hafiz Kareem",
        className: "Class A",
        timing: "Morning",
        status: "active",
    },
    {
        id: 2,
        initials: "HK",
        name: "Hafiz Kareem",
        className: "Class A",
        timing: "Morning",
        status: "active",
    },
    {
        id: 3,
        initials: "HK",
        name: "Hafiz Kareem",
        className: "Class A",
        timing: "Morning",
        status: "offline",
    },
];

const TeachersOnline = () => {
    return (
        <div className="teachers-online dashboard-box">

            <div className="dash-box-top">
                <h2 className="dash-box-title">
                    Teachers Online
                </h2>
            </div>

            {/* Teachers List */}
            <div className="teachers-list">

                {teachers.map((teacher) => (
                    <div className="teacher-item" key={teacher.id} >

                        {/* Avatar */}
                        <div className="teacher-avatar">
                            {teacher.initials}
                        </div>

                        {/* Teacher Info */}
                        <div className="teacher-info">
                            <div className="">
                                <h3 className="teacher-name sm-title mb-0">
                                    {teacher.name}
                                </h3>
                                <p className="teacher-class sm-para mb-0">
                                    {teacher.className}
                                    <span> · </span>
                                    {teacher.timing}
                                </p>
                            </div>
                            {/* Status */}
                            <span className={`teacher-status ${teacher.status}`} >
                                {teacher.status === "active"
                                    ? "Active"
                                    : "Offline"}
                            </span>
                        </div>

                    </div>
                ))}
            </div>
        </div>
    );
};

export default TeachersOnline;