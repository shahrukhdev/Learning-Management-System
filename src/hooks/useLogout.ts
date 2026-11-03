import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { logout as logoutRequest } from "../services/authService";
import { removeToken } from "../utils/tokenStorage";
import { parseApiError } from "../utils/apiError";
import { SESSION_EXPIRED_MESSAGE, SESSION_EXPIRED_TOAST_ID } from "../utils/authEvents";
import { LOGIN_PATH } from "../routes/paths";

// Shared across every component using this hook (Header + Sidebar), so
// clicking both buttons can never fire two logout requests at once.
let isLogoutInFlight = false;

export const useLogout = () => {

    const navigate = useNavigate();

    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const loginPath = LOGIN_PATH;

    const signOut = async (): Promise<void> => {

        if (isLogoutInFlight) return;

        isLogoutInFlight = true;
        setIsLoggingOut(true);

        try {
            const response = await logoutRequest();

            removeToken();
            toast.success(response.message || "Logged out successfully.");
            navigate(loginPath, { replace: true });

        } catch (error) {

            const { status, message } = parseApiError(error);

            if (status === 401) {
                // Session is already invalid server-side. The api.ts interceptor
                // normally clears the token and redirects already; repeating it
                // here is harmless and covers the case where no token was sent.
                // The shared toastId stops a second "session expired" toast.
                removeToken();
                toast.info(SESSION_EXPIRED_MESSAGE, { toastId: SESSION_EXPIRED_TOAST_ID });
                navigate(loginPath, { replace: true });
            } else {
                // Server/network failure: session may still be valid, so stay
                // signed in (token kept) and let the user retry.
                toast.error(message);
            }

        } finally {
            isLogoutInFlight = false;
            setIsLoggingOut(false);
        }
    };

    return { signOut, isLoggingOut };
};
