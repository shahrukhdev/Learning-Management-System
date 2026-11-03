import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import {
    onUnauthorized,
    SESSION_EXPIRED_MESSAGE,
    SESSION_EXPIRED_TOAST_ID,
} from "../utils/authEvents";
import { LOGIN_PATH } from "./paths";
import { useAuth } from "../hooks/useAuth";

// Renders nothing. When a protected API call returns 401, the Axios
// interceptor clears the token and emits an event; this sends the user to
// the login page via React Router.
const UnauthorizedRedirect = () => {

    const navigate = useNavigate();

    const { clearUser } = useAuth();

    useEffect(() => {
        return onUnauthorized(() => {
            // Token was already removed by the interceptor; drop the user too
            clearUser();
            toast.info(SESSION_EXPIRED_MESSAGE, { toastId: SESSION_EXPIRED_TOAST_ID });
            navigate(LOGIN_PATH, { replace: true });
        });
    }, [navigate, clearUser]);

    return null;
};

export default UnauthorizedRedirect;
