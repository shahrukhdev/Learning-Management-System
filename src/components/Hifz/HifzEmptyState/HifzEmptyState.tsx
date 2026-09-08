import "./HifzEmptyState.css";
import HifzEmptyImg from "../../../assets/images/hifz-empty-state-img.png";

const HifzEmptyState = () => {
    return (
        <div className="hifz-empty-state hifz-box">
            <img className="img-fluid" src={HifzEmptyImg} alt="Hifz Empty State" />

            <h3 className="hifz-empty-title">No Student Selected</h3>

            <p className="hifz-empty-para"> Choose a student from the list on the left to view their progress, memorization map, and session history.</p>
        </div>
    )
};

export default HifzEmptyState;