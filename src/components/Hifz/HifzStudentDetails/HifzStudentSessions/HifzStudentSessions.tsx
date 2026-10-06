import "./HifzStudentSessions.css";

/* ================================
   Types
================================ */

type SessionRating = | "strong" | "good" | "needs-work" | "weak";

interface HifzStudentSession {
    id: number;
    date: string;
    rating: SessionRating;
    portion: string;
    description: string;
    mistakes?: number;
}

/* ================================
   Session Data
================================ */

const sessions: HifzStudentSession[] = [

    {
        id: 1,
        date: "2026-04-09",
        rating: "good",
        portion: "An-Nasr → Al-Masad",
        description: "Small mistakes in Al-Masad",
        mistakes: 2,
    },

    {
        id: 2,
        date: "2026-04-07",
        rating: "strong",
        portion: "Al-Ikhlas → An-Nas",
        description: "Perfect recitation",
    },

    {
        id: 3,
        date: "2026-04-09",
        rating: "good",
        portion: "An-Nasr → Al-Masad",
        description: "Small mistakes in Al-Masad",
        mistakes: 2,
    },

    {
        id: 4,
        date: "2026-04-05",
        rating: "needs-work",
        portion: "Al-Falaq → An-Nas",
        description: "Needs more revision",
        mistakes: 4,
    },

    {
        id: 5,
        date: "2026-04-03",
        rating: "weak",
        portion: "Al-Kafirun → Al-Ma'un",
        description: "Several mistakes during recitation",
        mistakes: 6,
    },
];

/* ================================
   Rating
================================ */

const ratingData = {
    strong: {
        label: "Strong",
        stars: "★★★",
    },

    good: {
        label: "Good",
        stars: "★★",
    },

    "needs-work": {
        label: "Needs Work",
        stars: "★",
    },

    weak: {
        label: "Weak",
        stars: "✗",
    },

};


/* ================================
   Component
================================ */

const HifzStudentSessions = () => {

    return (

        <div className="hifz-student-sessions">

            {sessions.map((session) => {

                const rating = ratingData[session.rating];

                return (

                    <div className={`hifz-session-card hifz-session-${session.rating}`} key={session.id} >

                        {/* =========================
                            Left Side
                        ========================= */}

                        <div className="hifz-session-left">

                            {/* Date */}

                            <span className="hifz-session-date">
                                {session.date}
                            </span>

                            {/* Rating */}

                            <div className="hifz-session-rating">

                                <span className="hifz-session-rating-label">
                                    {rating.label}
                                </span>

                                <span className="hifz-session-rating-symbol">
                                    {rating.stars}
                                </span>

                            </div>

                        </div>

                        {/* =========================
                            Right Side
                        ========================= */}

                        <div className="hifz-session-content">

                            {/* Surah / Portion */}

                            <h3 className="hifz-session-portion m-0">

                                {session.portion}

                            </h3>

                            {/* Description */}

                            <p className="hifz-session-description m-0">

                                {session.description}

                            </p>

                            {/* Mistakes */}

                            {session.mistakes !== undefined && (

                                <div className="hifz-session-mistakes">

                                    <span>
                                        ✗ {session.mistakes} mistakes
                                    </span>

                                </div>

                            )}

                        </div>

                    </div>

                );

            })}

        </div>

    );

};

export default HifzStudentSessions;