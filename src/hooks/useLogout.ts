import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { logout as logoutRequest } from "../services/authService";
import { removeToken } from "../utils/tokenStorage";
import { parseApiError } from "../utils/apiError";

// Shared across every component using this hook (Header + Sidebar), so
// clicking both buttons can never fire two logout requests at once.
let isLogoutInFlight = false;

export const useLogout = () => {

    const navigate = useNavigate();

    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const loginPath = "/login";

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
                // removes a sent token on 401; removing again is a harmless no-op
                // that also covers the case where no token was sent.
                removeToken();
                toast.info("Your session has expired. Please sign in again.");
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
