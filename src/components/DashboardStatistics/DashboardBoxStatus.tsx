import "./DashboardBoxStatus.css";

interface DashboardBoxStatusProps {
    // No data yet (first load)
    isLoading: boolean;
    error: string | null;
    onRetry: () => void;
    isEmpty: boolean;
    emptyText: string;
    loadingText?: string;
}

// Loading / error / empty line for one dashboard box (compact, same style as
// the other lists). Renders nothing once there is data to show.
const DashboardBoxStatus = ({
    isLoading,
    error,
    onRetry,
    isEmpty,
    emptyText,
    loadingText = "Loading...",
}: DashboardBoxStatusProps) => {

    if (isLoading) {
        return (
            <div className="dashboard-box-status" role="status">
                <span className="spinner-border spinner-border-sm" aria-hidden="true"></span>
                {loadingText}
            </div>
        );
    }

    if (error) {
        return (
            <div className="dashboard-box-status">
                <span>{error}</span>
                <button type="button" className="table-retry-button" onClick={onRetry}>
                    Try again
                </button>
            </div>
        );
    }

    if (isEmpty) {
        return <div className="dashboard-box-status">{emptyText}</div>;
    }

    return null;
};

export default DashboardBoxStatus;
