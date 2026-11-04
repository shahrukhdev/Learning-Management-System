import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./styles/toastify-theme.css"; // app theme overrides (must load after the library CSS)

import AppRoutes from "./routes/AppRoutes";
import UnauthorizedRedirect from "./routes/UnauthorizedRedirect";

function App() {
  return (
    <>
      <UnauthorizedRedirect />
      <AppRoutes />
      <ToastContainer position="top-right" autoClose={3000} newestOnTop />
    </>
  );
}

export default App;
