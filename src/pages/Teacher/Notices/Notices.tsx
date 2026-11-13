import AdminNotices from "../../Admin/Notices/Notices";

// Same API-driven page as Admin (GET/POST/PUT/DELETE /v1/notices, same
// permissions and pagination). "teacher" keeps the existing Teacher styling hook.
const Notices = () => <AdminNotices className="teacher" />;

export default Notices;
