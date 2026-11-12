import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { logout as logoutRequest } from "../services/authService";
import { removeToken } from "../utils/tokenStorage";
import { parseApiError } from "../utils/apiError";
import { SESSION_EXPIRED_MESSAGE, SESSION_EXPIRED_TOAST_ID } from "../utils/authEvents";
import { LOGIN_PATH } from "../routes/paths";
import { useAuth } from "./useAuth";

// Shared across every component using this hook (Header + Sidebar), so
// clicking both buttons can never fire two logout requests at once.
let isLogoutInFlight = false;

export const useLogout = () => {

    const navigate = useNavigate();

    const { clearUser } = useAuth();

    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const loginPath = LOGIN_PATH;

    const signOut = async (): Promise<void> => {

        if (isLogoutInFlight) return;

        isLogoutInFlight = true;
        setIsLoggingOut(true);

        // Ends the local session and goes straight to /login. The token is
        // removed first so the login page's guest guard lets the user in;
        // clearing the user (and its permissions) also removes the stored copy.
        const endLocalSession = () => {
            removeToken();
            navigate(loginPath, { replace: true });
            clearUser();
        };

        try {
            const response = await logoutRequest();

            endLocalSession();
            toast.success(response.message || "Logged out successfully.");

        } catch (error) {

            const { status, message } = parseApiError(error);

            // Always signed out locally, even if the request failed
            endLocalSession();

            if (status === 401) {
                // Session was already invalid server-side. The shared toastId
                // stops a second "session expired" toast from the interceptor.
                toast.info(SESSION_EXPIRED_MESSAGE, { toastId: SESSION_EXPIRED_TOAST_ID });
            } else {
                // Server/network failure: the server session could not be ended,
                // but this device is signed out
                toast.info(message ? `Logged out. ${message}` : "Logged out.");
            }

        } finally {
            isLogoutInFlight = false;
            setIsLoggingOut(false);
        }
    };

    return { signOut, isLoggingOut };
};
